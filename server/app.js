import express from 'express';
import https from 'https';

import { apiKey } from './secrets.js'

const GoodReadsHostname = 'www.goodreads.com'
const basePath = '/'

const app = express();
const port = 3001;


function filterObject(keys, source) {
  return keys.reduce(
    (result, key) =>
      key in source ?
        { ...result, [key]: source[key] }
        : result,
    {});
}


function proxyRequest(req) {
  return new Promise((resolve, reject) => {
    const { method, params: { path } } = req
    let reqPath = basePath + path + '?';
    for (let queryParam in req.query) {
      reqPath += `&${encodeURIComponent(queryParam)}=${encodeURIComponent(req.query[queryParam])}`;
    }
    reqPath += '&key=' + apiKey + '&v=2';

    const options = {
      'hostname': GoodReadsHostname,
      'path': reqPath,
      'method': method,
    }

    const proxyReq = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: filterObject(['content-type'], res.headers),
          body: body
        });
      });
    });

    proxyReq.on('error', reject);
    proxyReq.end();

  })
}

app.all('/goodreads/:path(*)', async (req, res) => {
  try {
    const { status, headers, body } = await proxyRequest(req)
    res.status(status)
    res.set(headers)
    res.set('Access-Control-Allow-Origin', '*');
    res.send(body)
  } catch (err) {
    console.warn("Caught", err)
  }
});

app.listen(port, () => console.log(`Goodstats server listening on port ${port}!`))