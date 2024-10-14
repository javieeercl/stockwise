import { Tecnologia, Proyecto } from './../../../../models/models';
import { DatabaseService } from './../../../../services/database.service';
import { Usuario } from 'src/app/models/models';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
// import Chart from 'chart.js/auto';


@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss'],
})
export class PortalComponent implements OnInit {

  login = false;
  info: Usuario | null = null;

  segmentValue = '1';

  tecnologias: any[] = [];
  proyectos: any[] = [];

  newHeight = 0;
  rol: any;

  contadorTecnologias!: number;
  contadorProyectos!: number;

  constructor(private database: DatabaseService, private auth: AuthService) {
    this.auth.stateUser().subscribe( res => {
      if (res) {
           this.login = true;
           this.getDatosUsuario(res.uid);
      } else {
        this.login = false;
      }
    });
  }

  ngOnInit() {
    this.getProyecto();
    this.getTecnologia();
  }

  segmentChanged(event: any) {
    this.segmentValue = event.detail.value;
  }

  getDatosUsuario(uid: string){
    const path = 'Usuario';
    const id = uid;
    this.database.getDoc<Usuario>(path, id).subscribe(res=>{
      if(res){
        this.info = res;
        this.rol = res.rol;
      }
    });
  }

  getProyecto(){
    this.database.getCollection('Proyecto').subscribe( res => {

      this.proyectos = res;
      this.contadorProyectos = res.length;
    });
  }

  getTecnologia(){
    this.database.getCollection('Tecnologia').subscribe( res => {
      // lo almacenamos en el arreglo para recorrer con ngFor
      this.tecnologias = res;
      this.contadorTecnologias = res.length;
    });
  }

  scroll(event: { detail: { scrollTop: any; }; }) {
    const value = event.detail.scrollTop;
    // console.log(value, this.newHeight);
    if(value > 40) {
      this.newHeight += 5; // this.newHeight = this.newHeight + 5
    } else {
      this.newHeight = 0;
    }
    if(value > 180 && this.newHeight <= 65) {
      this.newHeight += 50;
    }
  }

}
