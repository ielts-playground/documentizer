import express from 'express';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import { v4 as uuid } from 'uuid';

import fs from 'fs';

import { convert } from './converter.js';
import { extract } from './extractor.js';

/* Main block. */ {
    const app = express();
    const dir = `${process.cwd()}/data`;
    const pool = Number(process.env.UPLOAD_POOL_SIZE) || 10;

    app.use(express.static('public'));
    app.get('/', (_, res) => {
        res.sendFile('index.html');
    });

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(
        fileUpload({
            debug: true,
            limits: {
                fileSize: 10 * 1024 * 1024, // 10MB
            },
        })
    );

    app.get('/ping', (_, res) => {
        res.send('pong');
    });

    app.post('/upload', async (req, res) => {
        const processes = [];

        /* Prepares for the uploading processes. */ {
            if (req.files?.docx) {
                const files = [req.files.docx || {}].flat();
                for (const file of files) {
                    const process = async () => {
                        if (!file.name?.toLowerCase()?.endsWith('docx')) {
                            return {
                                name: file.name,
                                error: 'file must be docx',
                            };
                        }
                        const created = new Date();
                        const id = `${created.getTime()}-${uuid()}`;
                        const path = `${dir}/${id}.docx`;
                        fs.writeFileSync(path, file.data);
                        const markdown = await convert(path);
                        if (markdown) {
                            return {
                                id,
                                path,
                                name: file.name,
                                content: await extract(markdown),
                                created,
                            };
                        }
                    };
                    processes.push(process());
                }
            }
        }

        const uploaded = [];

        /* Starts the uploading processes. */ {
            const queue = [];
            const execute = async () => {
                uploaded.push(...(await Promise.all(queue)));
                queue.splice(0, queue.length);
            };
            for (const process of processes) {
                queue.push(process);
                if (queue > pool) {
                    await execute();
                }
            }
            if (queue.length) await execute();
        }

        res.json(uploaded);
    });

    app.listen(process.env.PORT);
}
