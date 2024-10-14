import { enterAnimation } from './animations/nav-animations';

import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';

import { ServiceWorkerModule } from '@angular/service-worker';
import { PublicComponent } from './layout/publico/public/public.component';
import { PrivateComponent } from './layout/privado/private/private.component';
import { ComponentsModule } from './components/components.module';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';



@NgModule({
  declarations: [AppComponent, PublicComponent, PrivateComponent],
  imports: [BrowserModule,   IonicModule.forRoot({
    navAnimation: enterAnimation
  }), AppRoutingModule, ComponentsModule, HttpClientModule, AngularFireModule.initializeApp(
    environment.firebaseConfig
  ),
  AngularFireDatabaseModule,
  AngularFirestoreModule,
  AngularFireAuthModule,
  AngularFireStorageModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
