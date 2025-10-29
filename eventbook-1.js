const express = require('express');
const app = express();
app.use(express.json());

let events = [
    { id: 1, name: "Node.js Workshop", date: "2025-11-01" },
    { id: 2, name: "React Bootcamp", date: "2025-11-05" }
];

// CREATE Event
app.post('/events', (req, res) => {
    const newEvent = { id: events.length + 1, ...req.body };
    events.push(newEvent);
    res.status(201).json(newEvent);
});

// READ All Events
app.get('/events', (req, res) => {
    res.json(events);
});

// READ Single Event
app.get('/events/:id', (req, res) => {
    const event = events.find(e => e.id == req.params.id);
    if(event) res.json(event);
    else res.status(404).send("Event not found");
});

// UPDATE Event
app.put('/events/:id', (req, res) => {
    const index = events.findIndex(e => e.id == req.params.id);
    if(index !== -1){
        events[index] = { id: events[index].id, ...req.body };
        res.json(events[index]);
    } else res.status(404).send("Event not found");
});

// DELETE Event
app.delete('/events/:id', (req, res) => {
    const index = events.findIndex(e => e.id == req.params.id);
    if(index !== -1){
        const deleted = events.splice(index,1);
        res.json(deleted[0]);
    } else res.status(404).send("Event not found");
});

app.listen(3000, () => console.log("Server running on port 3000"));