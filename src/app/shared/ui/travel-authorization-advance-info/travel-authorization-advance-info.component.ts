import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output,Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseComponent } from '../../../core/base/component/base/base.component';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from 'src/app/core/base/base.service';
import { TravelAuthorizationViewModel } from 'src/app/core/models/travel-authorisation-model/travelAuthorisation.model';
import { SubSink } from 'subsink/dist/subsink';
import { TravelAuthorizationType } from 'src/app/core/enums/constants';

@Component({
  selector: 'app-travel-authorization-advance-info',
  templateUrl: './travel-authorization-advance-info.component.html',
  styleUrls: ['./travel-authorization-advance-info.component.scss'],
  providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TravelAuthorizationAdvanceInfoComponent),
			multi: true
		}
	],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TravelAuthorizationAdvanceInfoComponent extends BaseComponent implements ControlValueAccessor,OnDestroy,OnInit {

  subSink = new SubSink();
  form: FormGroup;
  IsWithAdvance: boolean = false;
  @Output()
	onInitalize: EventEmitter<TravelAuthorizationAdvanceInfoComponent> = new EventEmitter<TravelAuthorizationAdvanceInfoComponent>();
  
  @Input() public supervisorLevelName:string ="Bill Reviewer";
  onChange: any = () => {};
	onTouched: any = () => { };

  constructor(
    toaster: ToastrService,
    baseService: BaseService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    super(toaster, baseService);
    this.subSink = new SubSink();
  }

  ngOnInit(): void {
    this.createForm();
		this.onInitalize.emit(this);
  }

  get value(): TravelAuthorizationViewModel {
		return this.form.value;
	}
  set value(value: TravelAuthorizationViewModel) {
    this.travelAuthorizationTypeFormControl.setValue(value.TravelAuthorizationTypeName);
    this.supervisorNameFormControl.setValue(value.SupervisorName);
    this.travelAuthorizationDateFormControl.setValue(this.stringToNgbDate(value.TravelAuthorizationDate));
    this.advanceRequisitionDateFormControl.setValue(this.stringToNgbDate(value.AdvanceRequisitionDate));
    this.tentativeSettlementDateFormControl.setValue(this.stringToNgbDate(value.TentativeSettlementDate));
    this.justificationFormControl.setValue(value.Justification);
    this.IsWithAdvance = value.TravelAuthorizationTypeId == TravelAuthorizationType.WithAdvance;
		this.onChange(value);
		this.onTouched();
		this.cdr.detectChanges();
	}

  writeValue(value: any): void {
		if (value) {
			this.form.patchValue(value, { emitEvent: false });
		}

		if (value === null) {
			this.form.reset();
		}
	}

	registerOnChange(fn: any): void {
    if(this.form != null)
		  this.form.valueChanges.subscribe(fn);
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		isDisabled ? this.form.disable() : this.form.enable();
	}

  createForm() {
    this.form = this.fb.group({
      Id: [],
      PublicId: [],
      TravelAuthorizationTypeName: [],
      SupervisorName: [],
      TravelAuthorizationDate: [],
      Justification: [],
      AdvanceRequisitionDate: [],
      TentativeSettlementDate: [],
    });
  }
  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }
  get travelAuthorizationTypeFormControl() {
    return this.form ? this.form.get('TravelAuthorizationTypeName') : null;
  }
  get supervisorNameFormControl() {
    return this.form ? this.form.get('SupervisorName') : null;
  }
  get travelAuthorizationDateFormControl() {
    return this.form ? this.form.get('TravelAuthorizationDate') : null;
  }
  get justificationFormControl() {
    return this.form ? this.form.get('Justification') : null;
  }
  get advanceRequisitionDateFormControl() {
    return this.form ? this.form.get('AdvanceRequisitionDate') : null;
  }
  get tentativeSettlementDateFormControl() {
    return this.form ? this.form.get('TentativeSettlementDate') : null;
  }
}
