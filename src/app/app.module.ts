//BEGIN LICENSE BLOCK 
//Interneuron Terminus

//Copyright(C) 2023  Interneuron Holdings Ltd

//This program is free software: you can redistribute it and/or modify
//it under the terms of the GNU General Public License as published by
//the Free Software Foundation, either version 3 of the License, or
//(at your option) any later version.

//This program is distributed in the hope that it will be useful,
//but WITHOUT ANY WARRANTY; without even the implied warranty of
//MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

//See the
//GNU General Public License for more details.

//You should have received a copy of the GNU General Public License
//along with this program.If not, see<http://www.gnu.org/licenses/>.
//END LICENSE BLOCK 

import { BrowserModule } from "@angular/platform-browser";
import { NgModule, Injector, DoBootstrap } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { createCustomElement } from "@angular/elements";
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { AssessmentCoreModule } from './core/assessment-core.module';
import { AssessmentModule } from './modules/assessment.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AssessmentCoreModule,
    AssessmentModule,
    ModalModule.forRoot(),
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [],
  entryComponents: [
    AppComponent
  ]
})
// export class AppModule {
//   constructor(private injector: Injector) { }
// }
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector) { }

  ngDoBootstrap(): void {
    const assessmentComponentElement = createCustomElement(AppComponent, {
      injector: this.injector
    });
    customElements.define("app-root-assessment", assessmentComponentElement);
  }
}
