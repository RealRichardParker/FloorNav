import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  fileToUpload: File = null;

  fileAdded : boolean = false;

  submitted : boolean = false;

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.fileAdded = true;
  }

  prepare() : void {
    this.submitted = true;
  }

}
