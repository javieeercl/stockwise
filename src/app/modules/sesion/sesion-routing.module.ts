import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PortalComponent } from './pages/portal/portal.component';

const rutas: Routes = [{
  path:'',children:[

      {path:'portal',component:PortalComponent}
      // {path:'inscripcion',component:InscripcionTallerComponent},
      // {path:'postulacion',component:PostularInstructorComponent},
  ]
}];
@NgModule({imports:[RouterModule.forChild(rutas)],
exports:[RouterModule]})
export class SesionRoutingModule{

}
