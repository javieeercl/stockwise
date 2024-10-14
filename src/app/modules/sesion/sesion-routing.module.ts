import { ContactoComponent } from './pages/contacto/contacto.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const rutas: Routes = [{
  path:'',children:[

      {path:'contacto',component:ContactoComponent},
      // {path:'inscripcion',component:InscripcionTallerComponent},
      // {path:'postulacion',component:PostularInstructorComponent},
  ]
}];
@NgModule({imports:[RouterModule.forChild(rutas)],
exports:[RouterModule]})
export class SesionRoutingModule{

}
