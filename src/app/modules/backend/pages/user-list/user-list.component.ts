import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AddUserModalComponent } from 'src/app/components/add-user-modal/add-user-modal.component';
import { DatabaseService, Usuario } from 'src/app/services/database.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  usuarios: Usuario[] = [];

  constructor(
    private database: DatabaseService,
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  async obtenerUsuarios() {
    const loading = await this.loadingController.create({
      message: 'Cargando Usuarios...',
      spinner: 'crescent',
    });
    await loading.present();

    this.database.getUsuarios().subscribe(
      (res) => {
        this.usuarios = res;
        loading.dismiss();
      },
      (error) => {
        loading.dismiss();
        this.presentToast('Error al cargar usuarios', 'danger');
      }
    );
  }

  async openAddUserModal() {
    const modal = await this.modalCtrl.create({
      component: AddUserModalComponent,
      componentProps: { isEditing: false }
    });

    modal.onDidDismiss().then(() => {
      this.obtenerUsuarios(); // Refresca la lista después de cerrar el modal
    });

    return await modal.present();
  }

  async editUser(user: Usuario) {
    const modal = await this.modalCtrl.create({
      component: AddUserModalComponent,
      componentProps: { isEditing: true, userData: user }
    });

    modal.onDidDismiss().then(() => {
      this.obtenerUsuarios(); // Refresca la lista después de cerrar el modal
    });

    return await modal.present();
  }

  async confirmDeleteUser(uid: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar este usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Eliminando usuario...',
              spinner: 'crescent',
            });
            await loading.present();

            this.database.deleteUsuario(uid).then(
              () => {
                loading.dismiss();
                this.presentToast('Usuario eliminado con éxito', 'success');
                this.obtenerUsuarios(); // Actualiza la lista de usuarios
              },
              (error) => {
                loading.dismiss();
                this.presentToast('Error al eliminar usuario', 'danger');
              }
            );
          }
        }
      ]
    });

    await alert.present();
  }

  private async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color
    });
    toast.present();
  }
}
