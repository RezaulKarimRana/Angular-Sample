import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink/dist/subsink';
import { TaskTypeDetailsService } from '../../../../core/services/MasterSetup/taskTypeDetails.service';
import { TaskTypeDetailsModel, UrlTypeModel } from '../../../../core/models/mastersetup-model/tasktypedetails.model';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskTypeDetailsAddEditComponent } from '../add-edit/add-edit.component';

@Component({
  selector: 'app-list',
  templateUrl: './tasktypedetailslist.component.html',
  styleUrls: ['./tasktypedetailslist.component.scss']
})

export class TaskTypeDetailsListComponent implements OnInit, OnDestroy {

  subSink = new SubSink();
  breadCrumbItems: Array<{}>;
  listData: TaskTypeDetailsModel[];
  urlTypeModel :UrlTypeModel;

  labelListTitle: string = "";

  constructor(private router: Router,
    private modalService: NgbModal,
    private taskTypeDetailsService: TaskTypeDetailsService) { }

  ngOnInit() {
    this.initDataTable();
  }
  private initDataTable() {
    this._fetchData();
    this.labelListTitle = "Task-Type-Details List";
  }
  ngOnDestroy() {
    this.subSink.unsubscribe();
  }

  private _fetchData() {
    this.subSink.sink = this.taskTypeDetailsService.getAllTaskType().subscribe(res => {
      this.listData = res;
    }, err => {
      console.log("error");
    });
  }

  public openModalItem(item: TaskTypeDetailsModel) {
    const modalRef = this.modalService.open(TaskTypeDetailsAddEditComponent, { size: 'md', backdrop: 'static', keyboard: false });
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
