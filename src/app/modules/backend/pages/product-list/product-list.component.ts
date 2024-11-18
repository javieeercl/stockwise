import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { AddProductModalComponent } from 'src/app/components/add-product-modal/add-product-modal.component';
import { StockAlertModalComponent } from 'src/app/components/stock-alert-modal/stock-alert-modal.component';
import { DatabaseService, Producto } from 'src/app/services/database.service';
import { InteractionsService } from 'src/app/services/interactions.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  nombreCategoria: string = '';
  productos: Producto[] = [];
  categoriaId: string = '';
  STOCK_UMBRAL_BAJO!: number;

  activeModal: HTMLIonModalElement | null = null; // Variable para rastrear el modal activo
  isAlertModalOpen: boolean = false; // Bandera para evitar que se abran múltiples modales de alerta

  constructor(
    private route: ActivatedRoute,
    private database: DatabaseService,
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private interaction: InteractionsService
  ) {
    this.STOCK_UMBRAL_BAJO = 10;
  }

  async showLoading(message: string) {
    const loading = await this.loadingController.create({
      message,
      spinner: 'crescent',
    });
    await loading.present();
    return loading;
  }

  async closeActiveModal() {
    if (this.activeModal) {
      await this.activeModal.dismiss(); // Cierra el modal activo
      this.activeModal = null;
    }
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
      async (res: Producto[]) => {
        this.productos = res.map((producto) => ({
          ...producto,
          isLowStock: producto.stock < this.STOCK_UMBRAL_BAJO, // Identificar si el stock es bajo
        }));
        loading.dismiss();

        // Mostrar alertas después de cargar productos
        await this.mostrarAlertasDeStock();
      },
      (error) => {
        loading.dismiss();
        this.interaction.presentToast('Error al cargar productos', 'danger');
      }
    );
  }

  async mostrarAlertasDeStock() {
    if (this.isAlertModalOpen) {
      return; // Evita abrir múltiples modales de alerta
    }

    const productosCriticos = this.productos.filter((p) => p.stock < 5);
    const productosBajos = this.productos.filter((p) => p.stock >= 5 && p.stock < 10);

    if (productosCriticos.length || productosBajos.length) {
      this.isAlertModalOpen = true; // Marcar que el modal está abierto

      const modal = await this.modalCtrl.create({
        component: StockAlertModalComponent,
        componentProps: {
          productosCriticos,
          productosBajos,
        },
      });

      this.activeModal = modal; // Guardar referencia al modal activo
      modal.onDidDismiss().then(() => {
        this.isAlertModalOpen = false; // Resetear la bandera al cerrar el modal
      });

      await modal.present();
    }
  }

  async agregarProducto() {
    await this.closeActiveModal(); // Cerrar cualquier modal activo antes de abrir el nuevo

    const modal = await this.modalCtrl.create({
      component: AddProductModalComponent,
      componentProps: { categoriaId: this.categoriaId, isEditing: false },
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        const loading = await this.showLoading('Agregando producto...');
        this.database
          .addProductoToCategoria(this.categoriaId, result.data)
          .then(() => {
            this.obtenerProductos();
            this.interaction.presentToast('Producto agregado con éxito', 'success');
          })
          .catch(() => this.interaction.presentToast('No se pudo agregar el producto', 'danger'))
          .finally(() => loading.dismiss());
      }
    });

    this.activeModal = modal; // Guardar referencia al modal activo
    return await modal.present();
  }

  async editarProducto(product: Producto) {
    await this.closeActiveModal(); // Cerrar cualquier alerta de stock antes de abrir el modal de edición

    const modal = await this.modalCtrl.create({
      component: AddProductModalComponent,
      componentProps: { categoriaId: this.categoriaId, productData: product, isEditing: true },
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        const loading = await this.showLoading('Actualizando producto...');
        this.database
          .updateProducto(this.categoriaId, product.id!, result.data)
          .then(() => {
            this.obtenerProductos(); // Actualiza la lista de productos
            this.interaction.presentToast('Producto actualizado con éxito', 'success');
          })
          .catch(() => this.interaction.presentToast('No se pudo actualizar el producto', 'danger'))
          .finally(() => loading.dismiss());
      }
    });

    this.activeModal = modal; // Guardar referencia al modal activo
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
            this.database
              .deleteProducto(this.categoriaId, id)
              .then(() => {
                this.obtenerProductos();
                this.interaction.presentToast('Producto eliminado con éxito', 'success');
              })
              .catch(() => this.interaction.presentToast('No se pudo eliminar el producto', 'danger'))
              .finally(() => loading.dismiss());
          },
        },
      ],
    });

    await alert.present();
  }
}
