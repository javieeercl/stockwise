import { enterAnimation } from './../../animations/nav-animations';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SesionRoutingModule } from './sesion-routing.module';
import { PortalComponent } from './pages/portal/portal.component';
import { ComponentsModule } from 'src/app/components/components.module';



@NgModule({
  declarations: [PortalComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule.forRoot({
      navAnimation: enterAnimation
    }),
    ReactiveFormsModule,
    SesionRoutingModule
  ]
})
export class SesionModule { }
