const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb'); // Import MongoClient

const app = express();
const port = 3000;

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
const uri = 'mongodb+srv://anthonynoyes16:Xi1RaL7n0hPG221z@vibewrist.lhxehif.mongodb.net/?retryWrites=true&w=majority&appName=VibeWrist';
const client = new MongoClient(uri);


async function addUser(client, body) {
    const existingUser = await client.db("VibeWrist").collection("users").findOne({ username: body.username });
    if (existingUser) {
        console.log(`User with username '${body.username}' already exists.`);
        return; // Exit the function if user already exists
    }
    const result = await client.db("VibeWrist").collection("users").insertOne(body);
    console.log(`New user created with the following id: ${result.insertedId}`);
}


app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await client.db("VibeWrist").collection("users").findOne({ username });
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
    const user = await client.db("VibeWrist").collection("users").findOne({ username: body.username, password: body.password });
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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
