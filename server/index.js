'use strict';

const express = require('express');
const Router = require('express-promise-router');

const db = require('./db');


const app = express();
const router = Router();

router.get('/data', async (req, res) => {
  const { char } = req.query;
  const [rooms, moves] = await Promise.all([
    db.getRooms(),
    db.getMoves(char),
  ]);
  res.json({
    rooms: rooms.map(room => room.coords),
    moves: moves.map(move => [move.from, move.to]),
  });
});

app.use('/', router);
app.use('/', express.static('./public'));

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send(err.message);
});

const port = process.env.PORT || 6060;
app.listen(port, () => console.log(`Listening on port ${port}.`));
