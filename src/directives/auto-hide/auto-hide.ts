import { Directive, ElementRef, Renderer, Output, EventEmitter } from '@angular/core';

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

  fabToHide;

  @Output() autohide = new EventEmitter();

  constructor(private _elementRef: ElementRef, private renderer: Renderer) {
    console.log('Hello AutoHideDirective Directive');
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.fabToHide = this._elementRef.nativeElement.getElementsByClassName("fab")[0];
  }

  onClick(targetElement) {
    //console.log(targetElement);
    if(!this._elementRef.nativeElement.contains(targetElement)) {
      //do something
      this.autohide.emit(null);
    }
  }

}
