import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationStatus } from 'src/app/core/enums/constants';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/core/base/component/base/base.component';
import { BaseService } from 'src/app/core/base/base.service';
import { SubSink } from 'subsink/dist/subsink';
import { DataService } from 'src/app/core/services/EventEmitter/data.service';
import { AdvanceRunningApproverMatrixService } from 'src/app/core/services/Advance/advanceRunningApproverMatrix.service';

@Component({
  selector: 'app-approved-bills-details',
  templateUrl: './approved-bills-details.component.html',
})
export class ApprovedBillsDetailsComponent extends BaseComponent implements OnInit, OnDestroy  {

  subSink: SubSink;
  id: string;
  requestNo:string;
  canEdit: boolean;
  publicId: string;
  filenName : string;
  loading: boolean = false;
  constructor(
    private router: Router,
    baseService: BaseService,
    private dataService: DataService,
    private service: AdvanceRunningApproverMatrixService,
    toaster: ToastrService
  ) {
    super(toaster,baseService);
      this.subSink = new SubSink();
   }

  agInit(params)
  {
    this.id = params.data.Id;
    this.publicId = params.data.PublicId;
    this.requestNo = params.data.RequestNo;
    this.filenName = params.data.RequestNo;
    this.canEdit = params.data.Status == ApplicationStatus.Completed;
  }

  ngOnInit(): void {
  }
  onDetails() {
    this.router.navigateByUrl(`advances/detail`, {
      state: {
        id: this.publicId,
      }
    });
  }
  onEdit() {
    this.router.navigateByUrl(`advances/add-edit`, {
      state: {
        id: this.publicId,
      }
    });
  }

  onExcelDownload(){
    this.downloadExcelFile(this.id, this.filenName, "Advance");
  }
  onDownloadPDF() {
    this.downloadPDFFile(this.id, this.filenName, "Advance");
  }
}
