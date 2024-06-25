import { Component, Input, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { ApproverSubGroupUsersViewModel } from "src/app/core/models/group-model/approver.subGroupUser.model";
import { RunningApproverMatrixViewModel } from "src/app/core/models/runningApproverMatrix.model";
import { ApproverSubGroupUserService } from "src/app/core/services/ApproverGroup/approverSubGroupUser.service";
import { GroupUserListComponent } from "src/app/pages/adminsetup/groupUser/group-user-list/group-user-list.component";
import { SubSink } from "subsink/dist/subsink";

@Component({
  selector: "app-internal-control-details",
  templateUrl: "./internal-control-details.component.html",
  styleUrls: ["./internal-control-details.component.scss"],
})
export class InternalControlDetailsComponent implements OnInit {
  @Input()
  internalControlList: any[];
  subSink: SubSink;
  approverSubGroupUserModel: ApproverSubGroupUsersViewModel[] = [];
  constructor(
    private modalService: NgbModal,
    private toaster: ToastrService,
    private approverSubGroupUserService: ApproverSubGroupUserService
  ) {
    this.subSink = new SubSink();
  }

  ngOnInit(): void {}
  showGroupApprover(_advanceDetails: RunningApproverMatrixViewModel) {
    let subGroupId = _advanceDetails.ApproverSubGroupId;
    this.subSink.sink = this.approverSubGroupUserService
      .getApproverGroupInfo(subGroupId)
      .subscribe(
        (res) => {
          this.approverSubGroupUserModel = res;
          this.openModalItem(this.approverSubGroupUserModel);
        },
        (err) => {
          this.toaster.error(err, "Error");
        }
      );
  }
  public openModalItem(item: ApproverSubGroupUsersViewModel[]) {
    const modalRef = this.modalService.open(GroupUserListComponent, {
      size: "lg",
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.aModelList = item;
    modalRef.result.then(
      (result) => {
        if (result) {
        }
      },
      (reason) => {
        console.log("Dismissed action: " + reason);
      }
    );
  }
}
