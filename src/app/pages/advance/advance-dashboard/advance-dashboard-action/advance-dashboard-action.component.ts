import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/core/base/component/base/base.component';
import { BaseService } from 'src/app/core/base/base.service';
import { ToastrService } from 'ngx-toastr';
import { ApplicationStatus } from 'src/app/core/enums/constants';
import { AdvanceRunningApproverMatrixSupervisorViewModel } from 'src/app/core/models/advance-model/advanceRunningApproverMatrix.model';
import { PortalUserViewModel } from 'src/app/core/models/auth.models';
import { SubSink } from 'subsink/dist/subsink';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-advance-dashboard-action',
  templateUrl: './advance-dashboard-action.component.html',
  styleUrls: ['./advance-dashboard-action.component.scss']
})
export class AdvanceDashboardAction extends BaseComponent implements OnInit, OnDestroy {

  subSink: SubSink;
  id: string;
  isPending: boolean;
  isInternalControlNeed: boolean;
  isHRCheckNeed: boolean;
  publicId: string;
  advanceRunningApproverMatrixModel: AdvanceRunningApproverMatrixSupervisorViewModel;
  portalUserViewModel: PortalUserViewModel;
  filenName : string = "Advance-";

  constructor(
    toaster: ToastrService,
    baseService: BaseService,
    private router: Router,) {
    super(toaster,baseService);
    this.portalUserViewModel = JSON.parse(localStorage.getItem('currentLoginUser'));
  }

  agInit(params) {
    this.id = params.data.Id;
    this.filenName = this.filenName + params.data.RequestNo;
    this.publicId = params.data.PublicId;
    this.isInternalControlNeed = params.data.IsInternalControlNeed;
    this.isHRCheckNeed = params.data.IsHRCheckNeed;
    this.isPending = params.data.ApproverStatus == ApplicationStatus.Pending ? true : false;
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


  onDownloadPDF() {
    this.downloadPDFFile(this.id, this.filenName, "Advance");
  }
}
