import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink/dist/subsink';
import { CodeNamePairService } from '../../../../core/services/MasterSetup/codenamepair.service';
import { CodeNamePair, UrlTypeModel } from '../../../../core/models/mastersetup-model/codenamepair.model';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CodeNamePairAddEditComponent } from '../add-edit/add-edit.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/core/base/component/base/base.component';
import { BaseService } from 'src/app/core/base/base.service';

@Component({
  selector: 'app-list',
  templateUrl: './codenamelist.component.html',
  styleUrls: ['./codenamelist.component.scss']
})

export class CodeNamePairListComponent extends BaseComponent implements OnInit, OnDestroy {

  subSink = new SubSink();
  breadCrumbItems: Array<{}>;
  listData: CodeNamePair[];
  urlTypeModel: UrlTypeModel;

  labelListTitle: string = "";

  constructor(toaster: ToastrService,
    baseService: BaseService,
    private router: Router,
    private modalService: NgbModal,
    private codenamepairService: CodeNamePairService) { 
      super(toaster,baseService);
    }

  ngOnInit() {
    this.initDataTable();
  }

  private initDataTable() {
    this.urlTypeModel = this.codenamepairService.findCodeNamePairType(this.router.url);
    this._fetchData();
    this.labelListTitle = this.urlTypeModel.Codenamepair + " List";
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
  }

  private _fetchData() {
    this.subSink.sink = this.codenamepairService.getAll(this.urlTypeModel.ApiUrlType).subscribe(res => {
      this.listData = res;
    }, err => {
      console.log("error");
    });
  }


  public openModalItem(item: CodeNamePair) {
    const modalRef = this.modalService.open(CodeNamePairAddEditComponent, { size: 'md', backdrop: 'static', keyboard: false });
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

  exportcsv(): void {
    this.tableExportCsv("listData");
  }
}
