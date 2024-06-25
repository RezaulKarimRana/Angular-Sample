import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink/dist/subsink';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/core/base/component/base/base.component';
import { BaseService } from 'src/app/core/base/base.service';
import { RolesService } from 'src/app/core/services/MasterSetup/roles.service';
import { UserRolesAddEditComponent } from '../add-edit/add-edit.component';
import { UserRolesModel } from 'src/app/core/models/mastersetup-model/user-roles.model';
import { UserRolesService } from 'src/app/core/services/MasterSetup/user-roles.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class UserRolesListComponent extends BaseComponent implements OnInit, OnDestroy {

  subSink = new SubSink();
  breadCrumbItems: Array<{}>;
  listData: UserRolesModel[];

  labelListTitle: string = "";

  constructor(toaster: ToastrService,
    baseService: BaseService,
    private modalService: NgbModal,
    private service: UserRolesService) { 
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

  public openModalItem(item: UserRolesModel) {
    const modalRef = this.modalService.open(UserRolesAddEditComponent, { size: 'md', backdrop: 'static', keyboard: false });
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

