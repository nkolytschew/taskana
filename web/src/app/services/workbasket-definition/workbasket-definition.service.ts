import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {saveAs} from 'file-saver/FileSaver';
import {AlertService} from '../alert/alert.service';
import {WorkbasketDefinition} from '../../models/workbasket-definition';
import {AlertModel, AlertType} from '../../models/alert';
import {TaskanaDate} from '../../shared/util/taskana.date';
import {ErrorModel} from '../../models/modal-error';
import {ErrorModalService} from '../errorModal/error-modal.service';


@Injectable()
export class WorkbasketDefinitionService {
  url: string = environment.taskanaRestUrl + '/v1/workbasketdefinitions';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic VEVBTUxFQURfMTpURUFNTEVBRF8x'
    })
  };


  constructor(private httpClient: HttpClient, private alertService: AlertService,
              private errorModalService: ErrorModalService) {
              }

  // GET
  exportWorkbaskets(domain: string) {
    domain = (domain === '' ? '' : '?domain=' + domain);
    this.httpClient.get<WorkbasketDefinition[]>(this.url + domain, this.httpOptions).subscribe(
      response => {
        saveAs(new Blob([JSON.stringify(response)], {type: 'text/plain;charset=utf-8'}),
          'Workbaskets_' + TaskanaDate.getDate() + '.json');
      }
    );
  }

  // POST
  importWorkbasketDefinitions(workbasketDefinitions: any) {
    this.httpClient.post(environment.taskanaRestUrl + '/v1/workbasketdefinitions/import',
      JSON.parse(workbasketDefinitions), this.httpOptions).subscribe(
      workbasketsUpdated => this.alertService.triggerAlert(new AlertModel(AlertType.SUCCESS, 'Import was successful')),
      error => this.errorModalService.triggerError(new ErrorModel(
        `There was an error importing workbaskets`, error.message))
    );
  }
}
