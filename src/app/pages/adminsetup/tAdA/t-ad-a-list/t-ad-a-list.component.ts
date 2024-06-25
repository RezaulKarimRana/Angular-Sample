import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SubSink } from 'subsink/dist/subsink';
import { CodeNamePair } from '../../../../core/models/mastersetup-model/codenamepair.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TAdAModel } from 'src/app/core/models/mastersetup-model/TAdAModel.model';
import { TAdAService } from 'src/app/core/services/MasterSetup/tAdA.service';
import { AddEditTAdAComponent } from '../add-edit-t-ad-a/add-edit-t-ad-a.component';

@Component({
  selector: 'app-t-ad-a-list',
  templateUrl: './t-ad-a-list.component.html',
  styleUrls: ['./t-ad-a-list.component.scss']
})
export class TAdAListComponent implements OnInit, OnDestroy {

  subSink = new SubSink();
  breadCrumbItems: Array<{}>;
  listData: TAdAModel[];

  labelListTitle: string = "";

  constructor(private router: Router,
    private modalService: NgbModal,
    private tAdAService: TAdAService) { }

  ngOnInit() {
    this.initDataTable();
  }

  private initDataTable() {
    this._fetchData();
    this.labelListTitle = "TA-DA List";
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
  }

  private _fetchData() {
    this.subSink.sink = this.tAdAService.getAll().subscribe(res => {
      this.listData = res;
    }, err => {
      console.log("error");
    });
  }

  public openModalItem(item: CodeNamePair) {
    const modalRef = this.modalService.open(AddEditTAdAComponent, { size: 'xl', backdrop: 'static', keyboard: false });
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

}
