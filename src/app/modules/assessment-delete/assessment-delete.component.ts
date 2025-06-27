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
import { InBaseComponent } from 'src/app/core/components/InBaseComponent';
import { Injector, Component, OnDestroy, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Assessment } from 'src/app/shared/models/assessment';
import { InAppBaseApiService } from 'src/app/core/services/in.appbase.service';
import { takeUntil } from 'rxjs/operators';
import { GenericMessagePopup, GenericMessagePopupAction } from 'src/app/core/components/generic-message-popup.component';
import { AssessmentsModuleConfigData } from 'src/app/config/app.module.config';

@Component({
   selector: 'app-assessment-delete',
   templateUrl: `./assessment-delete.component.html`,
   styleUrls: ['./assessment-delete.component.css']
})
export class AssessmentDeleteComponent extends InBaseComponent implements OnDestroy {

   reasonForDelete: string = '';

   @Input() assessment?: Assessment;

   @Output() close: EventEmitter<any> = new EventEmitter<any>();

   @Input()
   set displayDeleteModal(val) {
      this.isModalShown = val;
   }

   isModalShown = false;

   showDeleteConfirmationMessagePopup = false;

   confirmationMessagePopup: GenericMessagePopup = new GenericMessagePopup();

   showFullLoadingIndicator = false;

   showSaveStatusMessagePopup = false;

   saveStatusMessagePopup: GenericMessagePopup = new GenericMessagePopup();

   @ViewChild('deleteModal', { read: ModalDirective }) chartModal: ModalDirective;

   messageTimeOut = null;

   constructor(protected injector: Injector, private apiService: InAppBaseApiService) {
      super(injector);

      this.prepareSaveConfirmation();
   }

   ngOnDestroy() {
      super.ngOnDestroy();
      
      if (this.messageTimeOut)
         clearTimeout(this.messageTimeOut);
   }

   hideModal(): void {
      this.chartModal.hide();
   }

   onHidden(): void {
      this.isModalShown = false;

      this.loggerService.log('hiding the delete popup');

      if (this.close) this.close.emit(false);
   }

   onConfirmDelete(e: any) {
      this.showDeleteConfirmationMessagePopup = true;
   }

   saveAssessment() {

      let assessmentToSave = {
         assessment_id: this.assessment.assessment_id,
         assessmenttype_id: this.assessment.assessmenttype_id,
         encounter_id: this.assessment.encounter_id,
         formtype_id: this.assessment.formtype_id,
         isamended: this.assessment.isamended,
         isdraft: this.assessment.isdraft,
         observationevent_id: this.assessment.observationevent_id,
         person_id: this.assessment.person_id,
         reasonfordelete: this.reasonForDelete,
         sourceofinvocation: this.assessment.sourceofinvocation,
         taskformsectionid: this.assessment.taskformsectionid,
         versionid: this.assessment.versionid,
      };

      this.showFullLoadingIndicator = true;

      const postUrl = `${AssessmentsModuleConfigData.Config.app_service.base_uri}/PostObject?synapsenamespace=core&synapseentityname=assessment`;

      const deleteUrl = `${AssessmentsModuleConfigData.Config.app_service.base_uri}/DeleteObject?synapsenamespace=core&synapseentityname=assessment&id=${this.assessment.assessment_id}`;

      this.apiService.post(postUrl, assessmentToSave)
         .pipe(takeUntil(this.destroy$))
         .subscribe(() => {
            this.apiService.delete(deleteUrl)
               .pipe(takeUntil(this.destroy$))
               .subscribe((newAssessment) => {
                  //Success
                  this.showFullLoadingIndicator = false;
                  this.preparePostSaveActionBasedOnStatus('success');
               },
                  (error) => {
                     //error here
                     this.showFullLoadingIndicator = false;
                     this.preparePostSaveActionBasedOnStatus('error');
                  });
         }, (error) => {
            //error here
            this.showFullLoadingIndicator = false;
            this.preparePostSaveActionBasedOnStatus('error');
         });
   }

   preparePostSaveActionBasedOnStatus(status: string) {

      this.saveStatusMessagePopup.headerMessage = 'Save Status';
      this.saveStatusMessagePopup.showCloseButton = false;
      this.showSaveStatusMessagePopup = true;

      if (status === 'success') {
         this.buildSaveSuccessMessage();

         this.messageTimeOut = setTimeout(() => {

            this.loggerService.log('On Click of Success');

            this.showSaveStatusMessagePopup = false;

            if (this.close) {
               this.close.emit(false); //Just close the  form
            }
            this.reasonForDelete = '';

         }, 2000);

      } else if (status === 'error') {
         this.buildSaveErrorMessage();

         this.messageTimeOut = setTimeout(() => {
            this.loggerService.log('On error');
            this.showSaveStatusMessagePopup = false;
         }, 2000);
      }

   }

   buildSaveErrorMessage() {

      this.saveStatusMessagePopup.messageType = 'error';

      this.saveStatusMessagePopup.messageContent = AssessmentsModuleConfigData.Config.messages.generic_save_error;//to config
      this.saveStatusMessagePopup.data = 'error';

      // let actionCloseForm = new GenericMessagePopupAction();

      // actionCloseForm.name = 'Okay';

      // actionCloseForm.styleCss = 'btn-secondary';

      // actionCloseForm.onAction = () => {

      //    this.loggerService.log('On Click of CloseForm');

      //    this.showSaveStatusMessagePopup = false;
      // };

      // this.saveStatusMessagePopup.actions = [actionCloseForm];
   }


   buildSaveSuccessMessage() {

      this.saveStatusMessagePopup.messageType = 'success';
      this.saveStatusMessagePopup.messageContent = AssessmentsModuleConfigData.Config.messages.generic_save_success;//to config
      this.saveStatusMessagePopup.data = 'success';

      // let actionTasksForm = new GenericMessagePopupAction();

      // actionTasksForm.name = 'Okay';
      // actionTasksForm.styleCss = 'btn-primary';

      // actionTasksForm.onAction = () => {

      //    this.loggerService.log('On Click of Success');

      //    this.showSaveStatusMessagePopup = false;

      //    if (this.close) {
      //       this.close.emit(false); //Just close the  form
      //    }
      // };

      // this.saveStatusMessagePopup.actions = [actionTasksForm];
   }

   prepareSaveConfirmation() {

      this.confirmationMessagePopup.headerMessage = 'Confirmation';
      this.confirmationMessagePopup.messageContent = AssessmentsModuleConfigData.Config.messages.delete_assessment_confirmation;
      this.confirmationMessagePopup.showCloseButton = false;

      this.confirmationMessagePopup.actions = [];


      let actionYes = new GenericMessagePopupAction();

      actionYes.name = 'Yes';
      actionYes.styleCss = 'btn-primary';

      actionYes.onAction = () => {
         this.loggerService.log('On Click of Yes');
         this.showDeleteConfirmationMessagePopup = false;
         this.saveAssessment();
      };

      let actionNo = new GenericMessagePopupAction();
      actionNo.name = 'No';
      actionNo.styleCss = 'btn-secondary';
      actionNo.onAction = () => {
         this.loggerService.log('On Click of No');
         this.showDeleteConfirmationMessagePopup = false;
      };

      this.confirmationMessagePopup.actions = [actionYes, actionNo];
   }
}