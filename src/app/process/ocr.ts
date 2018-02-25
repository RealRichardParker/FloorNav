let ts = require('tesseract.js');
let path = require('path');
const options = {
  langPath: path.join(__dirname, "src/assets/tessdata")
};

let imgDir = "src/assets/first_floor_new.jpg";
let tesseractPromise = ts.create({ langPath: "eng.traineddata" }).recognize(imgDir, 'eng')
  .then(result => console.log(result));
