const express = require('express'),
	  mongoose = require('mongoose'),
	  authRouter = require('./authRouter'),
      bodyParser = require('body-parser'),
      morgan = require('morgan'),
	  fs = require('file-system'),
	  shortId = require('shortid'),
	  dbFilePath = 'tasks.json',
      app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('common'));
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

app.get('/api/tasks', (req, res) => res.send(getTasksFromDB()));

app.post('/api/task', (req, res) => {
	const tasksData = getTasksFromDB(),
		task = req.body;

	task.id = shortId.generate();
	task.description = task.description || 'No Description';

    tasksData.push(task);
    setTasksToDB(tasksData);

	res.send(task);
});

app.get('/api/task/:id', (req, res) => {
	const tasksData = getTasksFromDB(),
		task = tasksData.find(task => task.id === req.params.id);

    task ? res.send(task) : res.status(404).send({error: 'Task with given ID was not found'});
});

app.put('/api/task/:id', (req, res) => {
	const tasksData = getTasksFromDB(),
		task = tasksData.find(task => task.id === req.params.id),
		updatedTask = req.body;

	task.title = updatedTask.title;
	task.description = updatedTask.description || 'No Description';

    setTasksToDB(tasksData);

	res.sendStatus(204);
});

app.put('/api/tasks', (req, res) => {
	const tasksData = getTasksFromDB(),
		task = tasksData.find(task => task.id === req.body.id),
		updatedTask = req.body;

	task.status = updatedTask.status;

	setTasksToDB(tasksData);

	res.sendStatus(204);
});

app.delete('/api/task/:id', (req, res) => {
	const tasksData = getTasksFromDB(),
		deletedTask = tasksData.find(task => task.id === req.params.id),
		updatedTaskList = tasksData.filter(task => task.id !== deletedTask.id);

	setTasksToDB(updatedTaskList);

	res.sendStatus(204);
});

app.delete('/api/task', (req, res) => {
	const clearTaskData = [];

	setTasksToDB(clearTaskData);

	res.sendStatus(204);
});

function getTasksFromDB() {
    return JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
}

function setTasksToDB(tasksData) {
    fs.writeFileSync(dbFilePath, JSON.stringify(tasksData));
}

app.use(express.json());
app.use('/auth', authRouter);

const start = async () => {
	await mongoose.connect('mongodb+srv://qwerty:12345@cluster0.rtfngxu.mongodb.net/?retryWrites=true&w=majority');

	app.listen(3000, () => console.log('Server has been started...'));
}

start();

