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
      if (propertyName === 'show' && this.show === true) {
        setTimeout(this.initCanvas.bind(this), 1);
      }
    }
  }

  initCanvas() {
    this.canvas = <HTMLCanvasElement>document.getElementById('mainCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.points = [];

    this.img = new Image;
    this.img.src = this.file.dataURL;
    this.img.onload = () => {

      this.canvas.width = this.img.width;
      this.canvas.height = this.img.height;

      this.draw();

      this.canvas.addEventListener('click', this.click.bind(this), false);
    };
  }

  smoothPath(ptList: Array<any>, epsilon): Array<any> {
    if (ptList.length === 0)
      return [];

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

  draw(): void {
    this.ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height);

    // call astar
    if (this.points.length >= 2) {
      this.astar();
      this.drawPath();
    }

    // draw points
    this.points.forEach(function (item, index) {
      const radius = 5;
      const scaleX = this.canvas.width / this.map.grid[0].length;
      const scaleY = this.canvas.height / this.map.grid.length;


      this.ctx.beginPath();
      this.ctx.arc(item.x * scaleX, item.y * scaleY, radius, 0, 2 * Math.PI, false);
      this.ctx.fillStyle = 'green';
      this.ctx.fill();
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = '#003300';
      this.ctx.stroke();
    }.bind(this));
  }

  astar(): void {
    const start = this.map.grid[this.points[0].x][this.points[0].y];
    const end = this.map.grid[this.points[1].x][this.points[1].y];
    this.path = this.smoothPath(search(this.map, start, end), 5);
  }

  drawPath(): void {
    const scaleX = this.canvas.width / this.map.grid[0].length;
    const scaleY = this.canvas.height / this.map.grid.length;
    if (!this.path || this.path.length < 2) {
      // todo: no path found :(
    } else {
      this.ctx.beginPath();
      this.ctx.moveTo(this.path[0].x * scaleX, this.path[0].y * scaleY);
      for (let i = 1; i < this.path.length; i++) {
        this.ctx.lineTo(this.path[i].x * scaleX, this.path[i].y * scaleY);
      }
      this.ctx.strokeStyle = "#ff0000";
      this.ctx.stroke();
    }
  }

  click(event): void {
    const radius = 5;

    const scaleX = this.canvas.width / this.map.grid[0].length;
    const scaleY = this.canvas.height / this.map.grid.length;

    const x = Math.floor(event.offsetX / scaleX);
    const y = Math.floor(event.offsetY / scaleY);

    // find all points that are too close and remove them
    if (this.points.length > 0) {
      for (let i = this.points.length - 1; i >= 0; i--) {
        if (MainComponent.dist(x, y, this.points[i].x, this.points[i].y) < radius * radius * 2) {
          this.points.splice(i, 1);
          return;
        }
      }
    }

    // queue can only hold 2 elements
    while (this.points.length >= 2) {
      this.points.shift();
    }

    // add point to canvas
    // todo: process better coord for point
    this.points.push({x: x, y: y});
    this.draw();
  }

}
