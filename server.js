// dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
const database = require('./db/db.json')
// helper method for generating unique ids
const uuid = require('./helpers/uuid');
// Gives the express juice
const app = express();
// Port used when deployed || locally
const PORT = process.env.PORT || 3001;
// calling middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
// ? ^^ what does this do?

// HTML routes (could be moved to html route file?)
// On page load, index.html
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html')));
// Path to notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// API routes (could be moved to api route file??)
// Gets notes list from db file
app.get('/api/notes', (req, res) => {
    res.json(database);
})
// Add new note to list
app.post('/api/notes', (req, res) => {
    let jsonFilePath = path.join(__dirname, '/db/db.json');
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            note_id: uuid(),
        };
        // Obtain existing notes
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.log(err)
            } else {
                // Convert string into JSON object
                const parsedNotes = JSON.parse(data);
                // Add new note
                parsedNotes.push(newNote);
                // Write updated notes list back to db file
                fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4), (writeErr) =>
                    writeErr
                        ? console.error(writeErr)
                        : console.info('Successfully saved note!')
                );
            }
        });
        const response = {
            status: 'success!',
            body: newNote,
        };
        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in saving note');
    }
});
// Add delete note section (optional)


// Wildcard route to send users to a index.html
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html')));
// Note telling where to access local host
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);