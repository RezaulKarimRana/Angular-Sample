import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/core/base/component/base/base.component';
import { BaseService } from 'src/app/core/base/base.service';
import { ToastrService } from 'ngx-toastr';
import { SubSink } from 'subsink/dist/subsink';
@Component({
  selector: 'app-dashboard-action',
  templateUrl: './dashboard-action.component.html',
  styleUrls: ['./dashboard-action.component.scss']
})
export class DashboardActionComponent extends BaseComponent implements OnInit, OnDestroy {

  subSink: SubSink;
  id: string;
  publicId: string;
  filenName : string = "Travel Authorization -";

  constructor(
    toaster: ToastrService,
    baseService: BaseService,
    private router: Router,) {
    super(toaster,baseService);
  }

  agInit(params) {
    this.id = params.data.Id;
    this.filenName = this.filenName + params.data.RequestNo;
    this.publicId = params.data.PublicId;
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }

  onDetails() {
    this.router.navigateByUrl(`travelauthorisation/detail`, {
      state: {
        id: this.publicId,
      }
    });
  }


  onDownloadPDF() {
    this.downloadPDFFile(this.id, this.filenName, "TravelAuthorization");
  }
}
