This project is a small prototype of a service with Redis as a cash system.

HOW TO RUN IT:

- If you have docker installed in your locale machine, just run "npm install" and "docker-compose up"
- if not:
  1. You need to install redis in your local machine (https://redis.io/download)
  2. Change app.js line 12 by your locale redis url
  3. change mongo.js line 13 by your locale mongo url
  4. run "npm install" and "npm run start"
