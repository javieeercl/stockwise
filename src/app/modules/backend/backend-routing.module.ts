import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddItemComponent } from './pages/add-item/add-item.component';
import { ItemListComponent } from './pages/item-list/item-list.component';
import { ItemDetailComponent } from './pages/item-detail/item-detail.component';
import { PanelAdminComponent } from './pages/panel-admin/panel-admin.component';
import { CategoriesListComponent } from './pages/categories-list/categories-list.component';
import { ProductListComponent } from './pages/product-list/product-list.component';

const routes: Routes = [
  { path: 'add-item', component: AddItemComponent },
  { path: 'item-list', component: ItemListComponent },
  { path: 'item-detail/:id', component: ItemDetailComponent }, // :id para pasar el ID del ítem
  { path: 'panel-admin', component: PanelAdminComponent },
  { path: 'categorias', component: CategoriesListComponent },
  { path: 'productos/:categoriaId', component: ProductListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackendRoutingModule { }
