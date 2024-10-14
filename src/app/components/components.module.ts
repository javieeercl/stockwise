import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShrinkHeaderComponent } from './shrink-header/shrink-header.component';



@NgModule({
  declarations: [
    MenuComponent,
    ShrinkHeaderComponent,
    FooterComponent
  ],  imports: [
    CommonModule,
    RouterModule,
    IonicModule
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports:[
    MenuComponent,
    ShrinkHeaderComponent,
    FooterComponent
  ],
})
export class ComponentsModule { }
