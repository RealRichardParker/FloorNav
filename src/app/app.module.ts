import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { UploadComponent } from './upload/upload.component';
import { ProcessComponent } from './process/process.component';


@NgModule({
  declarations: [
    AppComponent,
    UploadComponent,
    ProcessComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
