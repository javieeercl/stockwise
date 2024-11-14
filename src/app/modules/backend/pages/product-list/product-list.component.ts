import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { AddProductModalComponent } from 'src/app/components/add-product-modal/add-product-modal.component';
import { DatabaseService, Producto } from 'src/app/services/database.service';
import { InteractionsService } from 'src/app/services/interactions.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  nombreCategoria: string = ''; // Nombre de la categoría
  productos: Producto[] = [];
  categoriaId: string = '';

  constructor(
    private route: ActivatedRoute,
    private database: DatabaseService,
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private interaction: InteractionsService
  ) {}

  async showLoading(message: string) {
    const loading = await this.loadingController.create({
      message,
      spinner: 'crescent',
    });
    await loading.present();
    return loading;
  }

  ngOnInit(): void {
    this.categoriaId = this.route.snapshot.paramMap.get('id') || '';

    this.database.getCategoria(this.categoriaId).subscribe((categoria) => {
      if (categoria) {
        this.nombreCategoria = categoria.nombre;
      } else {
        this.interaction.presentToast('Categoría no encontrada', 'danger');
      }
    });

    this.obtenerProductos();
  }

  async obtenerProductos() {
    const loading = await this.showLoading('Cargando productos...');
    this.database.getProductos(this.categoriaId).subscribe(
      (res: Producto[]) => {
        this.productos = res;
        loading.dismiss();
      },
      (error) => {
        loading.dismiss();
        this.interaction.presentToast('Error al cargar productos', 'danger');
      }
    );
  }

  async agregarProducto() {
    const modal = await this.modalCtrl.create({
      component: AddProductModalComponent,
      componentProps: { categoriaId: this.categoriaId, isEditing: false }
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        const loading = await this.showLoading('Agregando producto...');
        this.database.addProductoToCategoria(this.categoriaId, result.data)
          .then(() => {
            this.obtenerProductos();
            this.interaction.presentToast('Producto agregado con éxito', 'success');
          })
          .catch(() => this.interaction.presentToast('No se pudo agregar el producto', 'danger'))
          .finally(() => loading.dismiss());
      }
    });

    return await modal.present();
  }

  async editarProducto(product: Producto) {
    const modal = await this.modalCtrl.create({
      component: AddProductModalComponent,
      componentProps: { categoriaId: this.categoriaId, productData: product, isEditing: true }
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        const loading = await this.showLoading('Actualizando producto...');
        this.database.updateProducto(this.categoriaId, product.id!, result.data)
          .then(() => {
            this.obtenerProductos();
            this.interaction.presentToast('Producto actualizado con éxito', 'success');
          })
          .catch(() => this.interaction.presentToast('No se pudo actualizar el producto', 'danger'))
          .finally(() => loading.dismiss());
      }
    });

    return await modal.present();
  }

  async confirmDeleteProduct(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar este producto?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Sí',
          handler: async () => {
            const loading = await this.showLoading('Eliminando producto...');
            this.database.deleteProducto(this.categoriaId, id)
              .then(() => {
                this.obtenerProductos();
                this.interaction.presentToast('Producto eliminado con éxito', 'success');
              })
              .catch(() => this.interaction.presentToast('No se pudo eliminar el producto', 'danger'))
              .finally(() => loading.dismiss());
          }
        }
      ]
    });

    await alert.present();
  }
}
