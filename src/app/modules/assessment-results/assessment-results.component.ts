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

import { Component, OnInit, Input, Injector, ChangeDetectorRef, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Encounter } from '../../shared/models/encounter';
import { AssessmentType } from '../../shared/models/assessmentType';
import { InBaseComponent } from 'src/app/core/components/InBaseComponent';
import { DatePipe } from '@angular/common';
import { DataPropagtorService } from 'src/app/core/services/data.propagator.service';
import { InAppBaseApiService } from 'src/app/core/services/in.appbase.service';
import { takeUntil } from 'rxjs/operators';
import { Assessment } from 'src/app/shared/models/assessment';
import { filters, filter, filterParams, filterparam, orderbystatement, selectstatement } from 'src/app/core/models/filter.model';
import { AssessmentsModuleConfigData } from 'src/app/config/app.module.config';

@Component({
  selector: 'app-assessment-results',
  templateUrl: './assessment-results.component.html',
  styleUrls: ['./assessment-results.component.css']
})
export class AssessmentResultsComponent extends InBaseComponent implements OnInit, OnDestroy {

  isLoadingData = false;
  assessments: Assessment[] = [];
  allAssessments: Assessment[] = [];
  displayDelete = false;
  assessmentToDelete: Assessment;

  @Input() patientIdInContext: string;

  @Input() encounter: Encounter;
  @Input() assessmentType: AssessmentType;
  @Output() reload: EventEmitter<any> = new EventEmitter<any>();

  constructor(protected injector: Injector, private dataPropSvc: DataPropagtorService, private apiService: InAppBaseApiService, private datePipe: DatePipe, private ref: ChangeDetectorRef) {
    super(injector);

    dataPropSvc.personIdChange.subscribe((patientId: string) => {
      this.loggerService.log(`PatientId Changed in Assessment: ${patientId}`);
      this.patientIdInContext = patientId;
      //But the assessments will be fetched only when the encounter or assessment type gets selected
    });
  }

  ngOnInit() {

    this.getAssessments();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  filterAssessmentsInList() {

    this.loggerService.log(`filtering assessment for type: ${this.assessmentType.assessmenttype_id}`);

    this.isLoadingData = true;

    if (this.allAssessments && this.allAssessments.length > 0) {

      if (this.assessmentType && this.assessmentType.assessmenttype_id == 'all') {
        this.assessments = JSON.parse(JSON.stringify(this.allAssessments)); //cloning and assigning
        this.isLoadingData = false;
        return;
      }

      let filtredAssessments = this.allAssessments.filter((allAssess: Assessment) => {
        return allAssess.assessmenttype_id == this.assessmentType.assessmenttype_id;
      });

      this.loggerService.log(`filtered assessments:`);

      this.loggerService.log(filtredAssessments);

      this.assessments = filtredAssessments;

      this.isLoadingData = false;

    } else {

      this.assessments = [];

      this.isLoadingData = false;
    }
  }

  reloadAssessments() {
    this.getAssessments((asm) => {
      this.ref.markForCheck(); //mark it as modified internally
      this.reload.emit();
    });
  }

  getAssessments(onGetAssessments?: (assessmentList) => void) {

    this.isLoadingData = true;

    this.assessments = undefined;

    this.allAssessments = undefined;

    //const url = `${APP_MODULE_CONFIG.app_service.base_uri}/GetBaseViewListByPost/bvassessment_alllatestassessments`;

    const url = `${AssessmentsModuleConfigData.Config.app_service.base_uri}/GetBaseViewListByPost/bvassessment_alltopversionassessmentswithtaskcount`;

    this.apiService.post<Assessment>(url, this.createAssessmentQueryFilter())
      .pipe(takeUntil(this.destroy$))
      .subscribe(assessmentList => {
        this.loggerService.log('Assessments received to  display');
        this.loggerService.log(assessmentList);

        if (assessmentList && Array.isArray(assessmentList) && assessmentList.length > 0) {

          assessmentList.forEach((assess: Assessment) => {
            assess._createddate = this.datePipe.transform(assess._createddate, 'dd-MMM-yyyy hh:mm', 'en-GB');
            assess._createdby =assess._createdby.toUpperCase().substring(assess._createdby.indexOf('\\') + 1,assess._createdby.length).replace("."," ");
            assess._createdtimestamp = this.datePipe.transform(assess._createdtimestamp, 'dd-MMM-yyyy hh:mm', 'en-GB');
            assess.status = assess._recordstatus === 2 ? 'Deleted' : (assess.isdraft ? 'In Progress' : 'Complete');

            if (assess.taskformsectionid)
              assess.canShowTask = true;
          });

          this.allAssessments = JSON.parse(JSON.stringify(assessmentList));
          this.loggerService.log('Assessments assigned with');
          this.loggerService.log(assessmentList);
          this.assessments = assessmentList;

          this.loggerService.log('New Assessments assigned with');
          this.loggerService.log(this.assessments);

        } else {
          this.assessments = [];
        }

        this.isLoadingData = false;
        if (onGetAssessments) onGetAssessments(assessmentList);

      }, err => {
        this.loggerService.logError(err);
        this.isLoadingData = false;
        if (onGetAssessments) onGetAssessments(null);
      });
  }

  createAssessmentQueryFilter() {

    let condition = "person_id=@person_id and encounter_id=@encounter_id";

    let pm = new filterParams();

    pm.filterparams.push(new filterparam("person_id", this.patientIdInContext));

    pm.filterparams.push(new filterparam("encounter_id", this.encounter.encounter_id));

    if (this.assessmentType && this.assessmentType.assessmenttype_id && this.assessmentType.assessmenttype_id !== 'all') {

      condition = `${condition} and assessmenttype_id=@assessmenttype_id`;

      pm.filterparams.push(new filterparam("assessmenttype_id", this.assessmentType.assessmenttype_id));
    }

    let f = new filters()
    f.filters.push(new filter(condition));

    let select = new selectstatement("SELECT *");

    let orderby = new orderbystatement('ORDER BY "_createddate" desc');

    let body = [];
    body.push(f);
    body.push(pm);
    body.push(select);
    body.push(orderby);

    this.loggerService.log(JSON.stringify(body));

    return JSON.stringify(body);
  }

  view(assessment: Assessment) {
    this.dataPropSvc.loadAssessmentModule.next({
      assessment: assessment, action: 'view', actionType: assessment.assessmenttypename
    });
  }

  edit(assessment: Assessment) {
    this.dataPropSvc.loadAssessmentModule.next({
      assessment: assessment, action: 'edit', actionType: assessment.assessmenttypename
    });
  }

  delete(assessment: Assessment) {
    this.displayDelete = true;
    this.assessmentToDelete = assessment;
  }

  onDeleteClose(e: any) {
    this.loggerService.log('On Delete close');
    this.displayDelete = false;
    this.reloadAssessments();
  }

  amend(assessment: Assessment) {
    this.dataPropSvc.loadAssessmentModule.next({ assessment: assessment, action: 'amend', actionType: assessment.assessmenttypename });
  }

  viewHistory(assessment: Assessment) {
    this.dataPropSvc.loadAssessmentModule.next({ assessment: assessment, action: 'viewhistory', actionType: assessment.assessmenttypename });
  }

  showTasks(assessment: Assessment) {
    this.dataPropSvc.loadAssessmentModule.next({ assessment: assessment, action: 'showtasks', actionType: assessment.assessmenttypename });

  }

  getTestAssessments() {

    this.isLoadingData = true;
    this.assessments = undefined;
    setTimeout(() => {
      var assessmentsFromSvc = new Array<Assessment>();

      var asm1 = new Assessment();
      asm1.assessment_id = 'b784a8d1-0053-32a8-5d20-2ff4aef7b6c9';//'51e9976b-413e-514b-1d3a-cdd61175d54e';
      asm1.assessmenttype_id = '2d06f955-88f6-4fa0-ac5f-3c7dc134f347';
      asm1.encounter_id = '58b305c9-3753-4c5e-ac4a-eba1d19dca48';
      asm1.observationevent_id = 'dsf3433-weqwe';
      asm1.person_id = 's2323-weqwe';
      asm1.versionid = 1.0;
      asm1.isdraft = false;
      asm1._createddate = this.datePipe.transform("2018-08-21T01:40:08.963258", 'dd-MMM-yyyy', 'en-GB');
      asm1._createdtimestamp = this.datePipe.transform("2018-08-21T01:40:08.963258", 'dd-MMM-yyyy', 'en-GB');
      asm1.isamended = false;
      asm1.formtype_id = 'wewewe-sd232-weqwe';
      asm1.status = asm1.isdraft ? 'In Progress' : 'Complete';
      asm1.assessmenttypename = 'Sepsis Assessment';
      assessmentsFromSvc.push(asm1);

      var asm11 = new Assessment();
      asm11.assessment_id = 'b784a8d1-0053-32a8-5d20-2ff4aef7b6c9';//'70a38517-748c-83b5-5243-5f5fe64fc26f';
      asm11.assessmenttype_id = '2d06f955-88f6-4fa0-ac5f-3c7dc134f347';
      asm11.encounter_id = '58b305c9-3753-4c5e-ac4a-eba1d19dca48';
      asm11.observationevent_id = 'dsf3433-weqwe';
      asm11.person_id = 's2323-weqwe';
      asm11.versionid = 1.0;
      asm11.isdraft = true;
      asm11._createddate = this.datePipe.transform("2018-08-20T01:40:08.963258", 'dd-MMM-yyyy', 'en-GB');
      asm11._createdtimestamp = this.datePipe.transform("2018-08-20T01:40:08.963258", 'dd-MMM-yyyy', 'en-GB');
      asm11.isamended = false;
      asm11.formtype_id = 'wewewe-sd232-weqwe';
      asm11.status = asm11.isdraft ? 'In Progress' : 'Complete';
      asm11.assessmenttypename = 'Sepsis Assessment';
      assessmentsFromSvc.push(asm11);

      var asm2 = new Assessment();
      asm2.assessment_id = '34323-2323';
      asm2.assessmenttype_id = '70a38517-748c-83b5-5243-5f5fe64fc26f';
      asm2.encounter_id = '7a017a1c-8bc5-46f8-9d4d-1afd00640103';
      asm2.observationevent_id = 'asdasd231-weqwe';
      asm2.person_id = '123333adasd-weqwe';
      asm2.versionid = 1.0;
      asm2.isdraft = false;
      asm2._createddate = this.datePipe.transform("2019-08-21T01:40:08.963258", 'dd-MMM-yyyy', 'en-GB');
      asm2._createdtimestamp = this.datePipe.transform("2019-08-21T01:40:08.963258", 'dd-MMM-yyyy', 'en-GB');
      asm2.isamended = false;
      asm2.formtype_id = '2312ds-sd232-weqwe';
      asm2.status = asm2.isdraft ? 'In Progress' : 'Complete';
      asm2.assessmenttypename = 'Dementia Assessment';

      assessmentsFromSvc.push(asm2);

      var asm21 = new Assessment();
      asm21.assessment_id = '42323232-2323';
      asm21.assessmenttype_id = 'f8e69ede-71b4-4d5e-8e1e-d296c46b4350';
      asm21.encounter_id = '7a017a1c-8bc5-46f8-9d4d-1afd00640103';
      asm21.observationevent_id = 'asdasd231-weqwe';
      asm21.person_id = '123333adasd-weqwe';
      asm21.versionid = 1.0;
      asm21.isdraft = true;
      asm21._createddate = this.datePipe.transform("2019-08-20T01:40:08.963258", 'dd-MMM-yyyy', 'en-GB');
      asm21._createdtimestamp = this.datePipe.transform("2019-08-20T01:40:08.963258", 'dd-MMM-yyyy', 'en-GB');
      asm21.isamended = false;
      asm21.formtype_id = '2312ds-sd232-weqwe';
      asm21.status = asm21.isdraft ? 'In Progress' : 'Complete';
      asm21.assessmenttypename = 'Dementia Assessment';

      assessmentsFromSvc.push(asm21);

      if (this.encounter) {
        assessmentsFromSvc = assessmentsFromSvc.filter(at => at.encounter_id == this.encounter.encounter_id);
      }

      if (this.assessmentType && this.assessmentType.assessmenttype_id !== 'all') {
        assessmentsFromSvc = assessmentsFromSvc.filter(at => at.assessmenttype_id == this.assessmentType.assessmenttype_id);
      }

      this.assessments = assessmentsFromSvc;
      this.isLoadingData = false;
    }, 5000);
  }

}

