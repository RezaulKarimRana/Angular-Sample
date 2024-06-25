import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink/dist/subsink';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MenuService } from 'src/app/core/services/MasterSetup/menu.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})

export class MenuAddEditComponent implements OnInit, OnDestroy {

  @Input() public isEdit: boolean;
  @Input() public aModel;

  breadCrumbItems: Array<{}>;
  form: FormGroup;
  subSink: SubSink;
  labelListTitle: string;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private toaster: ToastrService,
    private service: MenuService) {
    this.subSink = new SubSink();
  }

  ngOnInit() {
    this.createForm();
    let title = this.isEdit ? "Edit " : "Create ";
    this.labelListTitle = title + "Menu";
    if (this.isEdit) {
      this.loadDetails();
    }
  }

  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }

  loadDetails() {
    this.form.patchValue({
      Id: this.aModel.Id,
      Name: this.aModel.Name,
      Icon: this.aModel.Icon,
      Link: this.aModel.Link,
      OrderId: this.aModel.OrderId,
      HasChild: this.aModel.HasChild,
      IsActive: this.aModel.IsActive
    });
  }

  createForm() {
    this.form = this.fb.group({
      Id: [''],
      Name: ['', [Validators.required, , Validators.maxLength(256)]],
      Icon: ['', Validators.required],
      Link: [''],
      OrderId: ['', Validators.required],
      HasChild: [true],
      IsActive: [true, Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.toaster.warning('Please fill all the required field !');
      return;
    }
    else {
      if (this.form.value.Id > 0)
        this.onEdit();
      else
        this.onCreate();
    }
  }

  private onCreate() {
    this.form.value.Id = 0;
    this.subSink.sink = this.service.save(this.form.value).subscribe((x) => {
      if (x.Success) {
        this.toaster.success('menu added successfully');
        this.activeModal.close(x);
      } else {
        this.toaster.error(x.Message);
      }
    })
  }

  private onEdit() {
    this.subSink.sink = this.service.update(this.form.value).subscribe((x) => {
      if (x.Success) {
        this.toaster.success('menu updated successfully');
        this.activeModal.close(x);
      } else {
        this.toaster.error(x.Message);
      }
    })
  }

}