import { Tecnologia, Proyecto } from './../../../../models/models';
import { DatabaseService, Usuario } from './../../../../services/database.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
// import Chart from 'chart.js/auto';

import { ChartType, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss'],
})
export class PortalComponent implements OnInit {

  login = false;
  info: Usuario | null = null;

  segmentValue = '1';

  categorias: any[] = [];
  productos: any[] = [];


  newHeight = 0;
  rol: any;

  contadorTecnologias!: number;
  contadorProyectos!: number;
  contadorCategorias!: number;
  

  constructor(private database: DatabaseService, private auth: AuthService, private router: Router) {
    this.auth.stateUser().subscribe( res => {
      if (res) {
           this.login = true;
           this.getDatosUsuario(res.uid);
      } else {
        this.login = false;
      }
    });
  }

  ngOnInit(): void {
    this.obtenerCategorias();  // Obtén las categorías al cargar la página
  }

  segmentChanged(event: any) {
    this.segmentValue = event.detail.value;
  }

  getDatosUsuario(uid: string){
    const id = uid;
    this.database.getUsuario(id).subscribe(res=>{
      if(res){
        this.info = res;
        this.rol = res.rol;
      }
    });
  }

  obtenerCategorias() {
    this.database.getCategorias().subscribe(res => {
      this.categorias = res;
    });
  }

  // Función para obtener los productos de la categoría seleccionada
  mostrarProductos(categoriaId: string) {
    // Redirigir a la página de productos pasando el ID de la categoría seleccionada
    this.router.navigate(['/backend/productos', categoriaId]);  // Asegúrate de que la ruta sea la correcta
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
