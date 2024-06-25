import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SubSink } from 'subsink/dist/subsink';
import { CodeNamePair } from '../../../../core/models/mastersetup-model/codenamepair.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEditBankAccountComponent } from '../add-edit-bankaccount/add-edit-bankaccount.component';
import { ToastrService } from 'ngx-toastr';

import { BankAccountModel } from '../../../../core/models/mastersetup-model/bankaccount.model';

import { BankAccountService } from '../../../../core/services/MasterSetup/bankaccount.service';

@Component({
  selector: 'app-bankaccount-list',
  templateUrl: './bankaccount-list.component.html',
  styleUrls: ['./bankaccount-list.component.scss']
})

export class BankAccountListComponent implements OnInit, OnDestroy {

  subSink = new SubSink();
  breadCrumbItems: Array<{}>;
  listData: BankAccountModel[];

  labelListTitle: string = "";

  constructor(
    private toaster: ToastrService,
    private router: Router,
    private modalService: NgbModal,
    private bankaccountService: BankAccountService) { }

  ngOnInit() {
    this.initDataTable();
  }

  private initDataTable() {
    this._fetchData();
    this.labelListTitle = "Bank-Account List";
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
  }

  private _fetchData() {
    this.subSink.sink = this.bankaccountService.getAllWithUserName().subscribe(res => {
      this.listData = res;
    }, err => {
      console.log("error");
    });
  }

  public openModalItem(item: CodeNamePair) {
    const modalRef = this.modalService.open(AddEditBankAccountComponent, { size: 'md', backdrop: 'static', keyboard: false });
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
