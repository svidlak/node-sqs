require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');

const { PORT, TIMEOUT } = process.env;

const routeNotFound = require('./middlewares/routeNotFound');
const requestBodyValidator = require('./middlewares/requestBodyValidator');

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

router.get('/*', (req, res) => {
    const queueName = req.path;
    const { timeout = TIMEOUT } = req.query;
    

    setTimeout(async () => {
        const message = await getFromQueue(queueName);
        console.log(message)
        if(!message) {
            return res.sendStatus(204);
        }
        res.status(200).json({ message });
    }, timeout);
});

app.use('/*/*/*', routeNotFound);
app.use('/api', router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});