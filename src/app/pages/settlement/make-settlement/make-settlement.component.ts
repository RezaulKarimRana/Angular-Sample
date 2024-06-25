import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationStatus } from 'src/app/core/enums/constants';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/core/base/component/base/base.component';
import { BaseService } from 'src/app/core/base/base.service';
import { SubSink } from 'subsink/dist/subsink';

@Component({
  selector: 'app-make-settlement',
  templateUrl: './make-settlement.component.html',
  styleUrls: ['./make-settlement.component.scss']
})
export class MakeSettlementComponent extends BaseComponent implements OnInit, OnDestroy  {

  subSink: SubSink;
  id: string;
  requestNo:string;
  canEdit: boolean;
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
    this.router.navigateByUrl(`advanceSettlement/create`, {
      state: {
        id: this.publicId,
      }
    });
  }

  onExcelDownload(){
    this.downloadExcelFile(this.id, this.requestNo, "Advance");
  }
}