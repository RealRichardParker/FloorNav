import {Component, OnInit, AfterViewInit, SimpleChanges } from '@angular/core';
import {trigger, state, style, animate, keyframes, transition} from '@angular/animations';

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
export class UploadComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
    let interval = setInterval(() => {
      if (this.fileAdded == true) {
        this.startPulse();
        clearInterval(interval);
    }}, 2000);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.bounceOnce();
    }, 1);
  }

  bounceState: string = 'inactive';

  pulseState: string = "inactive";

  fileToUpload: File = null;

  fileAdded: boolean = false;

  submitted: boolean = false;

  unOpaque: boolean = true;


  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.fileAdded = true;
  }

  prepare(): void {
    this.submitted = true;
  }

  bounceOnce(): void {
    this.bounceState = 'active';
  }

  endBounce(): void {
    this.bounceState = 'inactive';
    this.unOpaque = false;
  }

  startPulse() : void {
    this.pulseState = 'active';
  }

  endPulse(): void {
    this.pulseState = 'inactive';
    if (this.fileAdded) {
      setTimeout(() => {
        this.startPulse();
      }, 1500);
    }
  }

  onUploadSuccess(event): void {
    console.log(event[0]);
    this.fileToUpload = event[0];
    this.fileAdded = true;
  }

  onUploadError(event): void {
    console.error(event);
  }


}
