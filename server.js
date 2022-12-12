// all the juice
const express = require('express');
const path = require('path');
const fs = require('fs');

// helper method for generating unique ids
const uuid = require('./helpers/uuid');
// const db = require('./db/db.json');
const { response } = require('express');

// port used when deployed || locally
const PORT = process.env.PORT || 3001;

const app = express();

// calling middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
// ? ^^ what does this do?

// return notes.html file
// return all info w GET *
app.get('/', (req, res) =>
    res.sendFile('/public/index.html'));


// API routes:
// GET/api/notes should read the db.json and return all saved notes as JSON
app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});


//       POST / api/notes should receive new note to save on the request body, add to the db.json file, and return the new route to the client 
//      each note must have a unique id when its saved (look for npm package that could do this for me)

app.post('api/notes', (req, res) => {
    let db = fs.readFile('./db/db.json');
    db = JSON.parse(db);
    res.json(db);

    let newNote = {
        title: req.body.title, 
        text: req.body.text,
        id: uuid(),
    }

    db.push(newNote);
    fs.writeFile('/db/db.json', JSON.stringify(db));
    res.json(db);
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);