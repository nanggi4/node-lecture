/**
 * Primary file for the API 
 */

// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/\/+|\/+$/g, '');
  const method = req.method.toLowerCase();
  const queryStringObject = parsedUrl.query;
  const headers = req.headers;

  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });

  res.end(' *** Hello World\n');

  console.log(`* Request received on path ${trimmedPath}.`);
  console.log(`** Request method is ${method}.`);
  console.log(`*** Request query string params is ${JSON.stringify(queryStringObject)}.`);
  console.log(`**** Request headers is ${headers}.`);
  console.log(`***** Request payload is ${buffer}.`);
});

server.listen(3000, () => {
  console.log(`The server is listening on port 3000 now`);
})