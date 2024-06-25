import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationStatus } from 'src/app/core/enums/constants';
import { AdvanceRunningApproverMatrixSupervisorViewModel } from 'src/app/core/models/advance-model/advanceRunningApproverMatrix.model';
import { PortalUserViewModel } from 'src/app/core/models/auth.models';
import { DataService } from 'src/app/core/services/EventEmitter/data.service';
import { SubSink } from 'subsink/dist/subsink';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/core/base/component/base/base.component';
import { BaseService } from 'src/app/core/base/base.service';
@Component({
  selector: 'app-approver-action',
  templateUrl: './approver-action.component.html',
  styleUrls: ['./approver-action.component.scss']
})
export class ApproverActionComponent extends BaseComponent implements OnInit, OnDestroy  {

  subSink: SubSink;
  id: string;
  requestNo:string;
  is_Approver_Pending: boolean;
  is_Supervisor_Pending: boolean;
  is_Completed:boolean;
  is_Pending:boolean;
  hasNoAction: boolean;
  publicId: string;
  advanceRunningApproverMatrixModel: AdvanceRunningApproverMatrixSupervisorViewModel;
  portalUserViewModel: PortalUserViewModel;
  filenName : string;

  constructor(private router: Router,
    private dataService: DataService,
    baseService: BaseService,
    toaster: ToastrService) {
      super(toaster,baseService);
      this.subSink = new SubSink();
      this.portalUserViewModel = JSON.parse(localStorage.getItem('currentLoginUser'));
    }

  agInit(params) {
    this.id = params.data.Id;
    this.publicId = params.data.PublicId;
    this.requestNo = params.data.RequestNo;
    this.filenName = params.data.RequestNo;
    this.hasNoAction = params.data.Status == ApplicationStatus['Internal Control Pending'];
    this.is_Pending = params.data.Status == ApplicationStatus.Pending ? true:false;
    this.is_Completed = params.data.Status == ApplicationStatus.Completed ? true:false;
    this.is_Approver_Pending = params.data.Is_Approver_Pending && this.is_Pending;
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }

  onDetails() {
    this.router.navigateByUrl(`advances/detail`, {
      state: {
        id: this.publicId,
      }
    });
  }

  onEdit() {
    if(this.is_Approver_Pending){
      this.router.navigateByUrl(`advances/approver-entry`, {
        state: {
          id: this.publicId,
        }
      });
    }
    else if(this.is_Supervisor_Pending){
      this.router.navigateByUrl(`advances/supervisor-entry`, {
        state: {
          id: this.publicId,
        }
      });
    }
  }
  onDownloadPDF() {
    this.downloadPDFFile(this.id, this.filenName, "Advance");
  }
  onExcelDownload(){
    this.downloadExcelFile(this.id, this.filenName, "Advance");
  }
}
