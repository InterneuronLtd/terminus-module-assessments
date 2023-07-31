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

import { Component, Input, OnDestroy, Injector, EventEmitter, Output } from "@angular/core";
import { Subject } from 'rxjs';
import { InBaseComponent } from './core/components/InBaseComponent';
import { DataPropagtorService } from './core/services/data.propagator.service';
import { Assessment } from './shared/models/assessment';
import { ComponentModuleData } from './core/directives/module-loader.directive';
import { InAppBaseApiService } from './core/services/in.appbase.service';
import { takeUntil } from 'rxjs/operators';
import { AssessmentsConfigService } from './config/app.config.service';
import { AssessmentsModuleConfigData } from './config/app.module.config';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent extends InBaseComponent implements OnDestroy {



  subjects = new Subject();
  showLoadingIndicator = false;
  showModuleDetails = false;
  componentModuleData = new ComponentModuleData();
  dataContractReceivedFromFW = false;
  apiServiceFromFW: any;

  @Input()
  set unload(value: Subject<any>) {
    this.loggerService.log('unloading app-root-assessment...');
    this.loggerService.log(value);
    this.subjects = value;
  }
 

  @Input()
  set datacontract(value: any) {

    if (value) {

      this.apiBaseService.apiClientFromFW = this.apiServiceFromFW = value.apiService;

      if (!AssessmentsModuleConfigData.Config) {
        this.appConfigService.load()
          .then(() => {
            this.loadDataContract(value);
            this.initialize();
          });
      }
      else {
        this.loadDataContract(value);
        this.initialize();
      }
    }
  }

  @Output() frameworkAction = new EventEmitter<string>(); /// changes by sachin

  constructor(protected injector: Injector, private dataPropogateSvc: DataPropagtorService,
    private apiBaseService: InAppBaseApiService, private appConfigService: AssessmentsConfigService) {

    super(injector);

    // if (!AssessmentsModuleConfigData.Config) {
    //   this.appConfigService.load()
    //     .then(() => {
    //       this.initialize();
    //     });
    // } else{
    //   this.initialize();
    // }
  }

  ngOnInit() {
    this.showLoadingIndicator = true;

    //Start testing block
    // let val = { personId: 'd91ef1fa-e9c0-45ba-9e92-1e1c4fd468a2', apiService: this.apiBaseService };
    // if (!AssessmentsModuleConfigData.Config) {
    //   this.appConfigService.load()
    //     .then(() => {
    //       this.loadDataContract(val);
    //       this.initialize();
    //     });
    // }
    //end testing block
  }

  ngOnDestroy() {
    this.componentModuleData = null;
    this.loggerService.log('destroying app-root-assessment')
    this.apiBaseService.reset();
    this.dataPropogateSvc.reset();
    this.contextStateService.reset();
    this.appConfigService.reset();
    // this.apiBaseService = null;
    // this.dataPropogateSvc = null;
    // this.contextStateService = null;
    this.destroy$.next();
    this.subjects.next('app-root-assessment');
  }

  initialize(): any {
    this.dataPropogateSvc.pageLoaded
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoaded: boolean) => {
        this.loggerService.log(`Page Loaded publisher: ${isLoaded}`);
        this.showLoadingIndicator = !isLoaded;
      });

    this.dataPropogateSvc.loadAssessmentModule
      .pipe(takeUntil(this.destroy$))
      .subscribe((moduleData) => {

        this.loggerService.log('Loading Assessment module');
        this.loadAssessmentModuleDetail(moduleData);
      });
  }

  loadDataContract(val: any): any {
    this.loggerService.log(val);
    this.apiBaseService.apiClientFromFW = this.apiServiceFromFW = val.apiService;
    this.contextStateService.personId = val.personId;
    this.dataContractReceivedFromFW = true;
    setTimeout(() => this.dataPropogateSvc.personIdChange.next(val.personId));
  }

  loadAssessmentModuleDetail(moduleData: { assessment?: Assessment, action: 'new' | 'edit' | 'view' | 'amend' | 'viewhistory' | 'showtasks', actionType?: string }) {

    this.showModuleDetails = false;

    this.componentModuleData = new ComponentModuleData();

    console.log('Inside the loading module with data:');

    console.log(moduleData);

    //if (moduleData.actionType && moduleData.actionType.indexOf('Sepsis') >= 0) {

      if (moduleData.action === 'new') {
        //Initialize assessment
        moduleData.assessment = moduleData.assessment ? moduleData.assessment : new Assessment();
        moduleData.assessment.encounter_id = this.contextStateService.encounterId;
        moduleData.assessment.person_id = this.contextStateService.personId;
        moduleData.assessment.sourceofinvocation = 'manual';
      }

      //This should come from module service
      console.log('Loading the sepsis loading module');

      //let url = `${AssessmentsModuleConfigData.Config.app_service.base_uri}/GetListByAttribute?synapsenamespace=meta&synapseentityname=module&synapseattributename=modulename&attributevalue=SepsisAssessment`;
      let url = `${AssessmentsModuleConfigData.Config.app_service.base_uri}/GetListByAttribute?synapsenamespace=meta&synapseentityname=module&synapseattributename=modulename&attributevalue=${moduleData.assessment.assessmenttypename}`;

      this.loggerService.log(url);

      this.apiBaseService.get(url)
        .pipe(takeUntil(this.destroy$))
        .subscribe((assessmentModulesFromDb) => {

          let cloned: any = [];

          if (typeof assessmentModulesFromDb === 'string') {
            this.loggerService.log('Received Assessment Modules as string');
            cloned = JSON.parse(assessmentModulesFromDb);
          }
          else {
            this.loggerService.log('Received Assessment Modules as json');
            cloned = assessmentModulesFromDb;
          }

          this.loggerService.log('Received Assessment Modules:');
          this.loggerService.log(cloned);

          const assessmentModuleToLoad: any = cloned[0]; //let it throw the error if it does not exist

          this.loggerService.log('Received Assessment Module:');
          this.loggerService.log(cloned[0]);

          this.componentModuleData.elementTag = assessmentModuleToLoad.domselector;//'app-sepsis-assessment';
          this.componentModuleData.url = `${assessmentModuleToLoad.jsurl}`;//'http://127.0.0.1:5501/dist/terminus-module-sepsis-assessment/main.js';
          // this.componentModuleData.url = 'http://127.0.0.1:5501/dist/terminus-module-sepsis-assessment/main.js';
          //this.componentModuleData.elementTag = 'app-dementia-assessment';
          //this.componentModuleData.url = 'http://127.0.0.1:5501/dist/dummy-module-dementia-assessment/main.js';

          let asm = moduleData.assessment;
          this.componentModuleData.assessmentModuleContext = {
            //assessment: moduleData.assessment,
            assessment: {
              assessment_id: asm.assessment_id,
              assessmenttype_id: asm.assessmenttype_id,
              encounter_id: asm.encounter_id,
              formtype_id: asm.formtype_id,
              observationevent_id: asm.observationevent_id,
              person_id: asm.person_id,
              versionid: asm.versionid,
              sourceofinvocation: asm.sourceofinvocation
            },
            apiServiceFromFW: this.apiServiceFromFW,
            action: moduleData.action
          };

          this.showModuleDetails = true;
        }, (err) => {
          this.loggerService.logError(err);
        });

    //}
  }

  onSepsisModuleUnLoad(e: any) {
    this.showModuleDetails = false;
    this.loggerService.log('On Sepsis Module Unload');
    this.dataPropogateSvc.refreshAssessmentList.next();
    this.frameworkAction.emit("UPDATE_HEIGHT_WEIGHT");  

  }
}
