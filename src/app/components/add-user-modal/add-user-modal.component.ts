// src/app/components/add-user-modal/add-user-modal.component.ts

import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.scss']
})
export class AddUserModalComponent {
  form: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nombre_completo: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['usuario', Validators.required], // Valor predeterminado: usuario
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async onSubmit() {
    if (this.form.valid) {
      const { email, nombre_completo, password, rol } = this.form.value;
      const userData = {
        email,
        nombre_completo,
        password,
        rol,
        vigente: true, // Se asigna automáticamente como true
      };

      try {
        await this.userService.createUser(userData);
        this.modalCtrl.dismiss();
        // Muestra un mensaje de éxito (agrega un toast si deseas)
      } catch (error) {
        console.error('Error al crear el usuario:', error);
        // Muestra un mensaje de error
      }
    }
  }
}
