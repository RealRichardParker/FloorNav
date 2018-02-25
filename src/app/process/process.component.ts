import { Component, OnInit, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import * as astar from 'javascript-astar';

const Graph = astar.Graph;
const search = astar.astar.search;

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.css']
})
export class ProcessComponent implements OnInit {

  static outOfRange(a: number, min: number, max: number): boolean {
    return a < min || a >= max;
  }

  constructor() { }

  ngOnInit() {
  }

  @Input() file: any;

  @Input() submitted: boolean;

  process(): any {

  }


  RUNMMM() {
    console.log('RUN MMMM');
    const c = <HTMLCanvasElement>document.getElementById('GRORORO');
    const ctx = c.getContext('2d');

    // Create gradient
    const grd = ctx.createLinearGradient(0, 0, 200, 0);
    grd.addColorStop(0, 'red');
    grd.addColorStop(1, 'black');

    // Fill with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(10, 10, 150, 80);
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
