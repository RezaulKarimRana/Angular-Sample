import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SubSink } from 'subsink/dist/subsink';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEditApproverGroupComponent } from '../add-edit-approver-group/add-edit-approver-group.component';
import { ApproverGroupService } from 'src/app/core/services/ApproverGroup/approverGroup.service';
import { ApproverGroupModel } from 'src/app/core/models/group-model/approverGroup.model';

@Component({
  selector: 'app-approver-group-list',
  templateUrl: './approver-group-list.component.html',
  styleUrls: ['./approver-group-list.component.scss']
})

export class ApproverGroupListComponent implements OnInit, OnDestroy {

  subSink = new SubSink();
  listData: ApproverGroupModel[];

  labelListTitle: string = "";

  constructor(private router: Router,
    private modalService: NgbModal,
    private approverGroupService: ApproverGroupService) { }

  ngOnInit() {
    this.initDataTable();
  }

  private initDataTable() {
    this._fetchData();
    this.labelListTitle = "Approver Group List";
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
  }

  private _fetchData() {
    this.subSink.sink = this.approverGroupService.getAll().subscribe(res => {
      this.listData = res;
    }, err => {
      console.log("error");
    });
  }

  public openModalItem(item: ApproverGroupModel) {
    const modalRef = this.modalService.open(AddEditApproverGroupComponent, { size: 'md', backdrop: 'static', keyboard: false });
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
