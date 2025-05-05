const { program } = require ('commander');
const fs = require ('fs');
const http = require ('http');
const path = require ('path');
const {image} = require("superagent/lib/node/parsers");

program
    .option('-h, --host <address>')
    .option('-p, --port <number>')
    .option('-с, --cache <path>')

program.parse();
const options = program.opts();

console.log(options.cache)

if (!options.cache) {
    console.log('Please specify a cache directory');
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
            let image
            try{
                image = await fs.promises.readFile(filePath);
                res.setHeader('Content-Type', 'image/jpeg');
                res.statusCode = 200;
                res.end(image);
            }catch(err){
                if (err.code === 'ENOENT') {
                    if (!image) {
                        res.statusCode = 404;
                        res.end();
                    }
                }
            }


            break;
        case 'PUT':
            const chunks = [];
            req.on('data', chunk => chunks.push(chunk));
            req.on('end', async () => {
                const imageData = Buffer.concat(chunks);
                await fs.promises.writeFile(filePath, imageData);
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
    }

}


const server = http.createServer(requestListener);
server.listen(options.port, options.host, () => {
    console.log(`Server is running on ${options.host}:${options.port}`);
});


