import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationStatus } from 'src/app/core/enums/constants';
import { AdvanceRunningApproverMatrixSupervisorViewModel } from 'src/app/core/models/advance-model/advanceRunningApproverMatrix.model';
import { PortalUserViewModel } from 'src/app/core/models/auth.models';
import { DataService } from 'src/app/core/services/EventEmitter/data.service';
import { SubSink } from 'subsink/dist/subsink';
@Component({
  selector: 'app-releiver-approver-action',
  templateUrl: './releiver-approver-action.component.html',
  styleUrls: ['./releiver-approver-action.component.scss']
})
export class ReleiverApproverActionComponent implements OnInit, OnDestroy {

  subSink: SubSink;
  id: string;
  is_Approver_Pending: boolean;
  is_Supervisor_Pending: boolean;
  hasNoAction: boolean;
  publicId: string;
  advanceRunningApproverMatrixModel: AdvanceRunningApproverMatrixSupervisorViewModel;
  portalUserViewModel: PortalUserViewModel;
  
  constructor(private router: Router,
    private dataService: DataService) {
      this.subSink = new SubSink();
      this.portalUserViewModel = JSON.parse(localStorage.getItem('currentLoginUser'));
    }

  agInit(params) {
    this.id = params.data.Id;
    this.publicId = params.data.PublicId;
    this.hasNoAction = params.data.Status == ApplicationStatus['Internal Control Pending'];
    this.is_Approver_Pending = params.data.Is_Approver_Pending;
    this.is_Supervisor_Pending = params.data.Is_Supervisor_Pending;
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }

  onDetails() {
    this.router.navigateByUrl(`advances/detail`, {
      state: {
        id: this.publicId,
      }
    });
  }

  onEdit() {
    if(this.is_Approver_Pending){
      this.router.navigateByUrl(`advances/approver-entry`, {
        state: {
          id: this.publicId,
        }
      });
    }
    else if(this.is_Supervisor_Pending){
      this.router.navigateByUrl(`advances/supervisor-entry`, {
        state: {
          id: this.publicId,
        }
      });
    }
  }
}
