///<reference path="../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import {Component, OnInit, Input, AfterViewInit, AfterContentInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { NgClass } from '@angular/common';
import * as astar from 'javascript-astar';
import {trigger, state, style, animate, keyframes, transition} from '@angular/animations';

const Graph = astar.Graph;
const search = astar.astar.search;

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
      transition('inactive => active', animate(750, keyframes([
        style({opacity: 0, transform: 'translate3d(-100%, 0, 0)'}),
        style({opacity: 1, transform: 'translate3d(0, 0, 0)'}),
      ]))),
    ])
  ]
})
export class ProcessComponent implements OnInit {

  static outOfRange(a: number, min: number, max: number): boolean {
    return a < min || a >= max;
  }

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propertyName in changes) {
      if (propertyName == "submitted" && this.submitted == true) {
        setTimeout(() => {
          this.fadeOnce();
          this.RUNMMM();
        }, 1);
      }
    }
  }

  @Input() file: any;

  @Input() submitted: boolean;

  canvas : any;

  ctx : any;

  img : any;

  fadeState: string = 'inactive';

  unOpaque: boolean = true;

  fadeOnce(): void {
    this.fadeState = 'active';
  }

  endFade(): void {
    this.fadeState = 'inactive';
    this.unOpaque = false;
  }

  process(): any {

  }

  RUNMMM() {
    console.log('RUN MMMM');
    this.canvas = <HTMLCanvasElement>document.getElementById('GRORORO');
    this.ctx =  this.canvas.getContext('2d');

    this.img = new Image;
    this.img.src = this.file.dataURL;
    this.img.onload = () => {

      this.canvas.width = this.img.width >> 1;
      this.canvas.height =this.img.height >> 1;

      this.draw();

      this.canvas.addEventListener('mouseout', this.draw.bind(this), false);
      this.canvas.addEventListener('mousemove', this.move.bind(this), false);
    }
  }

  draw() : void {
    this.ctx.drawImage(this.img, 0, 0, this.img.width >> 1, this.img.height >> 1);
  }

  /* this can be optimized more; use proportions and shit */
  move(e : any) {
    this.ctx.drawImage(this.img, -e.clientX, -e.clientY, this.img.width + 800, this.img.height + 300);
  }


  shortest(map: Array<Array<boolean>>, start: number, end: number) {
    // todo:
  }

  rooms(map: Array<Array<boolean>>): Array<Array<number>> {

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
      for  (const loc of level) {
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

    return dist;
  }




}
