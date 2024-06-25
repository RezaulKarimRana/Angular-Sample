import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationStatus } from 'src/app/core/enums/constants';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/core/base/component/base/base.component';
import { BaseService } from 'src/app/core/base/base.service';
import Swal from 'sweetalert2';
import { DataService } from 'src/app/core/services/EventEmitter/data.service';
import { PortalUserViewModel } from 'src/app/core/models/auth.models';
import { TASettlementService } from 'src/app/core/services/TravelAuthorization/travelAuthSettlement.service';
import { TASettlementHoldViewModel } from 'src/app/core/models/travel-authorisation-model/travelAuthorisationSettlement.model';

@Component({
  selector: 'app-action-details',
  templateUrl: './action-details.component.html',
  styleUrls: ['./action-details.component.scss']
})
  export class ActionDetailsComponent extends BaseComponent implements OnInit, OnDestroy {

  id: string;
  requestNo:string;
  isHold: boolean;
  isDeclined: boolean;
  canEdit: boolean;
  publicId: string;
  hasNoAction: boolean;
  isPending: boolean;
  isCompleted:boolean;
  isApproverApproved:boolean;
  is_Approver_Pending: boolean;
  is_Supervisor_Pending: boolean;
  loading:boolean= false;
  portalUserViewModel: PortalUserViewModel;
  is_FinanceCheck: boolean;
  is_FinanceComplete:boolean;
  can_View:boolean;
  can_View_Hold:boolean;
  constructor(private router: Router,
    baseService: BaseService,
    private dataService: DataService,
    private travelAuthService: TASettlementService,
    toaster: ToastrService) {
      super(toaster,baseService);
  }

  agInit(params)
  {
    this.portalUserViewModel = JSON.parse(localStorage.getItem('currentLoginUser'));

    this.is_FinanceCheck =  this.portalUserViewModel.Is_Finance_Check;
    this.is_FinanceComplete =  this.portalUserViewModel.Is_Finance_Complete;

    this.can_View= this.is_FinanceCheck || this.is_FinanceComplete ? true : false; 

    this.id = params.data.Id;
    this.publicId = params.data.PublicId;
    this.requestNo = params.data.RequestNo;
    this.isDeclined = params.data.StatusId == ApplicationStatus.Return;
    this.canEdit = (params.data.StatusId == ApplicationStatus.Return && params.data.UserId == this.portalUserViewModel.Id) ||
                   (params.data.Is_Supervisor_Pending && this.portalUserViewModel.Id == params.data.SupervisorId) ||
                   (params.data.StatusId == ApplicationStatus.Pending && this.portalUserViewModel.Id == 4125);
    this.isHold = params.data.StatusId == ApplicationStatus.Hold;
    this.isPending = params.data.StatusId == ApplicationStatus.Pending;
    this.isCompleted = params.data.StatusId == ApplicationStatus.Completed;
    this.hasNoAction = params.data.StatusId == ApplicationStatus['Internal Control Pending'];
    this.is_Approver_Pending = params.data.Is_Approver_Pending;
    this.is_Supervisor_Pending = params.data.Is_Supervisor_Pending;

    this.can_View_Hold = params.data.ApproverStatusId == ApplicationStatus.Pending ? true : false;
    this.isApproverApproved =params.data.ApproverStatusId == ApplicationStatus.Completed ? true : false;
  }

  ngOnInit(): void {
  }
  onDetails() {
    this.router.navigateByUrl(`taSettlement/detail`, {
      state: {
        id: this.publicId,
      }
    });
  }
  onEdit() {
    this.router.navigateByUrl(`taSettlement/edit`, {
      state: {
        id: this.publicId,
      }
    });
  }
  onCheck() {
    this.router.navigateByUrl(`taSettlement/check`, {
      state: {
        id: this.publicId,
      }
    });
  }

  onExcelDownload(){
    this.downloadExcelFile(this.id, this.requestNo, "TA_Settlement");
 }

  onHold(){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to hold this TA Settlement item!',
      icon: 'warning',
      input: 'textarea',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, complete it!',
    }).then((result) => {
      if (result.value) {
          let data = new TASettlementHoldViewModel();
            data.Id = this.id;
            data.Remarks = result.value;
            data.IsHold = true;

          this.loading = true; 
          this.subSink.sink = this.travelAuthService.updateHoldItem(data).subscribe((x) => {
            if (x.Success) {
              this.loading = false; 
              Swal.fire('Sent!', 'This travel auth item has been hold', 'success');
              this.dataService.emitTravelAuthorizationChanged(true);
            } else {
              Swal.fire('Some Thing error!', 'Please contact with IT Team.', 'error');
              this.loading = false;
            }
          });
      }
    });
  }

  onUnHold(){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to unhold this TA Settlement item!',
      icon: 'warning',
      input: 'textarea',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, complete it!',
    }).then((result) => {
      if (result.value) {
          let data = new TASettlementHoldViewModel();
            data.Id = this.id;
            data.Remarks = result.value;
            data.IsHold = false;

          this.loading = true; 
          this.subSink.sink = this.travelAuthService.updateHoldItem(data).subscribe((x) => {
            if (x.Success) {
              this.loading = false; 
              Swal.fire('Sent!', 'This travel auth item has been unhold', 'success');
              this.dataService.emitTravelAuthorizationChanged(true);
            } else {
              Swal.fire('Some Thing error!', 'Please contact with IT Team.', 'error');
              this.loading = false;
            }
          });
      }
    });
  }
  onDownloadPDF() {
    this.downloadPDFFile(this.id, this.requestNo, "TA_Settlement");
  }
  
}
