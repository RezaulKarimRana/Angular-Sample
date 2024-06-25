import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink/dist/subsink';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SubMenuRolesInitModel } from 'src/app/core/models/mastersetup-model/subMenuRoles.model';
import { SubMenuRolesService } from 'src/app/core/services/MasterSetup/subMenuRoles.service';
import { SubMenuModel } from 'src/app/core/models/mastersetup-model/subMenu.model';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})

export class SubMenuRolesAddEditComponent implements OnInit, OnDestroy {

  @Input() public isEdit: boolean;
  @Input() public aModel;

  breadCrumbItems: Array<{}>;
  form: FormGroup;
  subSink: SubSink;
  labelListTitle: string;
  initModel: SubMenuRolesInitModel;
  subMenu: SubMenuModel[];

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private toaster: ToastrService,
    private service: SubMenuRolesService) {
    this.subSink = new SubSink();
  }

  ngOnInit() {
    this.createForm();
    this.loadInitData();
    let title = this.isEdit ? "Edit " : "Create ";
    this.labelListTitle = title + "Sub-Menu Role";
    if (this.isEdit) {
      this.loadDetails();
    }
  }

  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }
  private loadInitData() {
    this.subSink.sink = this.service.getInitData().subscribe(res => {
      this.initModel = res;console.log(this.initModel)
    }, err => {
      console.log("error");
    });
  }
  loadDetails() {
    this.form.patchValue({
      Id: this.aModel.Id,
      SubMenuId: this.aModel.SubMenuId,
      MenuId: this.aModel.MenuId,
      RoleId: this.aModel.RoleId,
      IsActive: this.aModel.IsActive
    });
  }
  onChangeMenu(){
    this.subMenu = this.initModel?.SubMenus.filter(x=> x.MenuId == this.form.value.MenuId);
  }
  createForm() {
    this.form = this.fb.group({
      Id: [''],
      MenuId: [null, Validators.required],
      SubMenuId: [null, Validators.required],
      RoleId: [null, Validators.required],
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
        this.toaster.success('added successfully');
        this.activeModal.close(x);
      } else {
        this.toaster.error(x.Message);
      }
    })
  }

  private onEdit() {
    this.subSink.sink = this.service.update(this.form.value).subscribe((x) => {
      if (x.Success) {
        this.toaster.success('updated successfully');
        this.activeModal.close(x);
      } else {
        this.toaster.error(x.Message);
      }
    })
  }

}