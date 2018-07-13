import { Injectable, ComponentFactoryResolver, ComponentRef, Injector, ApplicationRef, EmbeddedViewRef } from '@angular/core';
import { first } from 'rxjs/operators';
import { SimpleModal } from './../../interfaces/simple-modal';
import { SimpleModalComponent } from './simple-modal.component';

@Injectable()
export class SimpleModalService {
  private ref: ComponentRef<SimpleModalComponent>;
  constructor(
    private applicationRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector
  ) { }

  openModal(modalData: SimpleModal) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(SimpleModalComponent);
    this.ref = factory.create(this.injector);
    this.applicationRef.attachView(this.ref.hostView);
    const componentRootNode = this.getComponentRootNode(this.ref);
    document.body.appendChild(componentRootNode);
    this.ref.instance.modalData = modalData;
    this.ref.instance.close
    .pipe(first())
    .subscribe(() => this.closeModal());
    this.ref.changeDetectorRef.detectChanges();
  }

  private getComponentRootNode(componentRef: ComponentRef<any>): Element {
    return (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as Element;
  }

  // this will create the inputs if you want to scalate component injection
  // private projectComponentInputs<T>(component: ComponentRef<T>, options: any): ComponentRef<T> {
  //   if (options) {
  //     const props = Object.getOwnPropertyNames(options);
  //     for (const prop of props) {
  //       component.instance[prop] = options[prop];
  //     }
  //   }
  //   return component;
  // }

  closeModal() {
    this.ref.destroy();
  }

}
