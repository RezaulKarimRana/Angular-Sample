import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationStatus } from 'src/app/core/enums/constants';
import { PortalUserViewModel } from 'src/app/core/models/auth.models';

@Component({
  selector: 'app-action-details',
  templateUrl: './action-details.component.html',
  styleUrls: ['./action-details.component.scss']
})
export class ActionDetailsComponent implements OnInit {

  id: string;
  canEdit: boolean;
  publicId: string;
  portalUserViewModel: PortalUserViewModel;
  constructor(
    private router: Router
  ) { }

  agInit(params)
  {
    this.portalUserViewModel = JSON.parse(localStorage.getItem('currentLoginUser'));
    this.id = params.data.Id;
    this.publicId = params.data.PublicId;
    this.canEdit = (params.data.StatusId == ApplicationStatus.Pending && params.data.ReleiverId == this.portalUserViewModel.Id);
  }

  ngOnInit(): void {
  }
  onDetails() {
    this.router.navigateByUrl(`releiver/detail`, {
      state: {
        id: this.publicId,
      }
    });
  }
  onEdit() {
    this.router.navigateByUrl(`releiver/approver-entry`, {
      state: {
        id: this.publicId,
      }
    });
  }
}
