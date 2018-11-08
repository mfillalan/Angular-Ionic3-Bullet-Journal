import { Directive, ElementRef, Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the AutoHideDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[autohide]', // Attribute selector
  host: {
    '(document:click)': 'onClick($event.target)'
  }
})
export class AutoHideDirective {

  @Output() autohide = new EventEmitter();

  constructor(private _elementRef: ElementRef) {
    console.log('Hello AutoHideDirective Directive');
  }

  onClick(targetElement) {
    //console.log(targetElement);
    if(!this._elementRef.nativeElement.contains(targetElement)) {
      //do something
      this.autohide.emit(null);
    }
  }

}
