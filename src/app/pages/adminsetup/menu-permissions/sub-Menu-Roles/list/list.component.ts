import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink/dist/subsink';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/core/base/component/base/base.component';
import { BaseService } from 'src/app/core/base/base.service';
import { SubMenuRoleModel } from 'src/app/core/models/mastersetup-model/subMenuRoles.model';
import { SubMenuRolesService } from 'src/app/core/services/MasterSetup/subMenuRoles.service';
import { SubMenuRolesAddEditComponent } from '../add-edit/add-edit.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class SubMenuRolesListComponent extends BaseComponent implements OnInit, OnDestroy {

  subSink = new SubSink();
  breadCrumbItems: Array<{}>;
  listData: SubMenuRoleModel[];

  labelListTitle: string = "";

  constructor(toaster: ToastrService,
    baseService: BaseService,
    private modalService: NgbModal,
    private service: SubMenuRolesService) { 
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

  public openModalItem(item: SubMenuRoleModel) {
    const modalRef = this.modalService.open(SubMenuRolesAddEditComponent, { size: 'md', backdrop: 'static', keyboard: false });
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