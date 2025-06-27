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

import { Component, OnInit, OnDestroy, Output, EventEmitter, Injector } from '@angular/core';
import { Encounter } from '../../../shared/models/encounter';
import { InAppBaseApiService } from 'src/app/core/services/in.appbase.service';
import { InBaseComponent } from 'src/app/core/components/InBaseComponent';
import { takeUntil } from 'rxjs/operators';
import { filters, filter, filterParams, filterparam, selectstatement, orderbystatement } from 'src/app/core/models/filter.model';
import { DatePipe } from '@angular/common';
import { DataPropagtorService } from 'src/app/core/services/data.propagator.service';
import { AssessmentsModuleConfigData } from 'src/app/config/app.module.config';

@Component({
  selector: 'app-encounter-navigation',
  templateUrl: './encounter-navigation.component.html',
  styleUrls: ['./encounter-navigation.component.css']
})
export class EncounterNavigationComponent extends InBaseComponent implements OnInit, OnDestroy {
  encounters: Encounter[] = [];
  selectedEncounterText: string = " ";
  patientIdInContext: string;

  @Output() encounterChanged = new EventEmitter<Encounter>();

  constructor(protected injector: Injector, private apiService: InAppBaseApiService, private propagatorService: DataPropagtorService, private datepipe: DatePipe) {

    super(injector);

    //Test Only - Comment it
    //propagatorService.personIdChange.next('"a4074c14-568b-44e8-9314-df0737e6513f"');

    propagatorService.personIdChange.subscribe((patientId: string) => {
      this.loggerService.log(`PatientId Changed In Assessment: ${patientId}`);
      this.patientIdInContext = patientId;
      this.getEncounters();
    });
  }

  ngOnInit() {
    //this.getEncounters();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    //this.subscriptions.unsubscribe();
  }

  getEncounters() {

    this.encounters = [];
    this.selectedEncounterText = "Visits";

    let url = `${AssessmentsModuleConfigData.Config.app_service.base_uri}/GetBaseViewListByPost/bv_core_inpatientappointments`;

    this.loggerService.log(url);
    this.apiService.post<Encounter>(url, this.createEncounterFilter())
      .pipe(takeUntil(this.destroy$))
      .subscribe(encList => {

        this.loggerService.log(encList);

        if (encList && Array.isArray(encList) && encList.length > 0) {
          let encountersFromSvc: Encounter[] = [];

          encList.forEach((encResponse, encIndex) => {

            encResponse.displaytext = this.datepipe.transform(encResponse.admitdatetime, 'dd-MMM-yyyy', 'en-GB')

            if (encIndex == 0) {
              this.selectedEncounterText = encResponse.displayText;
              if (this.hasNotDischarged(encResponse)) {
                this.selectedEncounterText = encResponse.displaytext = "Current Visit (" + this.datepipe.transform(encResponse.admitdatetime, 'dd-MMM-yyyy', 'en-GB') + ")";
              }
            }
            encountersFromSvc.push(<Encounter>encResponse);
          });

          this.encounters = encountersFromSvc;

          this.selectEncounter(this.encounters[0]);
        } else {
          this.encounters = [];
          this.encounterChanged.emit(null);
          this.propagatorService.encounterChange.next(null);
          this.contextStateService.encounterId = null;
        }

        this.propagatorService.pageLoaded.next(true);

      });
  }

  hasNotDischarged(encResponse: any): boolean {
    return encResponse.dischargedatetime == null || (encResponse.dischargedatetime && encResponse.dischargedatetime.trim() == "");
  }

  selectEncounter(encounter: Encounter) {
    this.loggerService.log(`changed encounter: ${event}`);

    this.selectedEncounterText = encounter.displaytext;
    this.propagatorService.encounterChange.next(encounter);
    this.encounterChanged.emit(encounter);
    this.contextStateService.encounterId = encounter.encounter_id;
  }

  onEncounterClicked(event: any) {
    this.loggerService.log(`changed encounter: ${event}`);
    this.propagatorService.encounterChange.next(event);
    this.encounterChanged.emit(event);
  }

  createEncounterFilter() {

    let condition = "person_id=@person_id";
    let f = new filters()
    f.filters.push(new filter(condition));

    let pm = new filterParams();

    //pm.filterparams.push(new filterparam("person_id", "a4074c14-568b-44e8-9314-df0737e6513f")); //this.appservice.personId));

    pm.filterparams.push(new filterparam("person_id", this.patientIdInContext));

    let select = new selectstatement("SELECT person_id, encounter_id,admitdatetime,dischargedatetime");

    let orderby = new orderbystatement("ORDER BY admitdatetime desc");

    let body = [];
    body.push(f);
    body.push(pm);
    body.push(select);
    body.push(orderby);

    this.loggerService.log(JSON.stringify(body));

    this.loggerService.log(body);

    return JSON.stringify(body);
  }

}
