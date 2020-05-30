const assert = require('assert');
const ObjectId = require('mongodb').ObjectId;

class Service {
  constructor({ connection }) {
    assert(connection, 'expected connections');
    this.connection = connection;
    this.connection.connect();
  }

  async saveUser(user) {
    try {
      if (user) {
        const status = await this.connection.collection.insertOne(user);
        if (status.result) {
          return status.ops;
        }
      } else {
        console.log('No user provided');
      }
    } catch (err) {
      console.log('error: ', err);
    }
  }

  async getUser(id) {
    try {
      if (id) {
        const objectId = new ObjectId(id);
        const result = await this.connection.collection.findOne({
          _id: objectId,
        });
        return this.__handleResponse(result);
      } else {
        console.log('No user provided');
      }
    } catch (err) {
      console.log('error: ', err);
    }
  }

  async getUsersByGenre(value) {
    try {
      if (value) {
        const result = await this.connection.collection
          .find({
            gender: value,
          })
          .toArray();
        return this.__handleResponse(result);
      } else {
        console.log('No genre provided');
      }
    } catch (err) {
      console.log('error: ', err);
    }
  }

  async getUsers() {
    try {
      const result = await this.connection.collection.find({}).toArray();
      return this.__handleResponse(result);
    } catch (err) {
      console.log('error: ', err);
    }
  }

  __handleResponse(response) {
    return response ? response : null;
  }
}

module.exports = {
  Service,
};
