///<reference path="../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import {Directive, EventEmitter, OnInit, Output} from '@angular/core';

@Directive({selector: '[appOnCreate]'})
export class OnCreateDirective implements OnInit {
  @Output() onCreate: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    this.onCreate.emit('dummy');
  }
}
