const { program } = require ('commander');
const fs = require ('fs');
const http = require ('http');
const path = require ('path');
const superagent = require ('superagent');

program
    .option('-h, --host <address>')
    .option('-p, --port <number>')
    .option('-с, --cache <path>')

program.parse();
const options = program.opts();

if (!options.cache) {
    console.log('Please, specify a cache directory');
    return;
}

if (!options.port) {
    console.log('Please, specify port');
    return;
}

if (!options.host) {
    console.log('Please, specify host');
    return;
}

const requestListener = async function (req, res) {
    const url = req.url;
    const filePath = path.join(options.cache, `${url}.jpg`);

    switch (req.method) {
        case 'GET':
            let image;
            if(fs.existsSync(filePath))
            {
                image = await fs.promises.readFile(filePath);
                res.setHeader('Content-Type', 'image/jpeg');
                res.statusCode = 200;
                res.end(image);
            }
            else
            {
                await superagent.get(`https://http.cat/${url}`)
                    .then(response => {
                        image = response.body;
                        fs.promises.writeFile(filePath, image);
                        res.setHeader('Content-Type', 'image/jpeg');
                        res.statusCode = 200;
                        res.end(image);
                    })
                    .catch(err => {
                        res.statusCode = 404;
                        res.end();
                    });
            }
            break;

        case 'PUT':
            const chunks = [];
            req.on('data', chunk => chunks.push(chunk));
            req.on('end', async () => {
                const image = Buffer.concat(chunks);
                await fs.promises.writeFile(filePath, image);
                res.statusCode = 201;
                res.end();
            });
            break;

        case 'DELETE':
            fs.promises.unlink(filePath);
            res.statusCode = 200;
            res.end();
            break;

        default:
            res.statusCode = 405;
            res.end();
            break;
    }
}

const server = http.createServer(requestListener);
server.listen(options.port, options.host, () => {
    console.log(`Server is running on ${options.host}:${options.port}`);
});


