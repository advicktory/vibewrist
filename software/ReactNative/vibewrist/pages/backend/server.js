const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb'); // Import MongoClient

const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors()); // Use CORS to allow all origins (for development)

app.use(bodyParser.json());

// async function main() { // Add parameters to main function
//     const uri = 'mongodb+srv://anthonynoyes16:Xi1RaL7n0hPG221z@vibewrist.lhxehif.mongodb.net/?retryWrites=true&w=majority&appName=Test';
//     const client = new MongoClient(uri);

//     try {
//         await client.connect();
//         // await addUser(client, { username, password }); // Pass username and password to addUser
//     } catch (e) {
//         console.error(e);
//     } finally {
//         await client.close();
//     }
// }
const uri =
  'mongodb+srv://anthonynoyes16:Xi1RaL7n0hPG221z@vibewrist.lhxehif.mongodb.net/?retryWrites=true&w=majority&appName=VibeWrist';
const client = new MongoClient(uri);

async function addUser(client, body) {
  const existingUser = await client
    .db('VibeWrist')
    .collection('users')
    .findOne({ username: body.username });
  if (existingUser) {
    console.log(`User with username '${body.username}' already exists.`);
    return; // Exit the function if user already exists
  }
  const result = await client
    .db('VibeWrist')
    .collection('users')
    .insertOne(body);
  console.log(`New user created with the following id: ${result.insertedId}`);
}

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await client
      .db('VibeWrist')
      .collection('users')
      .findOne({ username });
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
    } else {
      await addUser(client, { username, password });
      res.status(201).json({ message: 'User registered successfully' });
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function loginUser(client, body) {
  const user = await client
    .db('VibeWrist')
    .collection('users')
    .findOne({ username: body.username, password: body.password });
  return user;
}

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await loginUser(client, { username, password });
    if (user) {
      res.status(200).json({ message: 'Login successful', user });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function savePreset(client, presetData) {
  try {
    const result = await client
      .db('VibeWrist')
      .collection('presets')
      .insertOne(presetData);
    console.log(`New preset saved with the following id: ${result.insertedId}`);
    return result.insertedId;
  } catch (error) {
    console.error('Error saving preset:', error);
    throw error; // Throw error to handle it in the calling function
  }
}

app.post('/savePreset', async (req, res) => {
  const presetData = req.body;
  try {
    const insertedId = await savePreset(client, presetData);
    res.status(201).json({ message: 'Preset saved successfully', insertedId });
  } catch (error) {
    console.error('Error saving preset:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/saveBleSetting', async (req, res) => {
  console.log('Request received', req.body); // Log the body to ensure it's receiving data
  // Your existing code...
  const { username, detectionRange, vibrationRhythm, vibrationStrength } =
    req.body;
  console.log('here');
  try {
    //await client.connect();
    const database = client.db('VibeWrist');
    const userSettings = database.collection('userSettings');
    // Update the user's settings in the database
    const result = await userSettings.updateOne(
      { username: username },
      { $set: { detectionRange, vibrationRhythm, vibrationStrength } },
      { upsert: true } // If the user does not exist, create a new entry
    );

    if (result.modifiedCount === 1 || result.upsertedCount === 1) {
      res.status(200).send('User settings updated successfully');
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating user settings');
  }
});

app.get('/getPresets/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const presets = await client
      .db('VibeWrist')
      .collection('presets')
      .find({ username }) // Query presets based on the username
      .toArray();
    res.status(200).json({ presets });
  } catch (error) {
    console.error('Error fetching presets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function deletePreset(client, presetId, username) {
  try {
    const result = await client
      .db('VibeWrist')
      .collection('presets')
      .deleteOne({ presetId, username }); // Add username to filter criteria
    console.log(`Preset deleted with the following id: ${presetId}`);
    return result.deletedCount;
  } catch (error) {
    console.error('Error deleting preset:', error);
    throw error; // Throw error to handle it in the calling function
  }
}

// Route to handle deleting presets
app.delete('/deletePreset/:username/:presetId', async (req, res) => {
  const { username, presetId } = req.params;
  try {
    const deletedCount = await deletePreset(client, presetId, username);
    if (deletedCount === 1) {
      res.status(200).json({ message: 'Preset deleted successfully' });
    } else {
      res.status(404).json({ error: 'Preset not found' });
    }
  } catch (error) {
    console.error('Error deleting preset:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/leaderboard', async (req, res) => {
  try {
    const leaderboardData = await client.db('VibeWrist').collection('userStats')
      .find({}, { projection: { username: 1, timeStudied: 1, violations:1 } }) //Empty filter means fetch all documents; Include username, timeStudied, and violations fields
      .sort({ timeStudied: -1,violations:-1 }) // Sort by timeStudied and violations in descending order
      .toArray();
    console.log(leaderboardData);

    res.status(200).json(leaderboardData);
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
