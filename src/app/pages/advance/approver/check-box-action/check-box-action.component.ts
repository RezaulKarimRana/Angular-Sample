import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApplicationStatus } from 'src/app/core/enums/constants';
import { Advance, AdvanceViewModel } from 'src/app/core/models/advance-model/advance.model';
import { PortalUserViewModel } from 'src/app/core/models/auth.models';
import { SubSink } from 'subsink/dist/subsink';
@Component({
  selector: 'app-check-box-action',
  templateUrl: './check-box-action.component.html',
  styleUrls: ['./check-box-action.component.scss']
})
export class CheckBoxActionComponent implements OnInit, OnDestroy {

  subSink: SubSink;
  id: string;
  isCheckedForBulkProcessing: boolean;
  advanceModelList: AdvanceViewModel[] = [];
  advanceViewmodel: AdvanceViewModel;
  portalUserViewModel: PortalUserViewModel;
  canSendToInternalControl: boolean;
  isfound: boolean;
  constructor() {
      this.subSink = new SubSink();
      this.portalUserViewModel = JSON.parse(localStorage.getItem('currentLoginUser'));
    }

  agInit(params: any) {
    this.id = params.data.Id;
    this.isCheckedForBulkProcessing = params.data.IsCheckedForBulkProcessing;
    this.canSendToInternalControl = (this.portalUserViewModel.Is_Finance_Check || this.portalUserViewModel.Is_Finance_Complete) && !params.data.IsInternalControlNeed && params.data.Status != ApplicationStatus.Completed;
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }
  onCheck(id: string,isChecked: boolean){

    this.advanceViewmodel = new AdvanceViewModel();
    this.advanceViewmodel.Id = Number(id);
    this.advanceViewmodel.IsCheckedForBulkProcessing = isChecked;
    this.isfound = false;
    this.advanceModelList = JSON.parse(localStorage.getItem('bulkProcessedAdvanceList'));
    if(this.advanceModelList != null && this.advanceModelList !=undefined && this.advanceModelList.length > 0)
    {
      this.advanceModelList.forEach(x => {
        if(x.Id == Number(id))
        {
          x.IsCheckedForBulkProcessing = isChecked;
          this.isfound = true;
        }
      });
    }
    else{
      this.advanceModelList = [];
    }
    if(!this.isfound)
    {
      this.advanceModelList.push(this.advanceViewmodel);
    }
    localStorage.setItem('bulkProcessedAdvanceList', JSON.stringify(this.advanceModelList));
  }
}
