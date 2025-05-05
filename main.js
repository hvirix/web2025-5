const { program } = require ('commander');
const fs = require ('fs');
const http = require ('http');
const path = require ('path');

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

const requestListener = function (req, res) {
    const url = req.url;
    const filePath = path.join(options.cache, `${url}.jpg`);

    switch(req.method) {
        case 'GET':
            fs.promises.readFile(filePath)
                .then(image => {
                    res.end(image);
                })
                .catch(err => {});

    }

}


const server = http.createServer(requestListener);
server.listen(options.port, options.host, () => {
    console.log(`Server is running on ${options.host}:${options.port}`);
});


