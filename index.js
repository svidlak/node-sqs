require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');

const { PORT } = process.env;

const routeNotFound = require('./middlewares/routeNotFound');
const timeoutMiddleware = require('./middlewares/requestTimeout');
const requestBodyValidator = require('./middlewares/requestBodyValidator');
const gracefulShutdown = require('./utils/gracefulShutdown');

const { getFromQueue, postToQueue } = require('./services/queueService');

const app = express();
app.use(bodyParser.json());

const router = express.Router();

router.post('/*', requestBodyValidator, async (req, res) => {
    const queueName = req.path;
    const { body } = req;

    await postToQueue({ queueName, message: body.message });
    res.sendStatus(201);
});

router.get('/*', timeoutMiddleware, async (req, res) => {
    const queueName = req.path;
    const message = await getFromQueue(queueName);

    if(res.headersSent) return;

    if(!message) {
        return res.sendStatus(204);
    }
    res.status(200).json({ message });
});

app.use('/*/*/*', routeNotFound);
app.use('/api', router);

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

gracefulShutdown(server);