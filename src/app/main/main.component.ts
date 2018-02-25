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

  queue: Array<any>;

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

      this.canvas.width = this.img.width >> 1;
      this.canvas.height = this.img.height >> 1;

      this.queue = [];
      this.draw();

      this.canvas.addEventListener('click', this.click(event), false);
    };
  }

  draw(): void {
    this.ctx.drawImage(this.img, 0, 0, this.img.width >> 1, this.img.height >> 1);

    // draw navigation lines
    if (this.queue.length >= 2) {
      this.astar();
    }

    // draw points
    // todo
  }

  astar(): void {

  }

  click(event): void {
    var x = event.offsetX;
    var y = event.offsetY;

    // find all points that are too close and remove them
    if (this.queue.length > 0) {
      for (var i = this.queue.length - 1; i >= 0; i--) {
        if (MainComponent.dist(x, y, this.queue[i].x, this.queue[i].y) < 5) { // todo
          this.queue.splice(i, 1);
          return;
        }
      }
    }

    // queue can only hold 2 elements
    while (this.queue.length > 2) {
      this.queue.shift();
    }

    // add point to canvas
    this.queue.push({x: x, y: y});
    this.draw();
  }

  static dist(x, y, a, b): number {
    return (x - a) * (x - a) + (y - b) * (y - b);
  }

}
