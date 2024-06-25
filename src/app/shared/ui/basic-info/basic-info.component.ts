import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html'
})
export class BasicInfoComponent implements OnInit {

  requestNo:string;
  userHrId:string;
  userDesignation:string;
  userDepartment:string;
  userName:string;

  constructor() { }

  agInit(params)
  {
    this.requestNo = params.data.RequestNo;
    this.userName = params.data.UserName;
    this.userHrId = params.data.UserHrId;
    this.userDesignation = params.data.UserDesignation;
    this.userDepartment = params.data.UserDepartment;
  }
  ngOnInit(): void {
  }

}