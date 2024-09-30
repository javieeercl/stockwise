import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { InventoryRoutingModule } from './inventory-routing.module'; // Importar el módulo de enrutamiento
import { AddItemPage } from './pages/add-item/add-item.page';
import { ItemListPage } from './pages/item-list/item-list.page';
import { ItemDetailPage } from './pages/item-detail/item-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot(),
    InventoryRoutingModule // Asegúrate de que esté aquí
  ],
  declarations: [
    AddItemPage,
    ItemListPage,
    ItemDetailPage
  ]
})
export class InventoryModule {}
