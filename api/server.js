const express = require("express");

const Animals = require("./animals/animals-model.js");

const server = express();

server.use(express.json());

server.get("/", (request, response) => {
  response.json({ message: 'The API is up and running.' });
});

server.get("/animals", (request, response) => {
  Animals.getAll()
    .then(animals => {
      response.json(animals);
    })
    .catch(error => {
      response.status(500).json(error);
    });
});

server.get("/animals/:id", async (request, response) => {
  try {
    const result = await Animals.getByID(request.params.id);
    if(!result) {
      response.status(404).json({ message: 'That animal was not found.' });
      return;
    }
    response.json(result);
  } catch(error) {
    response.status(500).json({ message: error.message });
  }
});

server.post("/animals", async (request, response) => {
  try {
    if(!request.body.name) {
      response.status(400).json({ message: 'Please provide a name for the new animal.' });
      return;
    }
    const result = await Animals.insert(request.body);
    response.status(201).json(result);
  } catch(error) {
    response.status(500).json({ message: error.message });
  }
});

server.delete("/animals/:id", async (request, response) => {
  try {
    const result = await Animals.remove(request.params.id);
    if(!result) {
      response.status(404).json({ message: 'That animal was not found.' });
      return;
    }
    response.json(result);
  } catch(error) {
    response.status(500).json({ message: error.message });
  }
});

server.put("/animals/:id", async (request, response) => {
  try {
    const result = await Animals.update(request.params.id, request.body);
    if(!result) {
      response.status(404).json({ message: 'That animal was not found.' });
      return;
    }
    response.json(result);
  } catch(error) {
    response.status(500).json({ message: error.message });
  }
});

module.exports = server;