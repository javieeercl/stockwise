import { Router } from '@angular/router';
import { AuthService } from './../../../../services/auth.service';
import { InteractionsService } from './../../../../services/interactions.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recuperacion',
  templateUrl: './recuperacion.component.html',
  styleUrls: ['./recuperacion.component.scss'],
})
export class RecuperacionComponent {

  form: FormGroup;

  constructor(
    private interaction: InteractionsService,
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
    )
    {
    this.form = this.fb.group({
      email: ['', [Validators.email, Validators.required]]
    });
    this.form.reset();
   }

   get email(): any {
    return this.form.get('email');
  }


  async onSubmit(){
    if(this.form.valid){
      const res = await this.interaction.presentAlert('Enviando Correo', 'Te enviaremos un correo de recuperación', '', 'Ok');
        if (res) {
          await this.interaction.showLoading('Enviando...');
          const { email } = this.form.value;
          await this.auth.requestPassword(email).then(() => {
            this.form.reset();
            this.interaction.closeLoading();
            this.interaction.presentToast('Correo enviado con exito');
            this.router.navigate(['/publico/login']);
          }).catch(err => {
            this.interaction.closeLoading();
          });
        }
    }  else {
      this.interaction.presentAlert('Formulario inválido', 'Datos incorrectos o incompletos', '', 'Ok');
    }
  }
}
