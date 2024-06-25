import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SubSink } from 'subsink/dist/subsink';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-group-user-list',
  templateUrl: './group-user-list.component.html',
  styleUrls: ['./group-user-list.component.scss']
})

export class GroupUserListComponent implements OnInit, OnDestroy {
  @Input() public aModelList;
  labelListTitle: string ="User Name";
  model :any =[];
  breadCrumbItems: Array<{}>;
  subSink: SubSink;


  constructor(private router: Router,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private toaster: ToastrService,) {
    this.subSink = new SubSink();
  }

  ngOnInit() {
    this.model = this.aModelList;
  }

  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }

}