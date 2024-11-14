import { ResetComponent } from './pages/reset/reset.component';
import { ComponentsModule } from './../../components/components.module';
import { IonicModule } from '@ionic/angular';
import { LoginComponent } from './pages/login/login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecuperacionComponent } from './pages/recuperacion/recuperacion.component';
import { BaseChartDirective } from 'ng2-charts';


@NgModule({
  declarations: [LoginComponent, RecuperacionComponent, ResetComponent],
  imports: [
    IonicModule,
    CommonModule,
    ComponentsModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BaseChartDirective
  ]
})
export class AuthModule { }
