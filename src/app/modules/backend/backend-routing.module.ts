import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemListComponent } from './pages/item-list/item-list.component';
import { ItemDetailComponent } from './pages/item-detail/item-detail.component';
import { PanelAdminComponent } from './pages/panel-admin/panel-admin.component';
import { CategoriesListComponent } from './pages/categories-list/categories-list.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { UserListComponent } from './pages/user-list/user-list.component';

const routes: Routes = [
  { path: 'item-list', component: ItemListComponent },
  { path: 'item-detail/:id', component: ItemDetailComponent }, // :id para pasar el ID del ítem
  { path: 'panel-admin', component: PanelAdminComponent },
  { path: 'admin-categoria', component: CategoriesListComponent },
  { path: 'productos/:id', component: ProductListComponent },
  { path: 'admin-user', component: UserListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackendRoutingModule { }
