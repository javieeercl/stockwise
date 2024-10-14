import { ResetComponent } from './pages/reset/reset.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { PortalComponent } from './pages/portal/portal.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './pages/login/login.component';
import { RecuperacionComponent } from './pages/recuperacion/recuperacion.component';

const rutas: Routes = [{
  path:'',children:[
      {path:'login',component:LoginComponent},
      {path:'registro',component:RegistroComponent},
      {path:'recuperacion',component:RecuperacionComponent},
      {path:'portal',component:PortalComponent},
      {path:'reset',component:ResetComponent},
  ]
}];

@NgModule({imports:[RouterModule.forChild(rutas)],
exports:[RouterModule]})
export class AuthRoutingModule{

}
