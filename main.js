const { program } = require ('commander');
const fs = require ('node:fs');
const http = require ('http');

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

}


const server = http.createServer(requestListener);
server.listen(options.port, options.host, () => {
    console.log(`Server is running on ${options.host}:${options.port}`);
});
