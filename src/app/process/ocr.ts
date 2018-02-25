let himalaya = require('himalaya');
//let htmlToJson = require('html-to-json');
let util = require('util');
let fs = require("fs");
let tesseract = require('tesseract.js');
let path = require('path');
let stackBlur = require('stackblur-canvas');
//import * as path from "path";
//import * as fs from "fs";
//import * as tesseract from 'tesseract.js';
//import * as util from "util";

const options = {
  langPath: path.join(__dirname, "src/assets/tessdata")
};

let imgDir = "src/assets/first_floor_new.jpg";


let tesseractPromise = tesseract.create({ langPath: "eng.traineddata" }).recognize(imgDir, 'eng')
  .progress(message => console.log("current progress: ", message))
  .then(result => parseTesseractResults(result));

function parseTesseractResults(result) {
  //console.log(result);
  //let out = util.inspect(result, {showHidden: false, depth: null});
  //fs.writeFile('src/app/process/ocr.json', result.text + result.html);
  //let parser = new DOMParser();
  //let doc = parser.parseFromString(result.html, "text/html");
  console.log(result.html);

  //himalaya works, cannot access members
  let json = himalaya.parse(result.html);
  fs.writeFile('src/app/process/ocr.json', JSON.stringify(json), result =>
  {
    console.log(json.attributes);
    console.log("successful write");
  });

  //this is htmlToJson solution
  /*let promies = htmlToJson.parse(result.html,{
    'page_1': {
      'block_1_1': function($doc) {
        return $doc.find('bbox#').text();
      }
    }
  });
  promies.done(result => {console.log(result)})*/
}
