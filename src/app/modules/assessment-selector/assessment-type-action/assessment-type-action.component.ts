//BEGIN LICENSE BLOCK 
//Interneuron Terminus

//Copyright(C) 2022  Interneuron CIC

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

import { Component, OnInit, Input, EventEmitter, Output, Injector, OnDestroy } from '@angular/core';
import { AssessmentType } from '../../../shared/models/assessmentType';
import { InBaseComponent } from 'src/app/core/components/InBaseComponent';
import { DataPropagtorService } from 'src/app/core/services/data.propagator.service';

@Component({
  selector: 'app-assessment-type-action',
  templateUrl: './assessment-type-action.component.html',
  styleUrls: ['./assessment-type-action.component.css']
})
export class AssessmentTypeActionComponent extends InBaseComponent implements OnInit, OnDestroy {
  selectedAssessmentAction: string = "Select Action";

  @Input() assessmentTypes: AssessmentType[] = [];
  @Output() assessmentActionChange = new EventEmitter<AssessmentType>();

  constructor(protected injector: Injector, private dataPropSvc: DataPropagtorService) {
    super(injector);
  }

  ngOnInit() {
    //this.getAssessmentTypes();
  }

  ngOnDestroy(){
    super.ngOnDestroy();
  }

  selectAssessmentAction(assessmentType: AssessmentType) {
    this.loggerService.log('Changed Assessment Action Name');
    this.loggerService.log(assessmentType);
    this.assessmentActionChange.emit(assessmentType);

    this.dataPropSvc.loadAssessmentModule.next({ assessment: { assessmenttype_id: assessmentType.assessmenttype_id, assessmenttypename: assessmentType.typename  }, action: 'new', actionType: assessmentType.actionname });
  }

  getAssessmentTypes() {
    var encountersFromService: AssessmentType[] = [];

    var enc1: AssessmentType = new AssessmentType();
    enc1.actionname = "New Sepsis Assessment";

    var enc2: AssessmentType = new AssessmentType();
    enc2.displayname = "New Dementia Assessment";

    encountersFromService.push(enc1);
    encountersFromService.push(enc2);

    this.assessmentTypes = encountersFromService;
  }

}
