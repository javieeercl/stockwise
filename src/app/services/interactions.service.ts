import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class InteractionsService {

  loading: any;

  constructor(public toastController: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
  }

  async presentToast(mensaje: string, p0: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: 'success'
    });

    toast.present();
  }

  async presentToastWithOptions(options: any) {
    const toast = await this.toastController.create({
      message: options.message,
      position: options.position || 'bottom',
      cssClass: options.cssClass || '', // Permitir la clase personalizada
      buttons: options.buttons || [],
      duration: options.duration || undefined, // Sin duración para cierre manual
    });
    return toast;
  }
  
  async toastError(error: any) {
    const toast = await this.toastController.create({
      message:
      (error.message as string).split(': ')[1] || 'Ocurrio un error',
      duration: 4000,
      color: 'danger'
    });

    toast.present();
  }

  async showLoading(mensaje: string) {
    this.loading = await this.loadingCtrl.create({
      message: mensaje,
      cssClass: 'custom-loading',
    });

    await this.loading.present();
  }

  async closeLoading() {
    await this.loading.dismiss();
  }

  async presentAlert(headerText: string, messageText: string, cancelText: string, confirmText: string){

    let aceptar = false;


    const alert = await this.alertCtrl.create({
    header: headerText,
    message: messageText,
    buttons: [
      {
        text: cancelText,
        role: 'cancel',
        cssClass: 'secondary',
      },
      {
        text: confirmText,
        handler: () => {
          aceptar = true;
        }
      }
    ]
  });
  await alert.present();
  await alert.onDidDismiss();
  return aceptar;
  }
}
