import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SubSink } from "subsink/dist/subsink";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import {
  CodeNamePairViewModel,
  UrlTypeModel,
} from "src/app/core/models/mastersetup-model/codenamepair.model";
import { AdvanceParticularsService } from "src/app/core/services/Advance/advance-particulars.service";

@Component({
  selector: "app-advance-particular-add-edit",
  templateUrl: "./advance-particular-add-edit.component.html",
  styleUrls: ["./advance-particular-add-edit.component.scss"],
})
export class AdvanceParticularAddEditComponent implements OnInit, OnDestroy {
  @Input() public isEdit: boolean;
  @Input() public aModel;

  breadCrumbItems: Array<{}>;
  model: CodeNamePairViewModel;
  initModel: CodeNamePairViewModel;
  basicForm: FormGroup;
  subSink: SubSink;
  codeNamePairId: string;
  labelListTitle: string;
  urlTypeModel: UrlTypeModel;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private toaster: ToastrService,
    private service: AdvanceParticularsService
  ) {
    this.subSink = new SubSink();
  }

  ngOnInit() {
    this.createForm();
    let title = this.isEdit ? "Edit " : "Create ";
    this.labelListTitle = title + "Advance Particular";
    if (this.isEdit) {
      this.loadData(this.aModel.Id);
    }
  }

  ngOnDestroy() {
    if (this.subSink) this.subSink.unsubscribe();
  }

  createForm() {
    this.basicForm = this.fb.group({
      Id: [""],
      Name: ["", [Validators.required, , Validators.maxLength(256)]],
      IsActive: [true, Validators.required],
    });
  }

  loadDataDetails(aModel: CodeNamePairViewModel) {
    this.basicForm.patchValue({
      Id: aModel.Id,
      Name: aModel.Name,
      IsActive: aModel.IsActive,
    });
  }

  private loadData(Id: number) {
    this.subSink.sink = this.service.getById(Id).subscribe(
      (res) => {
        if (res) {
          this.model = res;
          this.loadDataDetails(this.model);
        }
      },
      (err) => {
        this.toaster.error(err, "Error");
      }
    );
  }

  onSubmit() {
    if (this.basicForm.invalid) {
      this.toaster.warning("Please fill all the required field !");
      return;
    } else {
      if (this.basicForm.value.Id > 0) this.onEdit();
      else this.onCreate();
    }
  }

  private onCreate() {
    this.basicForm.value.Id = 0;
    this.subSink.sink = this.service
      .save(this.basicForm.value)
      .subscribe((x) => {
        if (x.Success) {
          this.toaster.success("added successfully");
          this.activeModal.close(x);
        } else {
          this.toaster.error(x.Message);
        }
      });
  }

  private onEdit() {
    this.subSink.sink = this.service
      .update(this.basicForm.value)
      .subscribe((x) => {
        if (x.Success) {
          this.toaster.success("updated successfully");
          this.activeModal.close(x);
        } else {
          this.toaster.error(x.Message);
        }
      });
  }
}
