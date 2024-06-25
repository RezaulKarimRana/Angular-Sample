import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationStatus } from 'src/app/core/enums/constants';
import { TAHoldViewModel } from 'src/app/core/models/travel-authorisation-model/travelAuthorisation.model';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/core/base/component/base/base.component';
import { BaseService } from 'src/app/core/base/base.service';
import Swal from 'sweetalert2';
import { DataService } from 'src/app/core/services/EventEmitter/data.service';
import { TravelAuthorizationService } from 'src/app/core/services/TravelAuthorization/travelAuth.service';
import { PortalUserViewModel } from 'src/app/core/models/auth.models';

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
    private travelAuthService: TravelAuthorizationService,
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
    this.canEdit = params.data.StatusId == ApplicationStatus.Return && params.data.UserId == this.portalUserViewModel.Id;
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
    this.router.navigateByUrl(`travelauthorisation/detail`, {
      state: {
        id: this.publicId,
      }
    });
  }
  onEdit() {
    this.router.navigateByUrl(`travelauthorisation/add-edit`, {
      state: {
        id: this.publicId,
      }
    });
  }
  onDownloadPDF() {
    this.downloadPDFFile(this.id, this.requestNo, "TravelAuthorization");
  }
  onExcelDownload(){
    this.downloadExcelFile(this.id, this.requestNo, "TravelAuthorization");
 }

 onDelete(){
  Swal.fire({
    title: 'Are you sure?',
    text: 'You want to delete this travel authorization item!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#34c38f',
    cancelButtonColor: '#f46a6a',
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.value) {
        this.loading = true; 
        this.subSink.sink = this.travelAuthService.deleteTA(Number(this.id)).subscribe((x) => {
          if (x.Success) {
            this.loading = false; 
            Swal.fire('delete!', 'This travel auth item has been deleted', 'success');
            this.dataService.emitTravelAuthorizationChanged(true);
          } else {
            Swal.fire('Some Thing error!', 'Please contact with IT Team.', 'error');
            this.loading = false;
          }
        });
    }
  });
}
  onHold(){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to hold this travel auth item!',
      icon: 'warning',
      input: 'textarea',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, complete it!',
      inputPlaceholder: 'Type your remarks here maximum 150 words...',
      inputAttributes: {
        'maxlength' : '150'
      },
    }).then((result) => {
      if (result.value) {
          let data = new TAHoldViewModel();
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
      text: 'You want to unhold this travel auth item!',
      icon: 'warning',
      input: 'textarea',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, complete it!',
      inputPlaceholder: 'Type your remarks here maximum 150 words...',
      inputAttributes: {
        'maxlength' : '150'
      },
    }).then((result) => {
      if (result.value) {
          let data = new TAHoldViewModel();
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
}
