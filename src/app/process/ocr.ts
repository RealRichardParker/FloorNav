/*
let himalaya = require('himalaya');
let fs = require("fs");
let tesseract = require('tesseract.js');
let path = require('path');
let {createCanvas, loadImage} = require('canvas');
// const Image = createCanvas.Image;
import {ProcessComponent} from "./process.component";



//import * as path from "path";
//import * as fs from "fs";
//import * as tesseract from 'tesseract.js';
//import * as himalaya from 'himalaya';


let imgDir = "src/assets/first_floor_new.jpg";
let file = img;
let tesseractPromise = tesseract.create({langPath: "eng.traineddata"}).recognize(process., 'eng')
  .progress(message => console.log("current progress: ", message))
  .then(result => {parseTesseractResults(result)
    .then(fulfill => {
      drawRect()
        .then((fulfilled) => {
          console.log("finished covering words: ");
      });
  })})
  .catch(rejected => {console.log("err with tesseractJob")})
  .finally(failure => {console.log("completed")});

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
  /!*let object = himalaya.parse(JSON.stringify(json[0]));
  fs.writeFile('src/app/process/ocr.json', JSON.stringify(json), result => {
    console.log(JSON.stringify(object));
    console.log("successful write");
  });*!/



}
let coordsArr = [];

async function drawRect() {
  //console.log(coordsArr);

  let canvas = createCanvas();
  let ctx = canvas.getContext('2d');
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imageData.data;
  console.log(coordsArr);
  for(let val in coordsArr)
  {
    let obj = coordsArr[val];
    let leftX = obj.upperLeftX;
    let leftY = obj.upperLeftY;
    let rightX = obj.lowerRightX;
    let rightY = obj.lowerRightY;
    console.log(leftX);
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
*/
