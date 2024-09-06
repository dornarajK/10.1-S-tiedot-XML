const express = require('express');

const { XMLBuilder, XMLParser, XMLValidator } = require('fast-xml-parser');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const promisePool = require('./mysql');

const app = express();
const port = 5005;
const host = 'localhost';


app.get('/saa/:vko', async (req, res) => {
    const vko = req.params.vko;

    try {
        const [rows] = await promisePool.query('SELECT * FROM saa WHERE vko = ?', [vko]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No data found for the specified week' });
        }

        const rakentaja = new XMLBuilder({ arrayNodeName: 'saa' });
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <saaTila>
            ${rakentaja.build(rows)}
        </saaTila>`;

        res.set('Content-Type', 'text/xml');
        res.send(xml);

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

app.get('/xml', async (req, res) => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM saa');
        const rakentaja = new XMLBuilder({ arrayNodeName: 'saa' });
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <saaTila>
            ${rakentaja.build(rows)}
        </saaTila>`;

        res.set('Content-Type', 'text/xml');
        res.send(xml);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

app.listen(port, host, () => console.log(`${host}:${port} kuuntelee...`));
