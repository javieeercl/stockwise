import { enterAnimation } from './../../animations/nav-animations';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SesionRoutingModule } from './sesion-routing.module';



@NgModule({
  declarations: [ContactoComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot({
      navAnimation: enterAnimation
    }),
    ReactiveFormsModule,
    SesionRoutingModule
  ]
})
export class SesionModule { }
