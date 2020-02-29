import express from 'express';

const app = express();
const port = 3001;

app.all('/goodreads/:path(*)', (req, res) => {
  res.send(`Hello ${req.method} at '${req.params.path}'!`)
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))