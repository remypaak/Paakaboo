import { LowerCasePipe, NgIf } from '@angular/common';
import { Component, Self, input } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, LowerCasePipe],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss'
})
export class TextInputComponent implements ControlValueAccessor{
  label = input<string>('');
  type = input<string>('text');
  placeholder = input<string>('');
  showValidationMessages = input<boolean>(true);

  constructor(@Self() public ngControl: NgControl){
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void {
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
  }
  get control(): FormControl {
    return this.ngControl.control as FormControl
  }

  isValid(): boolean {
    return this.control.valid && (this.control.dirty || this.control.touched)
  }
}