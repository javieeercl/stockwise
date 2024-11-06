import { enterAnimation } from './../../animations/nav-animations';
import { IonicModule } from '@ionic/angular';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackendRoutingModule } from './backend-routing.module';
import { AddItemComponent } from './pages/add-item/add-item.component';
import { ItemDetailComponent } from './pages/item-detail/item-detail.component';
import { ItemListComponent } from './pages/item-list/item-list.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PanelAdminComponent } from './pages/panel-admin/panel-admin.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { CategoriesListComponent } from './pages/categories-list/categories-list.component';


@NgModule({
  declarations: [AddItemComponent, ItemDetailComponent, ItemListComponent, PanelAdminComponent, ProductListComponent, CategoriesListComponent],
  imports: [
    CommonModule,
    BackendRoutingModule,
    IonicModule.forRoot({
      navAnimation: enterAnimation
    }),
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BackendModule { }
