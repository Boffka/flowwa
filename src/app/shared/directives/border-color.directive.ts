import { AfterViewInit, Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[borderColor]'
})
export class BorderColorDirective implements AfterViewInit, OnChanges {
  @Input() borderColor: string;

  constructor(private elRef: ElementRef) {

  }

  ngAfterViewInit() {
  }

  ngOnChanges() {
    this.changeColor();
  }

  changeColor() {
    this.elRef.nativeElement.style.borderColor = this.borderColor;
  }

}
