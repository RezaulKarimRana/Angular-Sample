import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationStatus } from 'src/app/core/enums/constants';

@Component({
  selector: 'app-action-details',
  templateUrl: './action-details.component.html',
  styleUrls: ['./action-details.component.scss']
})
export class ActionDetailsComponent implements OnInit {

  id: string;
  canEdit: boolean;
  publicId: string;
  constructor(
    private router: Router
  ) { }

  agInit(params)
  {
    this.id = params.data.Id;
    this.publicId = params.data.PublicId;
    this.canEdit = params.data.Status == ApplicationStatus.Return;
  }

  ngOnInit(): void {
  }
  onDetails() {
    this.router.navigateByUrl(`settlement/detail`, {
      state: {
        id: this.publicId,
      }
    });
  }
  onEdit() {
    this.router.navigateByUrl(`settlement/add-edit`, {
      state: {
        id: this.publicId,
      }
    });
  }
}
