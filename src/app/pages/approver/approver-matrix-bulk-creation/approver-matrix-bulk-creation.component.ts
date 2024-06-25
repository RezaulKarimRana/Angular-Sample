import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink/dist/subsink';
import { ToastrService } from 'ngx-toastr';
import { UserProfileService } from 'src/app/core/services/MasterSetup/user.service';
import { UserModel, UserAllInfoModel } from 'src/app/core/models/mastersetup-model/user.model';
import * as XLSX from 'xlsx';
import { BankAccountModel } from 'src/app/core/models/mastersetup-model/bankaccount.model';
import { ApproverMatrixModel } from 'src/app/core/models/common-model/approvermatrix.model';
import { AdvanceApproverMatrixService } from 'src/app/core/services/Advance/advanceApproverMatrix.service';
import { ApproverMatrixService } from 'src/app/core/services/ApproverMatrix/approverMatrix.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-approver-matrix-bulk-creation',
  templateUrl: './approver-matrix-bulk-creation.component.html',
  styleUrls: ['./approver-matrix-bulk-creation.component.scss']
})

export class ApproverMatrixCreationBulkComponent implements OnInit, OnDestroy {

  subSink: SubSink;
  approverMatrixForm: FormGroup;
  approverMatrixModel: ApproverMatrixModel;
  file: File;
  arrayBuffer: any;
  filelist: any = [];
  approverMatrixBulkModel: ApproverMatrixModel[] = [];
  departmentId: Number = 0;

  loading:boolean= false;
  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService,
    private approverMatrixService: ApproverMatrixService) {
    this.subSink = new SubSink();
  }

  ngOnInit() {
    this.loadInitData();
    this.createForm();
  }

  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }

  createForm() {
    this.approverMatrixForm = this.fb.group({
      ApproverMatrixType: ['', Validators.required],
    });
  }

  addfile(event) {
    this.file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.filelist = arraylist;

      let routerNo = 1001;

      if (this.filelist.length > 0) {
        for (let j = 0; j < this.filelist.length; j++) {
          const _model = new ApproverMatrixModel();
          let row = j+1;
          /**
           * Matrix Model
           */
          if (this.filelist[j]['Name'] == undefined) {
            this.toaster.warning('Please Enter Name Properly At Row Number : ' +row);
            this.approverMatrixBulkModel.length = 0;
            return;
          }
          if (this.filelist[j]['Level'] == undefined) {
            this.toaster.warning('Please Enter Level Properly At Row Number : ' +row);
            this.approverMatrixBulkModel.length = 0;
            return;
          }
          if (this.filelist[j]['WorkFlow'] == undefined) {
            this.toaster.warning('Please Enter WorkFlow Properly At Row Number : ' +row);
            this.approverMatrixBulkModel.length = 0;
            return;
          }
          // if (this.filelist[j]['Email'] == undefined) {
          //   this.toaster.warning('Please Enter Email Properly At Row Number : ' +row);
          //   return;
          // }
          if (this.filelist[j]['Department'] == undefined) {
            this.toaster.warning('Please Enter Department Properly At Row Number : ' +row);
            this.approverMatrixBulkModel.length = 0;
            return;
          }
          if (this.filelist[j]['Approver Group'] == undefined) {
            this.toaster.warning('Please Enter Approver Group Properly At Row Number : ' +row);
            this.approverMatrixBulkModel.length = 0;
            return;
          }
          
          // if(this.filelist[j]['Approver Sub Group'] == undefined){
          //   this.toaster.warning('Please Enter Approver Sub Group Properly At Row Number : ' +row);
          //   return;
          // }

          let approverGroup = this.approverMatrixModel.ApproverGroupList.find(x=>x.Name.toUpperCase() === this.filelist[j]['Approver Group'].toString().trim().toUpperCase());
          _model.ApproverGroupId = approverGroup == undefined ? null : Number(approverGroup.Id);
          if(_model.ApproverGroupId == null)
          {
            this.toaster.warning('Please Enter Approver Group Properly At Row Number : ' + row );
            this.approverMatrixBulkModel.length = 0;
            return;
          }
          _model.ApproverGroupName = approverGroup == undefined ? '' : approverGroup.Name;
          if (_model.ApproverGroupName.toUpperCase() == 'FINANCE CHECK' || _model.ApproverGroupName.toUpperCase() == 'FINANCE COMPLETE') {
            if (this.filelist[j]['Approver Sub Group'] == undefined) {
              this.toaster.warning('Please Enter Approver Sub Group Properly For Finanace Check/Finance Complete Approver Group At Row Number : ' + row);
              this.approverMatrixBulkModel.length = 0;
              return;
            }
          }
          if (_model.ApproverGroupName.toUpperCase() != 'FINANCE CHECK' && _model.ApproverGroupName.toUpperCase() != 'FINANCE COMPLETE') {
            if (this.filelist[j]['Email'] == undefined) {
              this.toaster.warning('Please Enter Email Properly For Approver Group At Row Number : ' + row);
              this.approverMatrixBulkModel.length = 0;
              return;
            }
          }

          let workFlow = this.approverMatrixModel.WorkFlowList.find(x=>x.Name.toUpperCase() === this.filelist[j]['WorkFlow'].toString().trim().toUpperCase());
          _model.WorkFlowId = workFlow == undefined ? null : Number(workFlow.Id);
          if(_model.WorkFlowId == null)
          {
            this.toaster.warning('Please Enter WorkFlow Properly At Row Number : ' +row);
            this.approverMatrixBulkModel.length = 0;
            return;
          }
          _model.WorkFlowName = workFlow == undefined ? '' : workFlow.Name;

          if (this.filelist[j]['Email'] != undefined) {
            let user = this.approverMatrixModel.UserEmailList.find(x=>x.Text === this.filelist[j]['Email'].toString().trim());
            _model.UserId = user == undefined ? null : Number(user.Id);
            if(_model.UserId == null)
            {
              this.toaster.warning('Please Enter Email Properly At Row Number : ' +row);
              this.approverMatrixBulkModel.length = 0;
              return;
            }
            _model.UserName = user == undefined ? '' : user.Name;
            _model.Email = user == undefined ? '' : user.Text;
          }

          let department = this.approverMatrixModel.DepartmentList.find(x=>x.Name.toUpperCase() === this.filelist[j]['Department'].toString().trim().toUpperCase());
          _model.DepartmentId = department == undefined ? null : Number(department.Id);
          if(_model.DepartmentId == null)
          {
            this.toaster.warning('Please Enter Department Properly At Row Number : ' +row);
            this.approverMatrixBulkModel.length = 0;
            return;
          }
          _model.DepartmentName = department == undefined ? '' : department.Name;

          // let approverGroup = this.approverMatrixModel.ApproverGroupList.find(x=>x.Name.toUpperCase() === this.filelist[j]['Approver Group'].toString().trim().toUpperCase());
          // _model.ApproverGroupId = approverGroup == undefined ? null : Number(approverGroup.Id);
          // if(_model.ApproverGroupId == null)
          // {
          //   this.toaster.warning('Please Enter Approver Group Properly At Row Number : ' +row);
          //   return;
          // }
          // _model.ApproverGroupName = approverGroup == undefined ? '' : approverGroup.Name;

          if (this.filelist[j]['Approver Sub Group'] != undefined) {
            let approverSubGroup = this.approverMatrixModel.ApproverSubGroupList.find(x => x.Name.toUpperCase() === this.filelist[j]['Approver Sub Group'].toString().trim().toUpperCase());
            _model.ApproverSubGroupId = approverSubGroup == undefined ? null : Number(approverSubGroup.Id);
            if (_model.ApproverSubGroupId == null) {
              this.toaster.warning('Please Enter Approver Sub Group Properly At Row Number : ' +row);
              this.approverMatrixBulkModel.length = 0;
              return;
            }
            _model.ApproverSubGroupName = approverSubGroup == undefined ? '' : approverSubGroup.Name;
          }


          _model.Name = this.filelist[j]['Name'];
          _model.Level = this.filelist[j]['Level'];

          this.approverMatrixBulkModel.push(_model);
        }
      }
    }

  }

  get ApproverMatrixForFormControl() {
    return this.approverMatrixForm ? this.approverMatrixForm.get('ApproverMatrixType') : null;
  }

  createMatrix = () => {
    if (this.approverMatrixForm.invalid) {
      this.approverMatrixForm.markAllAsTouched();
      this.toaster.warning('Please Enter Approver Matrix Type !');
      return;
    }
    else if (this.approverMatrixBulkModel.length <= 0) {
      this.toaster.warning('Empty Data !');
      return;
    }
    else {
      if (this.ApproverMatrixForFormControl.value == "Advance") {
        this.loading = true;
        this.approverMatrixService.createAdvanceApproverMatrixBulk(this.approverMatrixBulkModel).subscribe((x) => {
          if (x.Success) {
            this.loading = false;
            this.toaster.success('Advance approver matrix bulk creation Success!!');
            this.approverMatrixBulkModel.length = 0;
          } else {
            this.loading = false;
            this.toaster.error('error in save');
          }
        })
        return;
      }
      if (this.ApproverMatrixForFormControl.value == "Outstation") {
        this.loading = true;
        this.approverMatrixService.createOutstationApproverMatrixBulk(this.approverMatrixBulkModel).subscribe((x) => {
          if (x.Success) {
            this.loading = false;
            this.toaster.success('Outstation approver matrix bulk creation Success!!');
            this.approverMatrixBulkModel.length = 0;
          } else {
            this.loading = false;
            this.toaster.error('error in save');
          }
        })
        return;
      }
      if (this.ApproverMatrixForFormControl.value == "Settlement") {
        this.loading = true;
        this.approverMatrixService.createSettlementApproverMatrixBulk(this.approverMatrixBulkModel).subscribe((x) => {
          if (x.Success) {
            this.loading = false;
            this.toaster.success('Settlement approver matrix bulk creation Success!!');
            this.approverMatrixBulkModel.length = 0;
          } else {
            this.loading = false;
            this.toaster.error('error in save');
          }
        })
        return;
      }
    }
  }

  private loadInitData() {
    this.subSink.sink = this.approverMatrixService.getInitData().subscribe(
      (res) => {
        if (res) {
          this.approverMatrixModel = res;
        }
      },
      (err) => {
        this.toaster.error(err, "Error");
      }
    );
  }
}