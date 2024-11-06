import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent  implements OnInit {

  productos: any[] = [];
  categoriaId: string | null = null;

  constructor(private route: ActivatedRoute, private database: DatabaseService) {}

  ngOnInit(): void {
    // Obtener el ID de la categoría desde la URL
    this.categoriaId = this.route.snapshot.paramMap.get('categoriaId');
    this.obtenerProductos();
  }

  obtenerProductos() {
    // Consultar los productos de la categoría seleccionada en Firestore
    this.database.getCollection(`Categoria/${this.categoriaId}/Producto`).subscribe(res => {
      this.productos = res;
    });
  }
}