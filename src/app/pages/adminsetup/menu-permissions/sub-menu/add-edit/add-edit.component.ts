import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink/dist/subsink';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MenuModel } from 'src/app/core/models/mastersetup-model/menu.model';
import { MenuService } from 'src/app/core/services/MasterSetup/menu.service';
import { SubMenuService } from 'src/app/core/services/MasterSetup/subMenu.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})

export class SubMenuAddEditComponent implements OnInit, OnDestroy {

  @Input() public isEdit: boolean;
  @Input() public aModel;

  breadCrumbItems: Array<{}>;
  menuList: MenuModel[];
  form: FormGroup;
  subSink: SubSink;
  labelListTitle: string;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private toaster: ToastrService,
    private menuService: MenuService,
    private service: SubMenuService) {
    this.subSink = new SubSink();
  }

  ngOnInit() {
    this.createForm();
    this.loadInitData();
    let title = this.isEdit ? "Edit " : "Create ";
    this.labelListTitle = title + "Sub-Menu";
    if (this.isEdit) {
      this.loadDetails();
    }
  }

  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }
  private loadInitData() {
    this.subSink.sink = this.menuService.getAll().subscribe(res => {
      this.menuList = res;
    }, err => {
      console.log("error");
    });
  }
  loadDetails() {
    this.form.patchValue({
      Id: this.aModel.Id,
      Name: this.aModel.Name,
      Link: this.aModel.Link,
      MenuId: this.aModel.MenuId,
      OrderId: this.aModel.OrderId,
      IsActive: this.aModel.IsActive
    });
  }

  createForm() {
    this.form = this.fb.group({
      Id: [''],
      Name: ['', [Validators.required, , Validators.maxLength(256)]],
      Link: ['', Validators.required],
      MenuId: [null, Validators.required],
      OrderId: ['', Validators.required],
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
        this.toaster.success('sub-menu added successfully');
        this.activeModal.close(x);
      } else {
        this.toaster.error(x.Message);
      }
    })
  }

  private onEdit() {
    this.subSink.sink = this.service.update(this.form.value).subscribe((x) => {
      if (x.Success) {
        this.toaster.success('sub-menu updated successfully');
        this.activeModal.close(x);
      } else {
        this.toaster.error(x.Message);
      }
    })
  }

}