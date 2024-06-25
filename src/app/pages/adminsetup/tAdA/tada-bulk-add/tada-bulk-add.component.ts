import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TAdAInitModel, TAdAModel } from 'src/app/core/models/mastersetup-model/TAdAModel.model';
import { TAdAService } from 'src/app/core/services/MasterSetup/tAdA.service';
import { SubSink } from 'subsink/dist/subsink';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-tada-bulk-add',
  templateUrl: './tada-bulk-add.component.html',
  styleUrls: ['./tada-bulk-add.component.scss']
})
export class TadaBulkAddComponent implements OnInit , OnDestroy {

  subSink: SubSink;
  file: File;
  arrayBuffer: any;
  filelist: any = [];
  model: TAdAModel[] = [];
  tAdAInitModel: TAdAInitModel;
  loading:boolean= false;
  
  constructor(
    private toaster: ToastrService,
    private tAdAService: TAdAService) {
    this.subSink = new SubSink();
  }

  ngOnInit() {
    this.loadInitData();
  }
  private loadInitData() {
    this.subSink.sink = this.tAdAService.getInitData().subscribe(
      (res) => {
        if (res) {
          this.tAdAInitModel = res;
        }
      },
      (err) => {
        this.toaster.error(err, "Error");
      }
    );
  }
  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }

  addfile(event) {
    this.loading = true; 

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

      if (this.filelist.length > 0) {
        for (let j = 0; j < this.filelist.length; j++) {
          const _model = new TAdAModel();
          let designation = this.tAdAInitModel.DesignationList.find(x=>x.Name.toUpperCase() === this.filelist[j]['Designation'].toString().trim().toUpperCase());
          _model.DesignationId = designation == undefined ? null : Number(designation.Id);
          _model.DesignationName = designation == undefined ? '' : designation.Name;
          if(designation == undefined)
          {
            console.log(this.filelist[j]['Designation']);
            continue;
          }
          _model.BreakfastMajor = this.filelist[j]['Breakfast'];
          _model.BreakfastMinor = this.filelist[j]['Breakfast'];
          _model.LunchMajor = this.filelist[j]['Lunch'];
          _model.LunchMinor = this.filelist[j]['Lunch'];
          _model.DinnerMajor = this.filelist[j]['Dinner'];
          _model.DinnerMinor = this.filelist[j]['Dinner'];
          _model.SnacksMajor = this.filelist[j]['Snacks'];
          _model.SnacksMinor = this.filelist[j]['Snacks'];
          _model.TotalFoodMajor = this.filelist[j]['Total Food'];
          _model.TotalFoodMinor = this.filelist[j]['Total Food'];
          _model.LocalTransPortMajor = this.filelist[j]['Local Transport'];
          _model.LocalTransPortMinor = this.filelist[j]['Local Transport'];
          _model.HotelMajor = this.filelist[j]['Major City Hotel'];
          _model.HotelMinor = this.filelist[j]['Minor City Hotel'];
          _model.TotalAllownaceMajor = this.filelist[j]['Total Allowance Major'];
          _model.TotalAllownaceMinor = this.filelist[j]['Total Allowance Minor'];
          this.model.push(_model);
        }
        this.loading = false; 
      }
    }

  }

  createUser = () => {
    this.loading = true;
    this.subSink.sink = this.tAdAService.tADABulkAdd(this.model).subscribe((x) => {
      if (x.Success) {
        this.loading = false; 
        this.toaster.success('Success!!');
      } else {
        this.loading = false; 
        this.toaster.error('error in save');
      }
    })
  }
}
