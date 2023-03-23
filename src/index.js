import express from 'express';
import bodyParser from 'body-parser';

/* Main block. */ {
    const app = express();

    app.use(express.static('public'));
    app.get('/', (_, res) => {
        res.sendFile('index.html');
    });

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.get('/ping', (_, res) => {
        res.send('pong');
    });

    app.listen(process.env.PORT, () => console.log('started'));
}
