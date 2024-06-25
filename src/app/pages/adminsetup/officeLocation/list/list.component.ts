import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink/dist/subsink';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OfficeLocationAddEditComponent } from '../add-edit/add-edit.component';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/core/base/component/base/base.component';
import { BaseService } from 'src/app/core/base/base.service';
import { OfficeLocationService } from 'src/app/core/services/MasterSetup/officeLocation.service';
import { OfficeLocationViewModel } from 'src/app/core/models/officeLocation.model';

@Component({
  selector: 'app-list-officeLocation',
  templateUrl: './list.component.html'
})

export class OfficeLocationListComponent extends BaseComponent implements OnInit, OnDestroy {

  subSink = new SubSink();
  listData: OfficeLocationViewModel[];

  constructor(toaster: ToastrService,
    baseService: BaseService,
    private modalService: NgbModal,
    private service: OfficeLocationService) { 
      super(toaster,baseService);
    }

  ngOnInit() {
    this.initDataTable();
  }

  private initDataTable() {
    this._fetchData();
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
  }

  private _fetchData() {
    this.subSink.sink = this.service.getAll().subscribe(res => {
      this.listData = res;
    }, err => {
      console.log("error");
    });
  }


  public openModalItem(item: OfficeLocationViewModel) {
    const modalRef = this.modalService.open(OfficeLocationAddEditComponent, { size: 'md', backdrop: 'static', keyboard: false });
    let isEditable = item != null ? true : false;
    modalRef.componentInstance.aModel = item;
    modalRef.componentInstance.isEdit = isEditable;
    modalRef.result.then((result) => {
      if (result) {
        this.initDataTable();
      }

    }, (reason) => {
      console.log('Dismissed action: ' + reason);
    });
  }
}
