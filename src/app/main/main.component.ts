import {Component, OnInit, Input, SimpleChanges, OnChanges} from '@angular/core';
import * as astar from 'javascript-astar';

const Graph = astar.Graph;
const search = astar.astar.search;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnChanges {

  constructor() {
  }

  @Input() submitted: boolean;

  @Input() map: astar.Graph;

  @Input() file: any;

  @Input() show: boolean = false; //true if processing is complete

  canvas: any;

  ctx: any;

  img: any;

  points: Array<any>;

  path: Array<any>;

  static dist(x, y, a, b): number {
    return (x - a) * (x - a) + (y - b) * (y - b);
  }

  static perpDist(l1, l2, pt) {
    const a = {x: pt.x - l1.x, y: pt.y - l1.y};
    const b = {x: l2.x - l1.x, y: l2.y - l1.y};

    function dot(p1, p2) {
      return p1.x * p2.x + p1.y * p2.y;
    }

    const fac = dot(a, b) / dot(b, b);
    const x = a.x - fac * b.x;
    const y = a.y - fac * b.y;

    return Math.sqrt(x * x + y * y);
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propertyName in changes) {
      if (propertyName === 'submitted' && this.submitted === true) {
        setTimeout(() => {
          this.initCanvas();
        }, 1);
      }
    }
  }

  initCanvas() {
    this.canvas = <HTMLCanvasElement>document.getElementById('mainCanvas');
    this.ctx = this.canvas.getContext('2d');

    this.img = new Image;
    this.img.src = this.file.dataURL;
    this.img.onload = () => {

      this.canvas.width = this.img.width;
      this.canvas.height = this.img.height;

      this.points = [];
      this.draw();

      this.canvas.addEventListener('click', this.click(event), false);
    };
  }

  draw(): void {
    // call astar
    if (this.points.length >= 2) {
      this.ctx.fillStyle = 'while';
      this.ctx.fillRect(0, 0, this.img.width, this.img.height);

      this.astar();
    }

    this.ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height);

    // draw navigation lines
    if (this.points.length >= 2) {
      this.drawPath();
    }

    // draw points
    this.points.forEach(function (item, index) {
      const radius = 5;

      this.ctx.beginPath();
      this.ctx.arc(item.x, item.y, radius, 0, 2 * Math.PI, false);
      this.ctx.fillStyle = 'green';
      this.ctx.fill();
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = '#003300';
      this.ctx.stroke();
    });
  }

  astar(): void {
    const start = this.map.grid[this.points[0].x][this.points[0].y];
    const end = this.map.grid[this.points[1].x][this.points[1].y];
    this.path = this.smoothPath(search(this.map, start, end), 5);
  }

  smoothPath(ptList: Array<any>, epsilon): Array<any> {
    let dmax = 0;
    let index = 0;
    const end = ptList.length;

    let res = [];

    for (let i = 1; i < end; i++) {
      const d = MainComponent.perpDist(ptList[0], ptList[end - 1], ptList[i]);
      if (d > dmax) {
        index = i;
        dmax = d;
      }
    }

    if (dmax > epsilon) {
      res = this.smoothPath(ptList.slice(0, index), epsilon);
      res.push.apply(res, this.smoothPath(ptList.slice(index), epsilon));
    } else {
      res = [ptList[0], ptList[end - 1]];
    }

    return res;
  }

  drawPath(): void {
    if (!this.path || this.path.length === 0) {
      // todo: no path found :(
    } else {
      this.ctx.beginPath();
      this.ctx.moveTo(this.path[1].x, this.path[1].y);
      for (let i = 2; i < this.path.length; i++) {
        this.ctx.lineTo(this.path[1].x, this.path[1].y);
      }
      this.ctx.stroke();
    }
  }

  click(event): void {
    const radius = 5;

    const x = event.offsetX;
    const y = event.offsetY;

    // find all points that are too close and remove them
    if (this.points.length > 0) {
      for (let i = this.points.length - 1; i >= 0; i--) {
        if (MainComponent.dist(x, y, this.points[i].x, this.points[i].y) < radius) {
          this.points.splice(i, 1);
          return;
        }
      }
    }

    // queue can only hold 2 elements
    while (this.points.length > 2) {
      this.points.shift();
    }

    // add point to canvas
    // todo: process better coord for point
    this.points.push({x: x, y: y});
    this.draw();
  }

}
