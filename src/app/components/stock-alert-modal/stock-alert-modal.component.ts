import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-stock-alert-modal',
  templateUrl: './stock-alert-modal.component.html',
  styleUrls: ['./stock-alert-modal.component.scss'],
})
export class StockAlertModalComponent {
  @Input() productosCriticos: any[] = [];
  @Input() productosBajos: any[] = [];

  constructor(private modalCtrl: ModalController) {}

  cerrarModal() {
    this.modalCtrl.dismiss();
  }
}
