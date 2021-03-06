///<reference path="../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  AfterContentInit,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import {NgClass} from '@angular/common';
import * as astar from 'javascript-astar';
import {trigger, state, style, animate, keyframes, transition} from '@angular/animations';
import * as tesseract from 'tesseract.js';
import * as himalaya from 'himalaya';

const options = {
  langPath: 'tessdata' // Or wherever your downloaded langs are stored
};

const Graph = astar.Graph;

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.css'],
  animations: [
    trigger('bounceInDown', [
      transition('inactive => active', animate(750, keyframes([
        style({opacity: 0, transform: 'translate3d(0, -3000px, 0)', offset: 0}),
        style({opacity: 1, transform: 'translate3d(0, 25px, 0)', offset: 0.6}),
        style({transform: 'translate3d(0, -10px, 0)', offset: 0.75}),
        style({transform: 'translate3d(0, 5px, 0)', offset: 0.9}),
        style({transform: 'translate3d(0, 0, 0)', offset: 1}),
      ]))),
    ]),
    trigger('fadeIn', [
      transition('inactive => active', animate(500, keyframes([
        style({opacity: 0, transform: 'translate3d(-100%, 0, 0)'}),
        style({opacity: 1, transform: 'translate3d(0, 0, 0)'}),
      ]))),
    ]),
    trigger('pulse', [
      transition('inactive => active', animate(1000, keyframes([
        style({transform: 'scale3d(1, 1, 1)', offset: 0}),
        style({transform: 'scale3d(1.05, 1.05, 1.05)', offset: 0.5}),
        style({transform: 'scale3d(1, 1, 1)', offset: 1}),
      ]))),
    ])
  ]
})
export class ProcessComponent implements OnInit, OnChanges {
  @Input() file: any;

  @Input() submitted: boolean;

  canvas: any;

  ctx: any;

  img: any;

  map: astar.Graph;

  coordsArr: Array<any> = [];

  fadeState = 'inactive';

  bounceState = 'inactive';

  pulseState: string = 'inactive';

  // 1 for sharp, 2 for blurry, 3 for dirty
  processingType: number;

  processSelected = false;

  processComplete = false;

  unOpaque = true;

  static outOfRange(a: number, min: number, max: number): boolean {
    return a < min || a >= max;
  }

  static sharpen(pixels, opaque) {
    const weights =
      [0, -1, 0,
        -1, 5, -1,
        0, -1, 0];
    let side = Math.round(Math.sqrt(weights.length));
    let halfSide = Math.floor(side / 2);
    let src = pixels.data;
    let sw = pixels.width;
    let sh = pixels.height;
    // pad output by the convolution matrix
    let w = sw;
    let h = sh;

    let dst = [];

    // go through the destination image pixels
    let alphaFac = opaque ? 1 : 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let sy = y;
        let sx = x;
        let dstOff = (y * w + x) * 4;
        // calculate the weighed sum of the source image pixels that
        // fall under the convolution matrix
        let r = 0, g = 0, b = 0, a = 0;
        for (let cy = 0; cy < side; cy++) {
          for (let cx = 0; cx < side; cx++) {
            let scy = sy + cy - halfSide;
            let scx = sx + cx - halfSide;
            if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
              let srcOff = (scy * sw + scx) * 4;
              let wt = weights[cy * side + cx];
              r += src[srcOff] * wt;
              g += src[srcOff + 1] * wt;
              b += src[srcOff + 2] * wt;
              a += src[srcOff + 3] * wt;
            }
          }
        }
        dst[dstOff] = r;
        dst[dstOff + 1] = g;
        dst[dstOff + 2] = b;
        dst[dstOff + 3] = a + alphaFac * (255 - a);
      }
    }

    for (let i = 0; i < src.length; i++) {
      src[i] = dst[i];
    }
  }

  static pixAvr(imageData: any, x: number, y: number, w: number, h: number, thres: number) {
    let c = 0, sum = 0;
    for (let dx = 0; dx < w; dx++) {
      for (let dy = 0; dy < w; dy++) {
        sum += ProcessComponent.grayPix(imageData, x + dx, y + dy);
        c++;
      }
    }
    return (sum / c > thres) ? 0xff : 0;
  }

  static grayPix(imageData: any, x: number, y: number): number {
    const width = imageData.width;
    const pix = y * (width * 4) + x * 4;
    const data = imageData.data;

    return (data[pix] + data[pix + 1] + data[pix + 2]) / 3;
  }

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propertyName in changes) {
      if (propertyName == 'submitted' && this.submitted == true) {
        setTimeout(() => {
          this.fadeOnce();
          this.bounceOnce();
          this.RUNMMM();
        }, 1);
      }
    }
  }

  startPulse(): void {
    this.pulseState = 'active';
  }

  endPulse(): void {
    this.pulseState = 'inactive';
    setTimeout(() => {
      this.startPulse();
    }, 1500);
  }

  fadeOnce(): void {
    this.fadeState = 'active';
  }

  endFade(): void {
    this.fadeState = 'inactive';
    this.unOpaque = false;
  }

  bounceOnce(): void {
    this.bounceState = 'active';
  }

  endBounce(): void {
    this.bounceState = 'inactive';
    this.unOpaque = false;
  }
  //
  // process(): any {
  //   // todo: call genGraph after processing image.
  // }

  prepare1(): void {
    this.processingType = 1;
    this.prepare();
  }

  prepare2(): void {
    this.processingType = 2;
    this.prepare();
  }

  prepare3(): void {
    this.processingType = 3;
    this.prepare();
  }

  posterize(pixels, thres): ImageData {
    const factor = Math.min(Math.min(pixels.width, pixels.height) / 250, 1);
    const res = this.ctx.createImageData(Math.floor(pixels.width / factor), Math.floor(pixels.height / factor));

    for (let x = 0; x < res.width; x++) {
      for (let y = 0; y < res.height; y++) {
        const num = ProcessComponent.pixAvr(pixels, Math.floor(x * factor), Math.floor(y * factor),
          Math.min(factor, res.width - x), Math.min(factor, res.height - y), thres);
        const pos = y * res.width * 4 + x * 4;
        res.data[pos] = num;
        res.data[pos + 1] = num;
        res.data[pos + 2] = num;
        res.data[pos + 3] = 0xff;
      }
    }

    return res;
  }

  prepare(): void {
    this.processSelected = true;

    // Get Image data
    let pixels = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

    ProcessComponent.sharpen(pixels, true);
    pixels = this.posterize(pixels, 100);

    const small = <HTMLCanvasElement>document.createElement('canvas');
    const ctx = small.getContext('2d');
    small.width = pixels.width;
    small.height = pixels.height;
    ctx.putImageData(pixels, 0, 0);
    this.ocr(small);

    pixels = ctx.getImageData(0, 0, pixels.width, pixels.height);
    this.genGraph(this.imageToBool(pixels));

    console.log(this.processSelected);
    this.endPulse();
  }

  removeColor(): void {

  }

  permitShow(): boolean {
    return this.submitted && !this.processSelected;
  }

  processLoading(): boolean {
    return this.processSelected && !this.processComplete;
  }

  RUNMMM() {
    console.log('RUN MMMM');
    this.canvas = <HTMLCanvasElement>document.getElementById('GRORORO');
    this.ctx = this.canvas.getContext('2d');

    this.img = new Image;
    this.img.src = this.file.dataURL;
    this.img.onload = () => {

      this.canvas.width = this.img.width >> 1;
      this.canvas.height = this.img.height >> 1;

      this.draw();

      this.canvas.addEventListener('mouseout', this.draw.bind(this), false);
      this.canvas.addEventListener('mousemove', this.move.bind(this), false);
    };
  }

  draw(): void {
    this.ctx.drawImage(this.img, 0, 0, this.img.width >> 1, this.img.height >> 1);
  }

  /* this can be optimized more; use proportions and shit */
  move(e: any) {
    this.ctx.drawImage(this.img, -e.clientX, -e.clientY, this.img.width + 800, this.img.height + 300);
  }

  imageToBool(pixels): Array<Array<boolean>> {
    let data = pixels;
    let map = [];
    for (let r = 0; r < pixels.height; r++) {
      map[r] = [];
      for (let c = 0; c < pixels.width; c++) {
        map[r][c] = data.data[r * pixels.width * 4 + c * 4] > 240;
      }
    }

    return map;
  }

  genGraph(map: Array<Array<boolean>>): void {

    const adj = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const visited = [];
    const dist = [];

    for (let r = 0; r < map.length; r++) {
      visited[r] = [];
      dist[r] = [];
    }

    let level = [];
    for (let r = 0; r < map.length; r++) {
      for (let c = 0; c < map[r].length; c++) {
        if (!map[r][c]) {
          level.push({r: r, c: c});
        }
        dist[r][c] = map[r][c] ? -1 : 0;
      }
    }

    // Determine distances.
    for (let i = 0; level.length !== 0; i++) {
      const nextLevel = [];
      for (const loc of level) {
        for (const pair of adj) {
          if (ProcessComponent.outOfRange(loc.r + pair[0], 0, map.length) ||
            ProcessComponent.outOfRange(loc.c + pair[1], 0, map[0].length)) {
            continue;
          }
          if (dist[loc.r + pair[0]][loc.c + pair[1]] === -1) {
            dist[loc.r + pair[0]][loc.c + pair[1]] = i + 1;
            nextLevel.push({r: loc.r + pair[0], c: loc.c + pair[1]});
          }
        }
      }
      level = nextLevel;
    }

    this.map = new Graph(dist);
  }

  ocr(canvas) {
    let ctx = canvas.getContext('2d');
    let tesseractPromise: any;
    tesseractPromise = tesseract.recognize(canvas, {lang: 'eng'})
      .progress(message => console.log('current progress: ', message))
    tesseractPromise = tesseract.recognize(canvas, {lang: 'eng'})
      .progress(message => console.log("current progress: ", message))
      .then(result => {
        this.parseTesseractResults(result);
        this.drawRect(ctx);
      })
      .catch(rejected => {
        console.log('err with tesseractJob');
      })
      .finally(failure => {
        console.log('completed');
        this.processComplete = true;
      });
  }

  parseTesseractResults(result) {
    // console.log(result);
    // console.log(result.html);

    // himalaya works, cannot access members
    let json = himalaya.parse(result.html);
    this.searchJson(json);
  }

  drawRect(ctx) {
    //console.log(coordsArr);
    // console.log(this.ctx.ImageData);
    let imgData = ctx.getImageData(0, 0, this.img.width, this.img.height);

    // y * width + x
    console.log(this.coordsArr);
    for (let val in this.coordsArr) {
      let obj = this.coordsArr[val];
      let leftX = obj.upperLeftX;
      let leftY = obj.upperLeftY;
      let rightX = obj.lowerRightX;
      let rightY = obj.lowerRightY;
      ctx.fillStyle = '#ffffffff';
      ctx.fillRect(leftX, leftY, rightX - leftX, rightY - rightY);
      ctx.putImageData(imgData, 0, 0);
    }
  }

  searchJson(json) {
    for (let key in json) {
      if (json.hasOwnProperty(key)) {
        if (json[key] == 'span') {
          for (let nextKey in json.attributes) {
            if (json.attributes.hasOwnProperty(nextKey)) {
              if (json.attributes[nextKey].value == 'ocr_line')
                break;
              if (json.attributes[nextKey].key == 'title') {
                //console.log(json.attributes[nextKey].value);
                let arr = json.attributes[nextKey].value.split(' ');
                this.coordsArr.push({
                  'upperLeftX': arr[1],
                  'upperLeftY': arr[2],
                  'lowerRightX': arr[3],
                  'lowerRightY': arr[4]
                });
              }
            }
          }
        }
        else if (typeof json[key] == 'object') {
          this.searchJson(json[key]);
        }
        //else
        //console.log(json[key]);
      }
    }
  }
}
