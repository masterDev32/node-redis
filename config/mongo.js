const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');

class Connection {
  constructor() {
    this.db = null;
    this.collection = null;
    this.collectionName = 'users';
    this.dbName = 'f-dev-db';
  }

  async connect() {
    const url = 'mongodb://mongo:27017';

    try {
      const mongo = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      this.db = mongo.db(this.dbName);
      this.collection = await this.db.collection(this.collectionName);
      this.__insertData();
    } catch (error) {
      console.log(`error while connecting to mongo: ${error}`);
    }
  }

  close() {
    console.log('cloded');
    this.db.close();
    this.db = null;
    this.collection = null;
  }

  async __insertData() {
    const collections = await this.db.listCollections().toArray();
    const isCollectionExist = collections
      .map((c) => c.name)
      .includes(this.collectionName);
    if (!isCollectionExist) {
      const data = JSON.parse(fs.readFileSync('./mock/mock_user_data.json'));
      this.collection
        .insertMany(data)
        .then(() => {
          console.log('Data has been inserted successfully.');
        })
        .catch((error) => {
          console.log(`Failed when inserting data. Error: ${error}`);
        });
    }
  }
}
module.exports = {
  Connection,
};
