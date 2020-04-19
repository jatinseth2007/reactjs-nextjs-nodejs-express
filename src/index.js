require('dotenv').config();
const next = require('next');
const express = require('express');
const middlewears = require("./middlewears/middlewears");
const dev = (process.env.NODE_ENV !== 'production');
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;
const cities = require('./factory/city.list.json');

(async () => {
    try {
        await app.prepare();
        const server = express();
        // adding middlewares to the process...
        process.on('uncaughtException', middlewears.unhandledExceptions);
        process.on('unhandledRejection', middlewears.unhandledRejections);

        server.get('/search/cities', async (req, res, next) => {
            try {
                //check if we are getting input or not...
                if (!req.query.q || req.query.q.length <= 0) {
                    res.status(422);
                    throw new Error("Please provide valid input.");
                }
                let output = [];
                // pick 5 top matching cities and the reply back
                for (let city of cities) {
                    if (city.name.toLowerCase().indexOf(req.query.q.toLowerCase()) >= 0) {
                        output.push({
                            id: city.id,
                            name: city.name
                        });
                    }//EOL
                    if (output.length >= 5) {
                        break;
                    }//EOI
                }//EOL
                res.json(output);
            } catch (error) {
                next(error);
            }
        });
        server.get('*', (req, res) => {
            return handle(req, res);
        });

        server.use(middlewears.notFound);
        server.use(middlewears.errorHandler);
        server.listen(port, (err) => {
            if (err) throw err;
            console.log(`Ready on ${port} - env ${process.env.NODE_ENV}`);
        });
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();