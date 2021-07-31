'use strict';

const { MongoClient } = require('mongodb');


const { MONGODB_URI } = process.env;

let dbPromise;

module.exports = {
  async connectToDB(uri) {
    const client = await MongoClient.connect(uri)
      .catch(err => {
        console.error('MongoDB connection error:', err);
        throw err;
      });

    process.on('exit', () => {
      console.log('Closing MongoDB connection...');
      client.close(false);
    });

    const db = client.db();

    return db;
  },

  async db() {
    if (!dbPromise) {
      dbPromise = this.connectToDB(MONGODB_URI);
    }
    return dbPromise;
  },

  async collection(name) {
    return (await this.db()).collection(name);
  },

  // Rooms

  async getRooms() {
    return (await this.collection('rooms'))
      .find({}, { projection: { coords: 1 } })
      .toArray();
  },

  // Moves

  async getMoves(characterId) {
    return (await this.collection('moves'))
      .find(characterId ? { characterId } : {})
      .sort({ _id: 1 })
      .toArray();
  },
};
