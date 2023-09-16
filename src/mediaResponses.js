const fs = require('fs');
const path = require('path');

const getMedia = (request, response, pathname, mediaType) => {
  const file = path.resolve(__dirname, pathname);

  // Get info about file
  fs.stat(file, (err, stats) => {
    // Handle potential errors
    if (err) {
      if (err.code === 'ENOENT') {
        response.writeHead(404);
      }
      return response.end(err);
    }

    // "What range did the client ask me for?"
    let { range } = request.headers;

    if (!range) {
      range = 'bytes=0-';
    }

    // ===== Creating Headers =====
    const positions = range.substring(6).split('-');

    let start = parseInt(positions[0], 10);

    const total = stats.size;
    const end = positions[1] ? parseInt(positions[1], 10) : total - 1;

    if (start > end) {
      start = end - 1;
    }

    const rangeSize = (end - start) + 1;

    // "Dear client, here is the range and type of media to expect"
    response.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': rangeSize,
      'Content-Type': mediaType,
    });

    // ===== Creating Stream =====
    const stream = fs.createReadStream(file, { start, end });

    stream.on('open', () => { // What to do when file is opened
      stream.pipe(response); // connect server video stream to client
    });

    stream.on('error', (streamErr) => { // What to do if file throws an error
      response.end(streamErr);
    });

    return stream;
  });
};

module.exports = { getMedia };
