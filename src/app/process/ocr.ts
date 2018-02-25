let himalaya = require('himalaya');
let fs = require("fs");
let tesseract = require('tesseract.js');
let path = require('path');
let canvas = require('canvas');
//import * as path from "path";
//import * as fs from "fs";
//import * as tesseract from 'tesseract.js';
//import * as himalaya from 'himalaya';


let imgDir = "src/assets/first_floor_new.jpg";

let tesseractPromise = tesseract.create({langPath: "eng.traineddata"}).recognize(imgDir, 'eng')
  .progress(message => console.log("current progress: ", message))
  .then(result => {parseTesseractResults(result)
    .then(fulfill => {
      drawRect()
        .then((fulfilled) => {
          console.log("finished covering words: ");
      });
  })});

async function parseTesseractResults(result) {
  //console.log(result);
  //console.log(result.html);

  //himalaya works, cannot access members
  let json = himalaya.parse(result.html);
  let promise = searchJson(json);
  promise.then(result => {
    fs.writeFile('output.txt', JSON.stringify(coordsArr), err => {
      console.log(err);
    });

  });
  let object = himalaya.parse(JSON.stringify(json[0]));
  fs.writeFile('src/app/process/ocr.json', JSON.stringify(json), result => {
    console.log(JSON.stringify(object[0]));
    console.log("successful write");
  });



}
let coordsArr = [];

async function drawRect() {
  //console.log(coordsArr);
  let img = new Image();
  img.dir = imgDir;
  let ctx = canvas.getContext('2d');
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imageData.data;
  for(let val in coordsArr)
  {
    let leftX = val[0];
    let leftY = val[1];
    let rightX = val[2];
    let rightY = val[3];
    console.log(typeof leftX);
  }
}

async function searchJson(json) {
  for (let key in json) {
    let keys = Object.keys(json);
    if (json.hasOwnProperty(key)) {
      if (json[key] == "span") {
        for (let nextKey in json.attributes) {
          if (json.attributes.hasOwnProperty(nextKey)) {
            if (json.attributes[nextKey].value == "ocr_line")
              break;
            if (json.attributes[nextKey].key == 'title') {
              console.log(json.attributes[nextKey].value);
              let arr = json.attributes[nextKey].value.split(" ");
              coordsArr.push({
                "upperLeftX": arr[1],
                "upperLeftY": arr[2],
                "lowerRightX": arr[3],
                "lowerRightY": arr[4]
              })
            }

          }
        }
      }
      else if (typeof json[key] == 'object') {
        searchJson(json[key]);
      }
      //else
      //console.log(json[key]);
    }
  }
}
