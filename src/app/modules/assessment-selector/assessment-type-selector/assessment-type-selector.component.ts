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
import { Component, OnInit, Input, Output, EventEmitter, Injector, OnDestroy } from "@angular/core";
import { AssessmentType } from "../../../shared/models/assessmentType";
import { InBaseComponent } from 'src/app/core/components/InBaseComponent';

@Component({
  selector: "app-assessment-type-selector",
  templateUrl: "./assessment-type-selector.component.html",
  styleUrls: ["./assessment-type-selector.component.css"]
})
export class AssessmentTypeSelectorComponent extends InBaseComponent implements OnInit, OnDestroy {

  selectedAssessmentTypeText: string = "All Assessments";
  _assessmentTypes: AssessmentType[];

  defaultAssessmentType: AssessmentType = this.getDefaultAssessmentType();

  @Input()
  set assessmentTypes(assessmentTypes: AssessmentType[]) {
    if (assessmentTypes && Array.isArray(assessmentTypes) && assessmentTypes.length > 0) {
      this._assessmentTypes = assessmentTypes;
      this._assessmentTypes.splice(0, 0, this.defaultAssessmentType);
      this.selectedAssessmentTypeText = this.defaultAssessmentType.displayname;
    }
  }
  get assessmentTypes(): AssessmentType[] {
    return this._assessmentTypes;
  }

  @Output() assessmentTypeChange = new EventEmitter<AssessmentType>();

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    //this.getAssessmentTypes();
  }

  ngOnDestroy(){
    super.ngOnDestroy();
  }

  getDefaultAssessmentType(): AssessmentType {
    var defAssessmentType = new AssessmentType();
    defAssessmentType.assessmenttype_id = 'all';
    defAssessmentType.displayname = 'All Assessments';
    return defAssessmentType;
  }

  selectAssessmentType(assessmentType: AssessmentType) {
    this.loggerService.log('Changed Assessment Type Name');
    this.loggerService.log(assessmentType);
    this.assessmentTypeChange.emit(assessmentType);
    this.selectedAssessmentTypeText = assessmentType.displayname;
  }

  getAssessmentTypes() {
    var encountersFromService: AssessmentType[] = [];

    var enc1: AssessmentType = new AssessmentType();
    enc1.displayname = "Sample 1";

    var enc2: AssessmentType = new AssessmentType();
    enc2.displayname = "Sample 2";

    encountersFromService.push(enc1);
    encountersFromService.push(enc2);

    this.assessmentTypes = encountersFromService;
  }


}
