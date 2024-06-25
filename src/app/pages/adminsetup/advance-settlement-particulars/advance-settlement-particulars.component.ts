import { Component, OnInit, OnDestroy } from "@angular/core";
import { SubSink } from "subsink/dist/subsink";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  CodeNamePairViewModel,
  UrlTypeModel,
} from "src/app/core/models/mastersetup-model/codenamepair.model";
import { AdvanceParticularAddEditComponent } from "../advance-particular-add-edit/advance-particular-add-edit.component";
import { AdvanceSettlementParticularsService } from "src/app/core/services/Advance/advance-settlement-particulars.service";
import { AdvanceSettlementParticularAddEditComponent } from "../advance-settlement-particular-add-edit/advance-settlement-particular-add-edit.component";

@Component({
  selector: "app-advance-settlement-particulars",
  templateUrl: "./advance-settlement-particulars.component.html",
  styleUrls: ["./advance-settlement-particulars.component.scss"],
})
export class AdvanceSettlementParticularsComponent
  implements OnInit, OnDestroy
{
  subSink = new SubSink();
  breadCrumbItems: Array<{}>;
  listData: CodeNamePairViewModel[];
  urlTypeModel: UrlTypeModel;

  labelListTitle: string = "";

  constructor(
    private modalService: NgbModal,
    private service: AdvanceSettlementParticularsService
  ) {}

  ngOnInit() {
    this.initDataTable();
  }
  private initDataTable() {
    this._fetchData();
    this.labelListTitle = "Advance Settlement Particular List";
  }
  ngOnDestroy() {
    this.subSink.unsubscribe();
  }

  private _fetchData() {
    this.subSink.sink = this.service.getAll().subscribe(
      (res) => {
        this.listData = res;
      },
      (err) => {
        console.log("error");
      }
    );
  }

  public openModalItem(item: CodeNamePairViewModel) {
    const modalRef = this.modalService.open(
      AdvanceSettlementParticularAddEditComponent,
      { size: "md", backdrop: "static", keyboard: false }
    );
    let isEditable = item != null ? true : false;
    modalRef.componentInstance.aModel = item;
    modalRef.componentInstance.isEdit = isEditable;
    modalRef.result.then(
      (result) => {
        if (result) {
          this.initDataTable();
        }
      },
      (reason) => {
        console.log("Dismissed action: " + reason);
      }
    );
  }
}
