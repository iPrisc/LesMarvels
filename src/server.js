import {getData} from "./api.js";

import fastify from 'fastify';
import handlebars from 'handlebars';

console.log("Je suis Marvel")
getData("http://gateway.marvel.com")

const app = fastify();

app.register(import('@fastify/view'), {
    engine: {
        handlebars
    },
    templates: './templates',
    options: {
        partials: {
            header: './header.hbs',
            footer: './footer.hbs'
        }
    }
});

app.get('/', async (request, reply) => {
    const characters = await getData("http://gateway.marvel.com");
    return reply.view('index', { characters: characters });
});

app.listen(3000, (err, address) => {
    if (err) { console.error(err); }
    console.log(`port 3000, adresse: ${address}`);
});