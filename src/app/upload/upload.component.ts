import { Component, OnInit, AfterViewInit } from '@angular/core';
import { trigger, state, style, animate, keyframes, transition } from '@angular/animations';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  animations: [
    trigger('bounceIn', [
      transition('inactive => active', animate(750, keyframes([
        style({opacity: 0, transform: 'scale3d(0.3, 0.3, 0.3)', offset: 0}),
        style({transform: 'scale3d(1.1, 1.1, 1.1)', offset: 0.2}),
        style({transform: 'scale3d(0.9, 0.9, 0.9)', offset: 0.4}),
        style({opacity: 1, transform: 'scale3d(1.03, 1.03, 1.03)', offset: 0.6}),
        style({transform: 'scale3d(0.97, 0.97, 0.97)', offset: 0.8}),
        style({opacity: 1, transform: 'scale3d(1, 1, 1)', offset: 1}),
      ]))),
    ])
  ]
})
export class UploadComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.bounceOnce()
    }, 1);
  }

  bounceState : string = "inactive";

  fileToUpload: File = null;

  fileAdded : boolean = false;

  submitted : boolean = false;

  unOpaque : boolean = true;


  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.fileAdded = true;
  }

  prepare() : void {
    this.submitted = true;
  }

  bounceOnce() : void {
    this.bounceState = "active";
  }

  endBounce() : void {
    this.bounceState = "inactive";
    this.unOpaque = false;
  }

  onUploadSuccess(event) : void {
    console.log(event[0]);
    this.fileToUpload = event[0];
    this.fileAdded = true;
  }



}
