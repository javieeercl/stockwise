import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PublicComponent } from './layout/publico/public/public.component';
import { PrivateComponent } from './layout/privado/private/private.component';
import { AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';


const routes: Routes = [
  {
    path: 'publico', component: PublicComponent,
    loadChildren:() => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'privado', component: PrivateComponent,
    loadChildren:() => import('./modules/sesion/sesion.module').then(m => m.SesionModule)
  },
  {
    path: 'backend', component: PrivateComponent,
    loadChildren:() => import('./modules/backend/backend.module').then(m => m.BackendModule)
  },
  {
    path: '',
    redirectTo: 'publico/login',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
