import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationStatus } from 'src/app/core/enums/constants';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/core/base/component/base/base.component';
import { BaseService } from 'src/app/core/base/base.service';
import { SubSink } from 'subsink/dist/subsink';

@Component({
  selector: 'app-action-details',
  templateUrl: './action-details.component.html',
  styleUrls: ['./action-details.component.scss']
})
export class ActionDetailsComponent extends BaseComponent implements OnInit, OnDestroy  {

  subSink: SubSink;
  id: string;
  requestNo:string;
  canEdit: boolean = false;
  publicId: string;
  
  constructor(
    private router: Router,
    baseService: BaseService,
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
    this.canEdit = params.data.Status == ApplicationStatus.Return;
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
    this.downloadExcelFile(this.id, this.requestNo, "Advance");
  }
}