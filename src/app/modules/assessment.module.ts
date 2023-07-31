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
import { NgModule, Injector } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from '@angular/common/http';
import { DatePipe, CommonModule } from '@angular/common';
import { AssessmentContainerComponent } from './assessment-container/assessment-container.component';
import { EncounterNavigationComponent } from './assessment-selector/encounter-navigation/encounter-navigation.component';
import { AssessmentTypeSelectorComponent } from './assessment-selector/assessment-type-selector/assessment-type-selector.component';
import { AssessmentTypeActionComponent } from './assessment-selector/assessment-type-action/assessment-type-action.component';
import { AssessmentResultsComponent } from './assessment-results/assessment-results.component';
import { AssessmentDeleteComponent } from './assessment-delete/assessment-delete.component';
import { AssessmentCoreModule } from 'src/app/core/assessment-core.module';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';


const ASSESSMENT_COMPONENTS = [
    AssessmentContainerComponent,
    AssessmentResultsComponent,
    EncounterNavigationComponent,
    AssessmentTypeSelectorComponent,
    AssessmentTypeActionComponent,
    AssessmentDeleteComponent
];

@NgModule({
    declarations: [...ASSESSMENT_COMPONENTS],
    imports: [BrowserModule,
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        AssessmentCoreModule,
        ModalModule.forRoot(),
        ],
    providers: [DatePipe],
    bootstrap: [],
    exports: [...ASSESSMENT_COMPONENTS]
})
export class AssessmentModule {
    constructor(private injector: Injector) { }
}

