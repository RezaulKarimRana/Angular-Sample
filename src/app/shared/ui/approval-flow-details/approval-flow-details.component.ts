import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApproverList } from 'src/app/core/models/group-model/approver.model';
import { ApproverSubGroupUsersViewModel } from 'src/app/core/models/group-model/approver.subGroupUser.model';
import { ApproverSubGroupUserService } from 'src/app/core/services/ApproverGroup/approverSubGroupUser.service';
import { GroupUserListComponent } from 'src/app/pages/adminsetup/groupUser/group-user-list/group-user-list.component';
import { SubSink } from 'subsink/dist/subsink';

@Component({
  selector: 'app-approval-flow-details',
  templateUrl: './approval-flow-details.component.html',
  styleUrls: ['./approval-flow-details.component.scss']
})
export class ApprovalFlowDetailsComponent implements OnDestroy,OnInit {

  subSink = new SubSink();
  @Input()
	canView: boolean;
  @Input()
	approverList: ApproverList[];
  @Input()
	approvedCount: number;
  @Input()
	pendingCount: number;
  @Input()
	dueCount: number;

  approverSubGroupUsersViewModel: ApproverSubGroupUsersViewModel[] =[];
  
  constructor(
    private approverSubGroupUserService: ApproverSubGroupUserService,
    private toaster: ToastrService,
    private modalService: NgbModal,
    private router: Router,
  ) {
    this.subSink = new SubSink();
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }
  showGroupApprover(subGroupId: number) {
    this.subSink.sink = this.approverSubGroupUserService.getApproverGroupInfo(subGroupId).subscribe(
      (res) => {
        this.approverSubGroupUsersViewModel = res;
        this.openModalItem(this.approverSubGroupUsersViewModel);
      },
      (err) => {
        this.toaster.error(err, "Error");
        this.router.navigate(['/dashboard/dashboard']);
      }
    );
    
  }

  public openModalItem(item: ApproverSubGroupUsersViewModel[]) {
    const modalRef = this.modalService.open(GroupUserListComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.aModelList = item;
    modalRef.result.then((result) => {
      if (result) {
      }
    }, (reason) => {
      console.log('Dismissed action: ' + reason);
    });
  }
}
