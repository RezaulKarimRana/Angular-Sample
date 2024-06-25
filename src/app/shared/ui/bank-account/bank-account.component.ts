import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BankAccountViewModel } from 'src/app/core/models/mastersetup-model/bankaccount.model';
import { SubSink } from 'subsink/dist/subsink';

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.scss'],
  providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => BankAccountComponent),
			multi: true
		}
	],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BankAccountComponent implements ControlValueAccessor,OnDestroy,OnInit {

  subSink = new SubSink();
  bankAccountForm: FormGroup;
  @Output()
	onInitalize: EventEmitter<BankAccountComponent> = new EventEmitter<BankAccountComponent>();
  
  onChange: any = () => { };
	onTouched: any = () => { };

  constructor(
    private bankAccountFB: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.subSink = new SubSink();
  }

  ngOnInit(): void {
    var acc = document.getElementsByClassName("accordionBankInfo");
    var i;
    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        } 
      });
    }
    this.createForm();
		this.onInitalize.emit(this);
  }
  get value(): BankAccountViewModel {

		return this.bankAccountForm.value;

	}

	set value(value: BankAccountViewModel) {

		this.bankAccountForm.patchValue(value);
		this.onChange(value);
		this.onTouched();
		this.cdr.detectChanges();

	}

  writeValue(value: any): void {
		if (value) {
			this.bankAccountForm.patchValue(value, { emitEvent: false });
		}

		if (value === null) {
			this.bankAccountForm.reset();
		}
	}

	registerOnChange(fn: any): void {
    if(this.bankAccountForm != null)
		  this.bankAccountForm.valueChanges.subscribe(fn);
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		isDisabled ? this.bankAccountForm.disable() : this.bankAccountForm.enable();
	}

  createForm() {
    this.bankAccountForm = this.bankAccountFB.group({
      AccountHolderName: [''],
      AccountHolderCompany: [''],
      BankName: [''],
      AccountNo: [''],
      AccountType: [''],
      RouterNo: [''],
      Condition: [''],
      MobileNo: ['']
    });
  }
  get accountHolderNameFormControl() {
    return this.bankAccountForm ? this.bankAccountForm.get('AccountHolderName') : null;
  }
  get accountHolderCompanyFormControl() {
    return this.bankAccountForm ? this.bankAccountForm.get('AccountHolderCompany') : null;
  }
  get bankNameFormControl() {
    return this.bankAccountForm ? this.bankAccountForm.get('BankName') : null;
  }
  get accountNoFormControl() {
    return this.bankAccountForm ? this.bankAccountForm.get('AccountNo') : null;
  }
  get accountTypeFormControl() {
    return this.bankAccountForm ? this.bankAccountForm.get('AccountType') : null;
  }
  get routerNoFormControl() {
    return this.bankAccountForm ? this.bankAccountForm.get('RouterNo') : null;
  }
  get conditionFormControl() {
    return this.bankAccountForm ? this.bankAccountForm.get('Condition') : null;
  }
  get bankMobileNoFormControl() {
    return this.bankAccountForm ? this.bankAccountForm.get('MobileNo') : null;
  }
  
  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }
}
