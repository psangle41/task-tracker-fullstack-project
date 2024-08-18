const express = require('express');
const bodyParser = require('body-parser');

const { createUserTable } = require('./models/users.model');
const { createTaskTable } = require('./models/tasks.model');

const userRoutes = require('./routes/users.route');
const taskRoutes = require('./routes/tasks.route');

const PORT = 3000;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(userRoutes);
app.use(taskRoutes);

createUserTable();
createTaskTable();

app.listen(PORT, () => {
  console.log('Server running on port ', PORT);
});
