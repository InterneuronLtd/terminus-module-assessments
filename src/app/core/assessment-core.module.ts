//BEGIN LICENSE BLOCK 
//Interneuron Terminus

//Copyright(C) 2025  Interneuron Limited

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
/* Interneuron Assessment App
Copyright(C) 2023  Interneuron Holdings Ltd
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program.If not, see<http://www.gnu.org/licenses/>. */
import { Injector, NgModule } from '@angular/core';
import { InlineLoadingIndicatorComponent } from './components/inline-loading-indicator.component';
import { LoadingIndicatorComponent } from './components/loading-indicator.component';
import { ModuleLoaderDirective } from './directives/module-loader.directive';
import { GenericMessagePopupComponent } from './components/generic-message-popup.component';
import { BrowserModule } from '@angular/platform-browser';
import { InBaseComponent } from './components/InBaseComponent';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const CORE_COMPONENTS = [InBaseComponent, InlineLoadingIndicatorComponent, LoadingIndicatorComponent, ModuleLoaderDirective, GenericMessagePopupComponent];

@NgModule({
  declarations: [
    ...CORE_COMPONENTS
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ModalModule.forRoot(),
  ],
  providers: [],
  bootstrap: [],
  exports: [
    ...CORE_COMPONENTS
  ]
})
export class AssessmentCoreModule {
  constructor(private injector: Injector) { }
}
