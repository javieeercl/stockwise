import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShrinkHeaderComponent } from './shrink-header/shrink-header.component';
import { AddCategoryModalComponent } from './add-category-modal/add-category-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddProductModalComponent } from './add-product-modal/add-product-modal.component';



@NgModule({
  declarations: [
    MenuComponent,
    ShrinkHeaderComponent,
    FooterComponent,
    AddCategoryModalComponent,
    AddProductModalComponent
  ],  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    ReactiveFormsModule
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports:[
    MenuComponent,
    ShrinkHeaderComponent,
    FooterComponent,
    AddCategoryModalComponent,
    AddProductModalComponent
  ],
})
export class ComponentsModule { }
