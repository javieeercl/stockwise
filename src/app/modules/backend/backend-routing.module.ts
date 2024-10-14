import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddItemComponent } from './pages/add-item/add-item.component';
import { ItemListComponent } from './pages/item-list/item-list.component';
import { ItemDetailComponent } from './pages/item-detail/item-detail.component';

const routes: Routes = [
  { path: 'add-item', component: AddItemComponent },
  { path: 'item-list', component: ItemListComponent },
  { path: 'item-detail/:id', component: ItemDetailComponent } // :id para pasar el ID del ítem
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackendRoutingModule { }
