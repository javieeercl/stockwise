import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AddProductModalComponent } from 'src/app/components/add-product-modal/add-product-modal.component';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {

  productos: any[] = [];
  categoriaId: string = ''; // Asegúrate de que sea una cadena vacía por defecto

  constructor(
    private route: ActivatedRoute,
    private database: DatabaseService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit(): void {
    // Obtener el ID de la categoría desde la URL
    this.categoriaId = this.route.snapshot.paramMap.get('id') || ''; // Cambia 'categoriaId' por 'id' si ese es el nombre del parámetro en la ruta
    this.obtenerProductos();
  }

  obtenerProductos() {
    // Verifica que categoriaId no esté vacío
    if (this.categoriaId) {
      // Utiliza getSubCollection en lugar de getCollection
      this.database.getSubCollection('Categoria', this.categoriaId, 'Producto').subscribe(res => {
        this.productos = res;
      });
    } else {
      console.error('El ID de la categoría no está definido.');
    }
  }

  async agregarProducto() {
    // No es necesario pasar categoriaId como parámetro, ya que está disponible en el contexto
    const modal = await this.modalCtrl.create({
      component: AddProductModalComponent,
      componentProps: { categoriaId: this.categoriaId }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        // Llama al método para agregar el producto en la categoría seleccionada
        this.database.addProductoToCategoria(this.categoriaId, result.data)
          .then(() => {
            console.log('Producto añadido a la categoría');
            this.obtenerProductos(); // Actualiza la lista de productos
          })
          .catch(error => {
            console.error('Error al agregar el producto:', error);
          });
      }
    });

    return await modal.present();
  }
}
