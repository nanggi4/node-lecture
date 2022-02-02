/*
 * Primary file for the API 
 */

const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const _data = require('./lib/data');

// ! @TODO delete this
// _data.create('test', 'newFile', {'foo': 'bar'}, (err) => {
//   console.log('this war the error', err);
// });

// _data.read('test', 'newFile', (err, data) => {
//   console.log('this war the error', err, 'and this was the data', data);
// });

_data.update('test', 'newFile', {'fizz': 'buzz'}, (err) => {
  console.log('this war the error', err);
});

// HTTP server
const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});

httpServer.listen(config.httpPort, () => {
  console.log(`The server is listening on port ${config.httpPort}`);
});

// HTTPS server
const httpsServerOptions = {
  'key': fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pem')
};
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res);
});

httpsServer.listen(config.httpsPort, () => {
  console.log(`The server is listening on port ${config.httpsPort}`);
});

const unifiedServer = (req, res) => {
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

  req.on('end', () => {
    buffer += decoder.end();

    const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    const data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject' : queryStringObject,
      'method' : method,
      'headers' : headers,
      'payload' : buffer
    };

    chosenHandler(data, (statusCode, payload) => {
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
      payload = typeof(payload) == 'object'? payload : {};

      console.log('payload', payload);

      const payloadString = JSON.stringify(payload);
      res.setHeader('Content-Type','application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      console.log(`* Request received on path ${trimmedPath}.`);
      console.log(`** Request method is ${method}.`);
      console.log(`*** Request query string params is ${JSON.stringify(queryStringObject)}.`);
      console.log(`**** Request headers is ${JSON.stringify(headers)}.`);
      console.log(`***** Request payload is ${buffer}.`);
      console.log(`****** Returning this response is ${statusCode}, ${payloadString}`);      
    });
  });
};

let handlers = {};

handlers.ping = (data, callback) => {
  callback(200);
}

handlers.notFound = (data, callback) => {
  callback(404);
};

let router = {
  'ping': handlers.ping
}