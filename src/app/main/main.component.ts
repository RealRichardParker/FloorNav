import {Component, OnInit, Input, SimpleChanges, OnChanges} from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnChanges {

  constructor() {
  }

  @Input() submitted: boolean;

  @Input() map: Array<Array<number>>;

  @Input() file: any;

  canvas: any;

  ctx: any;

  img: any;

  points: Array<any>;

  static dist(x, y, a, b): number {
    return (x - a) * (x - a) + (y - b) * (y - b);
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
    this.ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height);

    // draw navigation lines
    if (this.points.length >= 2) {
      this.astar();
    }

    // draw points
    this.points.forEach(function (item, index) {
      const radius = 5;

      this.ctx.beginPath();
      this.ctx.arc(item.x, item.y, radius, 0, 2 * Math.PI, false);
      this.ctx.fillStyle = 'green';
      this.ctx.fill();
      this.ctx.lineWidth = 5;
      this.ctx.strokeStyle = '#003300';
      this.ctx.stroke();
    });
  }

  astar(): void {

  }

  click(event): void {
    const x = event.offsetX;
    const y = event.offsetY;

    // find all points that are too close and remove them
    if (this.points.length > 0) {
      for (let i = this.points.length - 1; i >= 0; i--) {
        if (MainComponent.dist(x, y, this.points[i].x, this.points[i].y) < 5) { // todo
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
    this.points.push({x: x, y: y});
    this.draw();
  }

}
