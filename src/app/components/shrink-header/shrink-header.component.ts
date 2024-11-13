import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, AfterViewInit } from '@angular/core';
import { DomController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shrink-header',
  templateUrl: './shrink-header.component.html',
  styleUrls: ['./shrink-header.component.scss'],
})
export class ShrinkHeaderComponent implements OnDestroy, AfterViewInit {

  @Input() scrollArea: any;
  @Input()
  headerHeight!: number;
  newHeaderHeight: any;
  scrollSub: Subscription | undefined;

  constructor(
    public element: ElementRef,
    public renderer: Renderer2,
    public domCtrl: DomController
  ) { }

  ngAfterViewInit() {
    this.renderer.setStyle(this.element.nativeElement, 'height', this.headerHeight + 'px');

    this.scrollSub = this.scrollArea.ionScroll.subscribe((event: any) => {
      // console.log(event.detail.scrollTop);
      this.resizeHeader(event);
    });
  }

  resizeHeader(event: { detail: { scrollTop: number; }; }) {
    this.domCtrl.write(() => {
      this.newHeaderHeight = this.headerHeight - event.detail.scrollTop;
      if(this.newHeaderHeight < 0) this.newHeaderHeight = 0;
      this.renderer.setStyle(this.element.nativeElement, 'height', this.newHeaderHeight + 'px');
    });
  }

  ngOnDestroy() {
    if(this.scrollSub) this.scrollSub.unsubscribe();
  }

}

