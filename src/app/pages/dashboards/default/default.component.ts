import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { RequestType } from 'src/app/core/enums/constants';
import { PortalUserViewModel } from 'src/app/core/models/auth.models';
import { DashbardSearchModel, DashBoardViewDataModel, DashBoardViewModel } from 'src/app/core/models/common-model/dashboard.model';
import { DashboardService } from 'src/app/core/services/Dashboard/dashboard.service';
import { DataService } from 'src/app/core/services/EventEmitter/data.service';
import { SubSink } from 'subsink/dist/subsink';
import { ChangeProfilePicComponent } from '../../change-profilepic/change-profilepic.component';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {

  advPending:string;
  advReturn:string;
  advComplete:string;
  advMax:string;
  tClaimsPending:string;
  tClaimsReturn:string;
  tClaimsComplete:string;
  tClaimsMax:string;
  billPending:string;
  billReturn:string;
  billComplete:string;
  billMax:string;
  advPendingValue:number;
  advReturnValue:number;
  advCompleteValue:number;
  advMaxValue:number;
  innerWidth: any;
  subSink: SubSink;
  isVisible: string;
  dashBoardView: DashBoardViewModel;
  dashBoardViewData: DashBoardViewDataModel;
  isActive: string;
  portalUserViewModel: PortalUserViewModel;
  requestType = RequestType;
  IsInternalControlledView : boolean;
  profilePicAsByteArrayAsBase64 : any;

  @ViewChild('content') content;
  constructor(
    private toaster: ToastrService,
    private dashboardService: DashboardService,
    private dataService:DataService,
    private modalService: NgbModal,
    private router: Router) {
      this.subSink = new SubSink();
  }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
     this.portalUserViewModel = JSON.parse(localStorage.getItem('currentLoginUser'));
     const attribute = document.body.getAttribute('data-layout');
     this.IsInternalControlledView = this.portalUserViewModel.Is_Internal_Controlled;
     this.isVisible = attribute;
     const vertical = document.getElementById('layout-vertical');
     if (vertical != null) {
       vertical.setAttribute('checked', 'true');
     }
     if (attribute == 'horizontal') {
       const horizontal = document.getElementById('layout-horizontal');
       if (horizontal != null) {
         horizontal.setAttribute('checked', 'true');
         console.log(horizontal);
       }
     }

     this.portalUserViewModel = JSON.parse(localStorage.getItem('currentLoginUser'));
     
    this._fetchData();

    this.dataService.userProfilePicChanged.subscribe(x => {
      let profilepic = JSON.parse(localStorage.getItem('ProfilePicUrl'));
      this.profilePicAsByteArrayAsBase64 = null;
      this.profilePicAsByteArrayAsBase64 = profilepic != null ? "data:image/png;base64," + profilepic : "assets/images/users/avatar-1.jpg";
      this.portalUserViewModel.ProfilePicUrl =profilepic;
    });
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    console.log(this.innerWidth + 'Resize');
  }
  ngAfterViewInit() {
  }

  onGoToAdvanceList(StatusCode: string){
    this.router.navigate(['/advances/list'], { state: { StatusCode: StatusCode } });
  }
  onGoToOutstationList(StatusCode: string){
    this.router.navigate(['/outstation/list'], { state: { StatusCode: StatusCode } });
  }
  onGoToSettlementList(StatusCode: string){
    this.router.navigate(['/settlement/list'], { state: { StatusCode: StatusCode } });
  }
  
  _fetchData = () => {

    let data = new DashbardSearchModel({
      PageNumber: 1,
      PageSize: 10000,
      IsInternalControlNeeded: this.portalUserViewModel.Is_Internal_Controlled
    });
    this.subSink.sink = this.dashboardService.getDashBoardView(data).subscribe(
      (res) => {
        if (res) {
          this.dashBoardView = res['DashBoardView'];
          this.dashBoardViewData = this.dashBoardView.Data;
          let profilepic = res['ProfilePicUrl'];
          this.profilePicAsByteArrayAsBase64 = null;
          this.profilePicAsByteArrayAsBase64 = profilepic != null ? "data:image/png;base64," + profilepic :"assets/images/users/avatar-1.jpg";
        }
      },
      (err) => {
        this.toaster.error(err, "Error");
      }
    );
  }
  showProfile() {
    const modalRef = this.modalService.open(ChangeProfilePicComponent, { size: 'xl', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.aModel = this.portalUserViewModel;
    modalRef.result.then((result) => {
      if (result) {
      }
    }, (reason) => {
    });
  }
}
