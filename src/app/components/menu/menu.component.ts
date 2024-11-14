import { DatabaseService, Usuario } from './../../services/database.service';
import { InteractionsService } from './../../services/interactions.service';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {

  uid: string | undefined ;
  info: Usuario | undefined;

  login = false;
  rol: any;

  constructor(
    public alertController: AlertController,
    private auth: AuthService,
    private interaction: InteractionsService,
    private database: DatabaseService,
    private router: Router) {
      this.auth.stateUser().subscribe( res => {
        if (res) {
             this.login = true;
             this.getDatosUsuario(res.uid);
        } else {
          this.login = false;
        }
      });
    }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Salir',
      message: '¿Quieres cerrar sesión?',
      buttons: [
        {
          text: 'No',
          handler: () => {

          }
        }, {
          text: 'Si',
          handler: () => {
            this.auth.logout();
            this.interaction.presentToast('Sesión Finalizada', 'success');
            this.router.navigate(['/privado/portal'])
          }
        }
      ]
    });

    await alert.present();
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

}
