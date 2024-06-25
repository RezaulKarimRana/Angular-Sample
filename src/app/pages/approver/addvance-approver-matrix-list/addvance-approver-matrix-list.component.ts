import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink/dist/subsink';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdvanceApproverMatrixService } from 'src/app/core/services/Advance/advanceApproverMatrix.service';
import { AddEditAdvanceApproverMatrixComponent } from '../add-edit-advance-approver-matrix/add-edit-advance-approver-matrix.component';
import { BaseComponent } from 'src/app/core/base/component/base/base.component';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from 'src/app/core/base/base.service';
import { ApprovalWorkFlowMatrixModel } from 'src/app/core/models/advance-model/approvalWorkFlowMatrix.model';

@Component({
  selector: 'app-addvance-approver-matrix-list',
  templateUrl: './addvance-approver-matrix-list.component.html',
  styleUrls: ['./addvance-approver-matrix-list.component.scss']
})

export class AddvanceApproverMatrixListComponent extends BaseComponent  implements OnInit, OnDestroy {

  subSink = new SubSink();
  listData: ApprovalWorkFlowMatrixModel[];

  labelListTitle: string = "";

  constructor(
    toaster: ToastrService,
    baseService: BaseService,
    private modalService: NgbModal,
    private advanceApproverMatrixService: AdvanceApproverMatrixService) { 
      super(toaster,baseService);
    }

  ngOnInit() {
    this.initDataTable();
  }

  private initDataTable() {
    this._fetchData();
    this.labelListTitle = "Approver Matrix List";
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
  }

  private _fetchData() {
    this.subSink.sink = this.advanceApproverMatrixService.getAllWorkFlowMatrix().subscribe(res => {
      this.listData = res;
    }, err => {
      console.log("error");
    });
  }

  public openModalItem(item: ApprovalWorkFlowMatrixModel) {
    const modalRef = this.modalService.open(AddEditAdvanceApproverMatrixComponent, { size: 'xl', backdrop: 'static', keyboard: false });
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