import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddUserModalComponent } from 'src/app/components/add-user-modal/add-user-modal.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {

  constructor(private modalCtrl: ModalController) {}

  async openAddUserModal() {
    const modal = await this.modalCtrl.create({
      component: AddUserModalComponent
    });
    return await modal.present();
  }
}
