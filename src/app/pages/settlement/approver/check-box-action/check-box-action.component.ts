import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApplicationStatus } from 'src/app/core/enums/constants';
import { PortalUserViewModel } from 'src/app/core/models/auth.models';
import { SettlementViewModel } from 'src/app/core/models/settlement-model/settlement.model';
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
  settlementModelList: SettlementViewModel[] = [];
  settlementViewmodel: SettlementViewModel;
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
    this.canSendToInternalControl = this.portalUserViewModel.Is_Finance_Complete && !params.data.IsInternalControlNeed && params.data.Status != ApplicationStatus.Completed;
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }
  onCheck(id: string,isChecked: boolean){

    this.settlementViewmodel = new SettlementViewModel();
    this.settlementViewmodel.Id = Number(id);
    this.settlementViewmodel.IsCheckedForBulkProcessing = isChecked;
    this.isfound = false;
    this.settlementModelList = JSON.parse(localStorage.getItem('bulkProcessedsettlementList'));
    if(this.settlementModelList != null && this.settlementModelList !=undefined && this.settlementModelList.length > 0)
    {
      this.settlementModelList.forEach(x => {
        if(x.Id == Number(id))
        {
          x.IsCheckedForBulkProcessing = isChecked;
          this.isfound = true;
        }
      });
    }
    else{
      this.settlementModelList = [];
    }
    if(!this.isfound)
    {
      this.settlementModelList.push(this.settlementViewmodel);
    }
    localStorage.setItem('bulkProcessedSettlementList', JSON.stringify(this.settlementModelList));
  }
}
