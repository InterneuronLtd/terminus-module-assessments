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
import { Component, OnInit, OnDestroy, Injector, ViewChild, ChangeDetectorRef } from '@angular/core';
import { InAppBaseApiService } from 'src/app/core/services/in.appbase.service';
import { takeUntil } from 'rxjs/operators';
import { InBaseComponent } from 'src/app/core/components/InBaseComponent';
import { AssessmentType } from 'src/app/shared/models/assessmentType';
import { Encounter } from 'src/app/shared/models/encounter';
import { AssessmentResultsComponent } from '../assessment-results/assessment-results.component';
import { DataPropagtorService } from 'src/app/core/services/data.propagator.service';
import { AssessmentsModuleConfigData } from 'src/app/config/app.module.config';

@Component({
  selector: 'app-assessment-container',
  templateUrl: './assessment-container.component.html',
  styleUrls: ['./assessment-container.component.css']
})
export class AssessmentContainerComponent extends InBaseComponent implements OnInit, OnDestroy {

  assessmentTypes: AssessmentType[] = [];
  selectedEncounter: Encounter = undefined;
  selectedAssessmentType: AssessmentType = undefined;
  showResultList = false;
  patientIdInContext: string;

  detectChangeInterval = null;

  @ViewChild('results', { read: AssessmentResultsComponent }) assessmentResultsComponent: AssessmentResultsComponent;

  constructor(protected injector: Injector, private apiService: InAppBaseApiService, private dataPropSvc: DataPropagtorService, private ref: ChangeDetectorRef) {
    super(injector);

    this.detectChangeInterval = setInterval(() => {
      this.ref.detectChanges();
    }, 5000);


    this.dataPropSvc.refreshAssessmentList
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      setTimeout(() => {
        this.loggerService.log(`Request to re-load the assessment list`);
        this.refreshAssessmentList(null);
        this.ref.detectChanges(); //trigger for change tracker for the current componennt change

      });
    });

    dataPropSvc.personIdChange.subscribe((patientId: string) => {
      this.loggerService.log(`PatientId Changed in Assessment: ${patientId}`);
      this.patientIdInContext = patientId;
      //But the assessments will be fetched only when the encounter or assessment type gets selected
    });
  }

  ngOnInit() {
    this.loggerService.log(`Inside ngOnInit of container`);
    this.getAssessmentTypes();
    //this.loadTestData();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    clearInterval(this.detectChangeInterval);
  }

  onReloadResults() {
    this.loggerService.log(`re-loaded the assessment list`);
    setTimeout(() => {
      this.ref.detectChanges();
    });
  }

  getAssessmentTypes() {

    this.loggerService.log(`Inside getAssessmentTypes`);

    this.assessmentTypes = [];

    let url = `${AssessmentsModuleConfigData.Config.app_service.base_uri}/GetList?synapsenamespace=meta&synapseentityname=assessmenttype`;

    this.loggerService.log(url);

    this.apiService.get(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe(assessmentTypeListFromDB => {

        this.loggerService.log(assessmentTypeListFromDB);

        let assessmentTypeList: any;

        if (typeof assessmentTypeListFromDB === 'string') {
          assessmentTypeList = JSON.parse(assessmentTypeListFromDB);
        } else {
          assessmentTypeList = assessmentTypeListFromDB;
        }


        if (assessmentTypeList && Array.isArray(assessmentTypeList) && assessmentTypeList.length > 0) {
          let typesFromSvc: AssessmentType[] = [];
          assessmentTypeList.forEach(atype => {
            let assementTy: AssessmentType = <AssessmentType>atype;
            typesFromSvc.push(assementTy);
          });
          this.assessmentTypes = typesFromSvc;
        } else {
          this.assessmentTypes = [];
        }
      });

  }

  onEncounterChanged(changedEncounter) {
    this.loggerService.log('Registered Changed encounter');
    this.loggerService.log(changedEncounter);
    this.showResultList = false;
    setTimeout(() => {
      this.selectedEncounter = changedEncounter;
      this.showResultList = true;
    });
  }

  onAssessmentTypeChanged(changedAssessmentType) {
    this.loggerService.log('Registered Changed assessment type');
    this.loggerService.log(changedAssessmentType);
    this.showResultList = false;
    setTimeout(() => {
      this.selectedAssessmentType = changedAssessmentType;
      this.showResultList = true;
    });
  }

  onAssessmentActionChanged(changedAssessmentType) {
    this.loggerService.log('Registered Changed assessment action');
    this.loggerService.log(changedAssessmentType);
  }

  refreshAssessmentList(e: any) {
    this.loggerService.log('refreshing');
    if (this.assessmentResultsComponent)
      this.assessmentResultsComponent.reloadAssessments();
  }


}
