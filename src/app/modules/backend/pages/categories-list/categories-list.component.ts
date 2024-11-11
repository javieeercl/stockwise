import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AddCategoryModalComponent } from 'src/app/components/add-category-modal/add-category-modal.component';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
})
export class CategoriesListComponent implements OnInit {
  categorias: any[] = [];

  constructor(private database: DatabaseService, private router: Router, private modalCtrl: ModalController) {}

  ngOnInit(): void {
    this.obtenerCategorias();
  }

  obtenerCategorias() {
    this.database.getCollection('Categoria').subscribe(res => {
      this.categorias = res;
    });
  }

  async openAddCategoryModal() {
    const modal = await this.modalCtrl.create({
      component: AddCategoryModalComponent
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        // Agregar la categoría a la base de datos usando DatabaseService
        this.database.createCategoria(result.data).then(() => {
          this.obtenerCategorias();  // Actualiza la lista de categorías
        });
      }
    });

    return await modal.present();
  }

  mostrarProductos(categoriaId: string) {
    this.router.navigate(['/backend/productos', categoriaId]);
  }
}
