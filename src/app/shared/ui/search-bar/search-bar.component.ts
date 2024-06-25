import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ApplicationStatus } from "src/app/core/enums/constants";
import { CodeNamePair } from "src/app/core/models/mastersetup-model/codenamepair.model";
import { SearchModel } from "src/app/core/models/search-model";

@Component({
  selector: "app-search-bar",
  templateUrl: "./search-bar.component.html",
  styleUrls: ["./search-bar.component.scss"],
})
export class SearchBarComponent implements OnInit {
  @Input() StatusList: CodeNamePair[] = [];
  @Input() Users: CodeNamePair[] = [];
  @Input() RequesterId: number = 0;
  @Output() SearchEvent = new EventEmitter<SearchModel>();
  fGroup: FormGroup;
  searchModel: SearchModel;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.fGroup = this.fb.group({
      StatusId: [0],
      UserId: [null],
      RequestNo: [""],
      SiteCode: [""],
    });
    if (this.RequesterId > 0) {
      this.userFC.setValue(this.RequesterId);
      this.userFC.disable();
    } else {
      this.statusFC.setValue(ApplicationStatus.Pending);
    }
  }
  get statusFC() {
    return this.fGroup ? this.fGroup.get("StatusId") : null;
  }
  get userFC() {
    return this.fGroup ? this.fGroup.get("UserId") : null;
  }
  get requestNoFC() {
    return this.fGroup ? this.fGroup.get("RequestNo") : null;
  }
  get siteCodeFC() {
    return this.fGroup ? this.fGroup.get("SiteCode") : null;
  }
  passDataToParent() {
    this.searchModel = new SearchModel();
    this.searchModel.RequestNo = this.requestNoFC.value;
    this.searchModel.StatusId = this.statusFC.value;
    this.searchModel.UserId = this.userFC.value;
    this.searchModel.SiteCode = this.siteCodeFC.value;
    this.SearchEvent.emit(this.searchModel);
  }
}
