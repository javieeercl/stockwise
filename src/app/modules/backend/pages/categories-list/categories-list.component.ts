import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { AddCategoryModalComponent } from 'src/app/components/add-category-modal/add-category-modal.component';
import { DatabaseService, Categoria } from 'src/app/services/database.service';
import { InteractionsService } from 'src/app/services/interactions.service';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
})
export class CategoriesListComponent implements OnInit {
  categorias: Categoria[] = [];

  constructor(
    private database: DatabaseService,
    private router: Router,
    private modalCtrl: ModalController,
    private interaction: InteractionsService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit(): void {
    this.obtenerCategorias();
  }

  async showLoading(message: string) {
    const loading = await this.loadingController.create({
      message,
      spinner: 'crescent',
    });
    await loading.present();
    return loading;
  }

  async obtenerCategorias() {
    const loading = await this.showLoading('Cargando categorías...');
    this.database.getCategorias().subscribe((res) => {
      this.categorias = res;
      loading.dismiss();
    });
  }

  async openAddCategoryModal() {
    const modal = await this.modalCtrl.create({
      component: AddCategoryModalComponent,
      componentProps: { isEditing: false }
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        const loading = await this.showLoading('Creando categoría...');
        this.database.createCategoria(result.data)
          .then(() => {
            this.obtenerCategorias();
            this.interaction.presentToast('Categoría creada con éxito', 'success');
          })
          .catch(() => this.interaction.presentToast('No se pudo crear la categoría', 'danger'))
          .finally(() => loading.dismiss());
      }
    });

    return await modal.present();
  }

  async openAddCategoryModalWithData(category: Categoria) {
    const modal = await this.modalCtrl.create({
      component: AddCategoryModalComponent,
      componentProps: { categoriaId: category.id, categoriaData: category, isEditing: true }
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        const loading = await this.showLoading('Actualizando categoría...');
        this.database.updateCategoria(category.id!, result.data)
          .then(() => {
            this.obtenerCategorias();
            this.interaction.presentToast('Categoría actualizada con éxito', 'success');
          })
          .catch(() => this.interaction.presentToast('No se pudo actualizar la categoría', 'danger'))
          .finally(() => loading.dismiss());
      }
    });

    return await modal.present();
  }

  mostrarProductos(categoriaId: string) {
    this.router.navigate(['/backend/productos', categoriaId]);
  }

  editCategory(category: Categoria) {
    this.openAddCategoryModalWithData(category);
  }

  async confirmDeleteCategory(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar esta categoría?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Sí',
          handler: async () => {
            const loading = await this.showLoading('Eliminando categoría...');
            this.database.deleteCategoria(id)
              .then(() => {
                this.obtenerCategorias();
                this.interaction.presentToast('Categoría eliminada con éxito', 'success');
              })
              .catch(() => this.interaction.presentToast('No se pudo eliminar la categoría', 'danger'))
              .finally(() => loading.dismiss());
          }
        }
      ]
    });

    await alert.present();
  }
}
