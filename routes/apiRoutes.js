// dependencies
const path = require('path');
const fs = require('fs');

// linked helper func
const uuid = require('/db/db.json');

// export routing
module.exports = (app) => {

// GET/api/notes should read the db.json and return all saved notes as JSON
app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// POST / api/notes should receive new note to save on the request body, add to the db.json file, and return the new route to the client 
// each note must have a unique id when its saved (look for npm package that could do this for me)

app.post('api/notes', (req, res) => {
    let db = fs.readFile('./db/db.json');
    db = JSON.parse(db);
    res.json(db);

// newNote key/value pairs + unique id as determined by the helper function
    const newNote = {
        title: req.body.title, 
        text: req.body.text,
        id: uuid(),
    }

//  push newNote to parsed (db) array object into single array
    db.push(newNote);

// write file with combined data
    fs.writeFile('/db/db.json', JSON.stringify(db));
    res.json(db);
});

}