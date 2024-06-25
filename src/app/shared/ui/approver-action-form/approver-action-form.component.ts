import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from 'src/app/core/base/base.service';
import { BaseComponent } from 'src/app/core/base/component/base/base.component';
import { ApproverEntryModel } from 'src/app/core/models/approverEntry.model';
import { SubSink } from 'subsink/dist/subsink';

@Component({
  selector: 'app-approver-action-form',
  templateUrl: './approver-action-form.component.html',
  styleUrls: ['./approver-action-form.component.scss'],
  providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => ApproverActionFormComponent),
			multi: true
		}
	],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApproverActionFormComponent extends BaseComponent implements ControlValueAccessor,OnDestroy,OnInit {

  subSink = new SubSink();
  formGroup : FormGroup;

  @Input()
  isFinanceCheck: boolean;
  @Input()
  isFinanceComplete: boolean;

  @Output()
	onInitalize: EventEmitter<ApproverActionFormComponent> = new EventEmitter<ApproverActionFormComponent>();

  onChange: any = () => {};
	onTouched: any = () => { };

  constructor(
    toaster: ToastrService,
    baseService: BaseService,
    private fB: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    super(toaster, baseService);
    this.subSink = new SubSink();
  }

  ngOnInit(): void {
    this.createForm();
		this.onInitalize.emit(this);
  }

  get value(): ApproverEntryModel {
		return this.formGroup.value;
	}
  set value(value: ApproverEntryModel) {
    this.remarksFC.setValue(value.Remarks);
    this.voucherNoFC.setValue(value.VoucherNo);
		this.onChange(value);
		this.onTouched();
		this.cdr.detectChanges();
	}

  writeValue(value: any): void {
		if (value) {
			this.formGroup.patchValue(value, { emitEvent: false });
		}

		if (value === null) {
			this.formGroup.reset();
		}
	}

	registerOnChange(fn: any): void {
    if(this.formGroup != null)
		  this.formGroup.valueChanges.subscribe(fn);
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState?(isDisabled: boolean): void {console.log(isDisabled)
		isDisabled ? this.formGroup.disable() : this.formGroup.enable();
	}

  createForm() {
    this.formGroup = this.fB.group({
      VoucherNo: [''],
      Remarks: ['']
    });
  }
  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }
  
  get remarksFC() {
    return this.formGroup ? this.formGroup.get('Remarks') : null;
  }

  get voucherNoFC() {
    return this.formGroup ? this.formGroup.get('VoucherNo') : null;
  }
}
