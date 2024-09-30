import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddItemPage } from './pages/add-item/add-item.page';
import { ItemListPage } from './pages/item-list/item-list.page';
import { ItemDetailPage } from './pages/item-detail/item-detail.page';

const routes: Routes = [
  { path: 'add-item', component: AddItemPage },
  { path: 'item-list', component: ItemListPage },
  { path: 'item-detail/:id', component: ItemDetailPage } // :id para pasar el ID del ítem
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule {}
