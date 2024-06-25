import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink/dist/subsink';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/core/base/component/base/base.component';
import { BaseService } from 'src/app/core/base/base.service';
import { MenuService } from 'src/app/core/services/MasterSetup/menu.service';
import { MenuModel } from 'src/app/core/models/mastersetup-model/menu.model';
import { MenuAddEditComponent } from '../add-edit/add-edit.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class MenuListComponent extends BaseComponent implements OnInit, OnDestroy {

  subSink = new SubSink();
  breadCrumbItems: Array<{}>;
  listData: MenuModel[];

  labelListTitle: string = "";

  constructor(toaster: ToastrService,
    baseService: BaseService,
    private modalService: NgbModal,
    private service: MenuService) { 
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


  public openModalItem(item: MenuModel) {
    const modalRef = this.modalService.open(MenuAddEditComponent, { size: 'md', backdrop: 'static', keyboard: false });
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
