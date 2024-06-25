import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SubSink } from 'subsink/dist/subsink';
import { BaseService } from '../../base.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit,OnDestroy {
  
  subSink: SubSink;
  constructor(
    protected toaster: ToastrService,
    private baseService: BaseService,
  ) {
    this.subSink = new SubSink();
  }

  ngOnInit(): void {
  }
  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }
  padNumber(value: number | null) {
    if (!isNaN(value) && value !== null) {
      return `0${value}`.slice(-2);
    } else {
      return '';
    }
  }
  downloadAdvanceSettlementFile(id:number, fileName: string) {
    if(id == 0 || id == undefined){
      return;
    }
    this.baseService.downloadAdvanceSettlementFile(id).subscribe(res => {
      const a = document.createElement('a')
      const objectUrl = URL.createObjectURL(res)
      a.href = objectUrl
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(objectUrl);
    }, err => {
      this.toaster.error("Error downloading...");
    });
  }
  downloadTASettlementFile(id:number, fileName: string) {
    if(id == 0 || id == undefined){
      return;
    }
    this.baseService.downloadTASettlementFile(id).subscribe(res => {
      const a = document.createElement('a')
      const objectUrl = URL.createObjectURL(res)
      a.href = objectUrl
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(objectUrl);
    }, err => {
      this.toaster.error("Error downloading...");
    });
  }
  formatDate(date: NgbDateStruct): string {
    return date ?
        `${this.padNumber(date.month)}/${this.padNumber(date.day)}/${date.year}` :
        '';
  }
  stringToNgbDate(dob: string) {
    if (dob) {
      const [year, month, day] = dob.split('-');
      const obj = { year: parseInt(year), month: parseInt(month), day: 
        parseInt(day.split(' ')[0].trim()) };
        return obj;
      }
    }

    downloadFile(id:number, fileName: string) {
      if(id == 0 || id == undefined){
        return;
      }
      this.baseService.downloadFile(id).subscribe(res => {
        const a = document.createElement('a')
        const objectUrl = URL.createObjectURL(res)
        a.href = objectUrl
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(objectUrl);
      }, err => {
        this.toaster.error("Error downloading...");
      });
    }
    deleteFile(id: number){
      this.subSink.sink = this.baseService.deleteAttachement(id).subscribe((x) => {
        if (x) {
          this.toaster.success('deleted successfully');
        } else {
          this.toaster.error("error in delete");
        }
      })
    }
    downloadExcelFile(id:string, fileName: string, sourceType: string){
      this.baseService.downloadExcelFile(id,sourceType).subscribe(res => {
        const a = document.createElement('a')
        const objectUrl = URL.createObjectURL(res)
        a.href = objectUrl
        a.download = fileName + '.xlsx';
        a.click();
        URL.revokeObjectURL(objectUrl);
      }, err => {
      });
    }
    downloadPDFFile(id:string, fileName: string, sourceType: string){
      this.baseService.downloadPDFFile(id,sourceType).subscribe(res => {
        const a = document.createElement('a')
        const objectUrl = URL.createObjectURL(res)
        a.href = objectUrl
        a.download = fileName + '.pdf';
        a.click();
        URL.revokeObjectURL(objectUrl);
      }, err => {
      });
    }

   
    tableExportCsv(tableId: string): void {
      let csv = '';
      let table = document.getElementById(tableId);
      let tr = table.children[0].children[0];
      for (let i = 0; i < tr.children.length; i++) {
        let innerHeaderText =(tr.children[i] as HTMLElement).innerText;
        let isStatusInnerText = innerHeaderText.indexOf("Status") !== -1;
        let isActionInnerText =innerHeaderText.indexOf("Action")!== -1;
        if(!isStatusInnerText && !isActionInnerText){
          csv += innerHeaderText + ",";
        }
       
      }
      csv = csv.substring(0, csv.length - 1) + "\n";
      let tbody = table.children[1];
      for (let i = 0; i < tbody.children.length; i++) {
        for (let j = 0; j < tbody.children[i].children.length-2; j++) {

          let innerBodyText =(tbody.children[i].children[j] as HTMLElement).innerText;
          let isStatusInnerBodyText = innerBodyText.indexOf("Status") !== -1;
          let isActionInnerBodyText = innerBodyText.indexOf("Action")!== -1;
          if(!isStatusInnerBodyText && !isActionInnerBodyText){
            csv += innerBodyText + ",";
          }
        }
        csv = csv.substring(0, csv.length - 1) + "\n";
      }
      csv = csv.substring(0, csv.length - 1) + "\n";
      let hiddenElement = document.createElement('a');
      hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
      hiddenElement.target = '_blank';
      hiddenElement.download = tableId +'.csv';
      hiddenElement.click();
    }
    numberOnly(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
    }
}
