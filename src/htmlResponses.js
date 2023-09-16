const fs = require('fs');

const directory = {
  index: fs.readFileSync(`${__dirname}/../client/client.html`),
  page2: fs.readFileSync(`${__dirname}/../client/client2.html`),
  page3: fs.readFileSync(`${__dirname}/../client/client3.html`),
};

const getPage = (request, response, page) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(directory[page]);
  response.end();
};

module.exports = { getPage };
