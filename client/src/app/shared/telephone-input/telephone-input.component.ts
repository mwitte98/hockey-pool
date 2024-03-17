import { FocusMonitor } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  ViewChild,
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, NgControl, Validators } from '@angular/forms';
import { MAT_FORM_FIELD, MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';

import { TelephoneNumber } from '../types/interfaces';

@Component({
  selector: 'telephone-input',
  templateUrl: './telephone-input.component.html',
  styleUrl: './telephone-input.component.scss',
  providers: [{ provide: MatFormFieldControl, useExisting: TelephoneInputComponent }],
})
export class TelephoneInputComponent
  implements ControlValueAccessor, MatFormFieldControl<TelephoneNumber>, OnInit, OnDestroy
{
  static nextId = 0;
  digitsOnly = /^\d*$/u;
  form = this.fb.group({
    area: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(3), Validators.pattern(this.digitsOnly)],
    ],
    exchange: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(3), Validators.pattern(this.digitsOnly)],
    ],
    subscriber: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern(this.digitsOnly)],
    ],
  });
  stateChanges = new Subject<void>();
  focused = false;
  touched = false;
  controlType = 'telephone-input';
  @ViewChild('area', { static: true }) areaInput: HTMLInputElement;
  @ViewChild('exchange', { static: true }) exchangeInput: HTMLInputElement;
  @ViewChild('subscriber', { static: true }) subscriberInput: HTMLInputElement;
  @HostBinding('id') id = `telephone-input-${(TelephoneInputComponent.nextId += 1)}`;

  @Input()
  get placeholder(): string {
    return this.placeholderPrivate;
  }
  set placeholder(value: string) {
    this.placeholderPrivate = value;
    this.stateChanges.next();
  }
  private placeholderPrivate: string;

  @Input()
  get required(): boolean {
    return this.requiredPrivate;
  }
  set required(value: BooleanInput) {
    this.requiredPrivate = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private requiredPrivate = false;

  @Input()
  get disabled(): boolean {
    return this.disabledPrivate;
  }
  set disabled(value: BooleanInput) {
    this.disabledPrivate = coerceBooleanProperty(value);
    if (this.disabledPrivate) {
      this.form.disable();
    } else {
      this.form.enable();
    }
    this.stateChanges.next();
  }
  private disabledPrivate = false;

  constructor(
    private fb: FormBuilder,
    private focusMonitor: FocusMonitor,
    private elementRef: ElementRef<HTMLElement>,
    @Optional() @Inject(MAT_FORM_FIELD) public _formField: MatFormField,
    @Optional() @Self() public ngControl: NgControl,
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    this.setInputFilter(this.areaInput);
    this.setInputFilter(this.exchangeInput);
    this.setInputFilter(this.subscriberInput);
  }

  setInputFilter(element: any): void {
    const events = ['input', 'keydown', 'keyup', 'mousedown', 'mouseup', 'select', 'contextmenu', 'drop', 'focusout'];
    for (const event of events) {
      (element.nativeElement as HTMLInputElement).addEventListener(event, () => {
        if (this.digitsOnly.test(element.nativeElement.value)) {
          element.nativeElement.oldValue = element.nativeElement.value;
          element.nativeElement.oldSelectionStart = element.nativeElement.selectionStart;
          element.nativeElement.oldSelectionEnd = element.nativeElement.selectionEnd;
        } else if (Object.hasOwn(element.nativeElement, 'oldValue')) {
          element.nativeElement.value = element.nativeElement.oldValue;

          if (element.nativeElement.oldSelectionStart !== null && element.nativeElement.oldSelectionEnd !== null) {
            (element.nativeElement as HTMLInputElement).setSelectionRange(
              element.nativeElement.oldSelectionStart,
              element.nativeElement.oldSelectionEnd,
            );
          }
        } else {
          element.nativeElement.value = '';
        }
      });
    }
  }

  onChange = (_: any): void => {};
  onTouched = (): void => {};

  get empty(): boolean {
    const {
      value: { area, exchange, subscriber },
    } = this.form;

    return !area && !exchange && !subscriber;
  }

  @HostBinding('class.floating-label')
  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  @Input()
  get value(): TelephoneNumber | null {
    return this.form.valid ? this.form.getRawValue() : null;
  }
  set value(tel: TelephoneNumber | null) {
    this.form.setValue({ area: tel?.area ?? '', exchange: tel?.exchange ?? '', subscriber: tel?.subscriber ?? '' });
    this.stateChanges.next();
  }

  get errorState(): boolean {
    return this.form.invalid && this.touched;
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
    this.focusMonitor.stopMonitoring(this.elementRef);
  }

  onFocusIn(): void {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  onFocusOut(event: FocusEvent): void {
    if (!this.elementRef.nativeElement.contains(event.relatedTarget as Element)) {
      this.touched = true;
      this.focused = false;
      this.onTouched();
      this.stateChanges.next();
    }
  }

  autoFocusNext(control: AbstractControl, nextElement?: HTMLInputElement): void {
    if (!control.errors && nextElement) {
      this.focusMonitor.focusVia(nextElement, 'program');
    }
  }

  autoFocusPrev(control: AbstractControl, prevElement: HTMLInputElement): void {
    if (control.value.length === 0) {
      this.focusMonitor.focusVia(prevElement, 'program');
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setDescribedByIds(): void {}

  onContainerClick(): void {
    if (this.form.controls.subscriber.valid) {
      this.focusMonitor.focusVia(this.subscriberInput, 'program');
    } else if (this.form.controls.exchange.valid) {
      this.focusMonitor.focusVia(this.subscriberInput, 'program');
    } else if (this.form.controls.area.valid) {
      this.focusMonitor.focusVia(this.exchangeInput, 'program');
    } else {
      this.focusMonitor.focusVia(this.areaInput, 'program');
    }
  }

  writeValue(tel: TelephoneNumber | null): void {
    this.value = tel;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  _handleInput(control: AbstractControl, nextElement?: HTMLInputElement): void {
    this.autoFocusNext(control, nextElement);
    this.onChange(this.value);
  }
}
