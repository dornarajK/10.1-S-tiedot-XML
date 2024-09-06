const express = require('express');
const { XMLBuilder, XMLParser, XMLValidator } = require('fast-xml-parser');

const { Client } = require('pg');

const app = express();

const port = 3000;
const host = 'localhost';

app.get('/', async (req, res) => {
    const url = 'http://localhost:3000/xml';
    const asetukset = {
        method: 'GET'
    };

    try {
        const haettuSivu = await fetch(url, asetukset);
        const xml = await haettuSivu.text();

        const validia = XMLValidator.validate(xml);

        if (validia) {
            const parseri = new XMLParser();
            const ruokalista = parseri.parse(xml).ruokalista;
            let teksti = '';
            for (let ateria of ruokalista.ateria) {
                teksti += `${ateria.paiva}: ${ateria.paaruoka} - ${ateria.salaatti} - ${ateria.jalkiruoka}<br>`;
            }
            res.send(teksti)
        }
        else {
            res.send("Virheellinen XML-syöte.")
        }

    } catch (err) {
        console.log(err);
    }
});



app.get('/xml', (req, res) => {
    const ruokalista = [
        {
            id: saa.id,
            vko: saa.vko,
            pvm: saa.pvm,
            saatila: saa.saatila,
            lampotila: saa.lampotila,
            tuulennopeus: saa.tuulennopeus,
        },
    ];

    const rakentaja = new XMLBuilder({
        arrayNodeName: 'ateria'
    });

    // ei rivinvaihtoja tai välilyöntejä tämän merkkijonon alkuun! XML on tarkka tästä.
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ruokalista>
    ${rakentaja.build(ruokalista)}
</ruokalista>`;

    res.set('Content-Type', 'text/xml');
    res.send(xml);
});





app.listen(port, host, () => console.log(`${host}:${port} kuuntelee...`));