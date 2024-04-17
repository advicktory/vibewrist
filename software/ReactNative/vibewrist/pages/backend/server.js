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
const uri = 'mongodb+srv://anthonynoyes16:Xi1RaL7n0hPG221z@vibewrist.lhxehif.mongodb.net/?retryWrites=true&w=majority&appName=Test';
const client = new MongoClient(uri);


async function addUser(client, body) {
    const result = await client.db("test").collection("users").insertOne(body);
    console.log(`New user created with the following id: ${result.insertedId}`);
}

app.post('/register', async (req, res) => { // Endpoint to handle registration requests
    const { username, password } = req.body;
    try {
        await addUser(client, { username, password }); // Pass username and password to addUser
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
