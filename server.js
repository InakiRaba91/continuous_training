const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

// Enable All CORS Requests
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the "data" directory
app.use('/files', express.static(path.join(__dirname, 'data/frames')));

app.get('/filelist', (req, res) => {
  const framesDirectoryPath = path.join(__dirname, './data/frames');
  const annotationsDirectoryPath = path.join(__dirname, './data/annotations');

  fs.readdir(framesDirectoryPath, (err, frameFiles) => {
    if (err) {
      console.log('Unable to scan frames directory: ' + err);
      return res.status(500).send('Unable to scan frames directory: ' + err);
    }

    fs.readdir(annotationsDirectoryPath, (err, annotationFiles) => {
      if (err) {
        console.log('Unable to scan annotations directory: ' + err);
        return res.status(500).send('Unable to scan annotations directory: ' + err);
      }

      // Remove the file extension from the annotation files
      const annotationFilesNoExt = annotationFiles.map(file => path.parse(file).name);

      // Filter the frame files to only include those without a corresponding annotation file
      const unannotatedFrames = frameFiles.filter(file => !annotationFilesNoExt.includes(path.parse(file).name));

      res.send(unannotatedFrames);
    });
  });
});

app.post('/label', (req, res) => {
  const { label, filename, score, version } = req.body;
  const filenameNoExt = path.parse(filename).name;

  // if version is null, set a variable named source to 'manual
  const source = version ? 'auto' : 'manual';
  
  // Store the label in a JSON file
  if (label !== 'REJECT') {
    fs.writeFile(`./data/annotations/${filenameNoExt}.json`, JSON.stringify({ label, source, score, version }), (err) => {
      if (err) {
        console.log('Error writing file:', err);
        return res.status(500).send('Error writing file: ' + err);
      }
      res.send({ status: 'success' });
    });
  } else {
    fs.unlink(`./data/frames/${filename}`, (err) => {
      if (err) {
        console.log('Error deleting file:', err);
        return res.status(500).send('Error deleting file: ' + err);
      }
      res.send({ status: 'success' });
    });
  }
});

app.listen(3001, () => {
  console.log('Server is listening on port 3000');
});