import express from 'express';
import https from 'https';

import { apiKey } from './secrets.js'

const GoodReadsHostname = 'www.goodreads.com'
const basePath = '/'

const app = express();
const port = 3001;


function proxyRequest(req) {
  return new Promise((resolve, reject) => {
    const { method, params: { path } } = req
    let reqPath = basePath + path + '?';
    for (let queryParam in req.query) {
      // TODO sanitize
      reqPath += `&${queryParam}=${req.query[queryParam]}`;
    }
    reqPath += '&key=' + apiKey+ '&v=2';
    
    console.log("path: ", reqPath);
    const options = {
      'hostname': GoodReadsHostname,
      'path': reqPath,
      'method': method,
    }

    const proxyReq = https.request(options, (res) => {
      // console.log("res: ", res.url);
      console.log('statusCode:', res.statusCode);
      console.log('headers:', res.headers);

      let body = '';

      res.on('data', (d) => {
        body += d;
      });
      res.on('end', () => {
        resolve(body);
      });
    });

    proxyReq.on('error', reject);
    proxyReq.end();

  })
}

app.all('/goodreads/:path(*)', async (req, res) => {
  const result = await proxyRequest(req)
  // console.log('result', result);
  res.send(result)
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))