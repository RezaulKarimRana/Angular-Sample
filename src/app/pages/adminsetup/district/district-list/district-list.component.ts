import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SubSink } from 'subsink/dist/subsink';
import { CodeNamePair } from '../../../../core/models/mastersetup-model/codenamepair.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEditDistrictComponent } from '../add-edit-district/add-edit-district.component';
import { ToastrService } from 'ngx-toastr';
import { DistrictViewModel } from '../../../../core/models/mastersetup-model/district.model';
import { DistrictService } from '../../../../core/services/MasterSetup/district.service';

@Component({
  selector: 'app-district-list',
  templateUrl: './district-list.component.html',
  styleUrls: ['./district-list.component.scss']
})

export class DistrictListComponent implements OnInit, OnDestroy {

  subSink = new SubSink();
  breadCrumbItems: Array<{}>;
  listData: DistrictViewModel[];
  labelListTitle: string = "";
  sortDir:number = 1;

  constructor(
    private toaster: ToastrService,
    private router: Router,
    private modalService: NgbModal,
    private districtService: DistrictService) { }

  ngOnInit() {
    this.initDataTable();
  }

  private initDataTable() {
    this._fetchData();
    this.labelListTitle = "District List";
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
  }

  private _fetchData() {
    this.subSink.sink = this.districtService.getAll().subscribe(res => {
      this.listData = res;
    }, err => {
      console.log("error");
    });
  }

  public openModalItem(item: CodeNamePair) {
    const modalRef = this.modalService.open(AddEditDistrictComponent, { size: 'md', backdrop: 'static', keyboard: false });
    let isEditable = item != null ? true : false;
    modalRef.componentInstance.aModel = item;
    modalRef.componentInstance.isEdit = isEditable;
    modalRef.result.then((result) => {
      if (result) {
        this.initDataTable();
      }

    }, (reason) => {
    });
  }

  onSortClick(event, colName) {
    let target = event.currentTarget,
      classList = target.classList;
    if (classList.contains('fa-chevron-up')) {
      classList.remove('fa-chevron-up');
      classList.add('fa-chevron-down');
      this.sortDir=-1;
    } else {
      classList.add('fa-chevron-up');
      classList.remove('fa-chevron-down');
      this.sortDir=1;
    }
    this.sortArr(colName);
  }

  sortArr(colName){
    this.listData.sort((a,b)=>{
      return a[colName].toLowerCase().localeCompare(b[colName].toLowerCase()) * this.sortDir;
    });
  }

}
