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
import { Component, OnDestroy, Injector } from "@angular/core";
import { Subject } from 'rxjs';
import { LoggerService } from 'src/app/core/services/logger.service';
import { ContextStateService } from '../services/contextstate.service';
import { AssessmentsConfigService } from 'src/app/config/app.config.service';

@Component({
  selector: 'app-base',
  template: `NO UI TO BE FOUND HERE!`,
})
export class InBaseComponent implements OnDestroy {

  destroy$ = new Subject<void>();
  loggerService: LoggerService;
  contextStateService: ContextStateService;

  constructor(protected injector: Injector) {
    this.loggerService = injector.get(LoggerService);
    this.contextStateService = injector.get(ContextStateService);
  }

  ngOnDestroy(): void {
    this.loggerService.log("destroying objects");
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }

}