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

import { Directive, ElementRef, Input, OnChanges, SimpleChanges, OnInit, EventEmitter, Output } from '@angular/core';
import { LoggerService } from '../services/logger.service';
import { Assessment } from 'src/app/shared/models/assessment';

@Directive({
    selector: '[appAssessmentLoaderComponent]',
})
export class ModuleLoaderDirective {

    contextChangedEventInvoker: any;

    @Output() sepsisModuleUnLoad?: EventEmitter<any> = new EventEmitter<any>();

    constructor(private elRef: ElementRef, private loggerSvc: LoggerService) {
    }

    @Input('appAssessmentLoaderComponent')
    set moduleDataSubject(moduleData: ComponentModuleData) {

        this.loggerSvc.log('Received Module Data');
        this.loggerSvc.log(moduleData);


        if (moduleData) {
            this.elRef.nativeElement.innerHtml = '';
            this.loadComponent(moduleData);
        }
    }


    private loadComponent(moduleData: ComponentModuleData) {

        this.loggerSvc.log(this.elRef);

        const scriptEle: HTMLScriptElement = document.getElementById(`assessment:WCScript_${moduleData.elementTag}`) as HTMLScriptElement;

        if (!scriptEle) {

            this.loggerSvc.log('Creating Script element');

            this.createScriptElement(moduleData,
                (e) => this.createCustomElement(moduleData)
            );
        } else {

            this.loggerSvc.log('Script element alredy exists. Creating element.');
            this.createCustomElement(moduleData);
        }
    }

    private createScriptElement = (moduleData: ComponentModuleData, onloadComplete: any) => {

        console.log('Script loading...' + moduleData.url);

        const scriptEle = document.createElement('script');

        scriptEle.id = `assessment:WCScript_${moduleData.elementTag}`;

        scriptEle.src = moduleData.url;

        scriptEle.async = true;

        scriptEle.onload = (e) => {

            this.loggerSvc.log('Script load complete');

            if (onloadComplete) {
                onloadComplete(e);
            }
        };
        scriptEle.onerror = (e) => {
            this.loggerSvc.log('Script load error');
        };
        document.body.appendChild(scriptEle);
    }

    private createCustomElement(moduleData: ComponentModuleData) {

        this.loggerSvc.log('inside createCustomElement');

        const customEle: HTMLElement = document.createElement(moduleData.elementTag);

        customEle['assessmentContext'] = moduleData.assessmentModuleContext;

        //customEle['componentCallback'] = this.componentCallbackHandler;

        let el = this.elRef; //Local reference - closure wont work

        customEle['unload'] = (data: any) => {
            if (data && data.name === 'sepsis') {
                this.sepisComponentUnloadHandler(data, el);
            }
        }

        this.elRef.nativeElement.appendChild(customEle);

        //this.contextChangedEventInvoker = customEle['assessmentContextChanged'];

        this.loggerSvc.log('this.contextChangedEventInvoker=' + customEle);
        this.loggerSvc.log(customEle);

        this.loggerSvc.log(customEle['currentPatientId']);

        // if (this.contextChangedEventInvoker) { // Invokes web component function and assign new value
        //     this.contextChangedEventInvoker(' ');
        // }
    }

    private sepisComponentUnloadHandler(data: any, el: ElementRef<any>) {
        this.elRef.nativeElement.innerHtml = '';
        this.loggerSvc.log('Unloaded Sepsis Component');
        this.loggerSvc.log(data);
        if (this.sepsisModuleUnLoad) this.sepsisModuleUnLoad.emit();
    }

    // private componentCallbackHandler(valFromComponent: any) {
    //     this.loggerSvc.log(valFromComponent);
    // }
}

export class ComponentModuleData {
    url: string;
    elementTag: string;
    assessmentModuleContext: IAssessmentContext;//{ assessment?: Assessment, apiServiceFromFW: any, action: 'new' | 'edit' | 'view' | 'amend' | 'viewhistory' | 'showtasks' };
}

// This should go as a package
export class IAssessmentContext {
    assessment?: {
        assessment_id?: string,
        assessmenttype_id?: string,
        encounter_id?: string,
        formtype_id?: string,
        observationevent_id?: string,
        person_id?: string,
        versionid?: number,
        sourceofinvocation?: string,
    };
    apiServiceFromFW: any;
    action: 'new' | 'edit' | 'view' | 'amend' | 'viewhistory' | 'showtasks';
}
