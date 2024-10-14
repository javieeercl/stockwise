import { ResetComponent } from './pages/reset/reset.component';
import { PortalComponent } from './pages/portal/portal.component';
import { ComponentsModule } from './../../components/components.module';
import { IonicModule } from '@ionic/angular';
import { LoginComponent } from './pages/login/login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing-module';
import { RegistroComponent } from './pages/registro/registro.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecuperacionComponent } from './pages/recuperacion/recuperacion.component';

@NgModule({
  declarations: [LoginComponent, PortalComponent, RegistroComponent, RecuperacionComponent, ResetComponent],
  imports: [
    IonicModule,
    CommonModule,
    ComponentsModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
