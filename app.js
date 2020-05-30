const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Redis = require('ioredis');
const { Connection } = require('./config/mongo');
const { Service } = require('./services/service');
const { mapUserInfo, mapUsersInfo } = require('./helper/userMapper');

// config
const PORT = 3000;
const redisConf = {
  host: 'redis-server',
  port: 6379,
};

// create express app
const app = express();

// create redis connection
const redis = new Redis(redisConf);

// create service connection
const service = new Service({ connection: new Connection() });

// app middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Server working');
});

app.post('/user', async (req, res) => {
  const { user } = req.body;
  const response = await service.saveUser(user);
  const userInfo = [];
  response.forEach((element) => {
    userInfo.push(mapUserInfo(element));
  });
  res.send(userInfo);
});

app.get('/users', async (req, res) => {
  const response = await service.getUsers();
  res.status(200).json(mapUsersInfo(response));
});

app.get('/user/:id', async (req, res) => {
  const { id } = req.params;
  userInfo = await service.getUser(id);
  __handleServiceCall(id, 'getUser', res);
});

app.get('/users/genre/:gender', async (req, res) => {
  const { gender } = req.params;
  userInfo = await service.getUsersByGenre(gender);
  __handleServiceCall(gender, 'gender', res);
});

app.listen(PORT, () => {
  console.log(`Running on ${PORT}...`);
});

// close connection on error or exit.
[
  `exit`,
  `SIGINT`,
  `SIGUSR1`,
  `SIGUSR2`,
  `uncaughtException`,
  `SIGTERM`,
].forEach((eventType) => {
  process.on(eventType, () => {
    if (this.connection) {
      this.connection.close();
    }
  });
});

__handleServiceCall = (id, from, res) => {
  redis.get(`${id}`, async (err, result) => {
    if (result) {
      const resultJSON = JSON.parse(result);
      res.status(200).json(resultJSON);
    } else {
      const userInfo =
        from === 'getUser'
          ? await service.getUser(id)
          : await service.getUsersByGenre(id);
      const result =
        from === 'getUser' ? mapUserInfo(userInfo) : mapUsersInfo(userInfo);
      redis.set(id, JSON.stringify(result));
      res.status(200).json(result);
    }
  });
};
