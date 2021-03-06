import express from 'express';
import https from 'https';

import { apiKey } from './secrets.js'

const GoodReadsHostname = 'www.goodreads.com'

const app = express();
const port = process.env.PORT || 80;


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
    console.debug("Processing request with query params", req.query);
    let reqPath = "/" + path + '?v=2&key=' + apiKey;
    for (let queryParam in req.query) {
      reqPath += `&${encodeURIComponent(queryParam)}=${encodeURIComponent(req.query[queryParam])}`;
    }
    console.debug("Full request path:", reqPath);
    const options = {
      'hostname': GoodReadsHostname,
      'path': reqPath,
      'method': method,
    }

    const proxyReq = https.request(options, (res) => {
      console.log(`Goodrads response: ${res.statusCode} ${res.statusMessage}`)
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