const express = require("express");
const app = express();
const fs = require("fs");
const https = require('https');

//////const privateKey = fs.readFileSync('/home/cert/privkey.pem', 'utf8');
////const certificate = fs.readFileSync('/home/cert/cert.pem', 'utf8');
//const ca = fs.readFileSync('/home/cert/chain.pem', 'utf8');

//const credentials = {
  //key: privateKey,
  //cert: certificate,
  //ca: ca
//}; 

app.use(express.static('videos'))

app.get("/bonk", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/video", function (req, res) {
  // Ensure there is a range given for the video
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range header");
  }

  // get video stats (about 61MB)
  const videoPath = "bigbuck.mp4";
  const videoSize = fs.statSync("bigbuck.mp4").size;

  // Parse Range
  // Example: "bytes=32324-"
  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  // Create headers
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  // HTTP Status 206 for Partial Content
  res.writeHead(206, headers);

  // create video read stream for this particular chunk
  const videoStream = fs.createReadStream(videoPath, { start, end });

  // Stream the video chunk to the client
  videoStream.pipe(res);
});
//const httpsServer = https.createServer(credentials, app);
app.listen(8080, function () {
  console.log("Listening on port 8080!");
});
