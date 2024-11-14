import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { InteractionsService } from 'src/app/services/interactions.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  form: FormGroup;

  constructor(
    public alertController: AlertController,
    private auth: AuthService,
    private interaction: InteractionsService,
    private router: Router,
    private fb: FormBuilder
    )
    {
      this.form = this.fb.group({
        email: ['', [Validators.email, Validators.required]],
        password: ['', [Validators.required]],
      });
      this.form.reset();
    }

    get email(): any {
      return this.form.get('email');
    }
    get password(): any {
      return this.form.get('password');
    }

  async onSubmit(){
    if(this.form.valid){
      await this.interaction.showLoading('Iniciando Sesión...');
      const { email, password } = this.form.value;

      await this.auth.login(email, password).then((response) => {
        this.interaction.closeLoading();
        this.form.reset();
        this.interaction.presentToast('Sesión Iniciada', 'success');
        this.router.navigate(['/privado/portal']);
      }).catch(err => {
        this.interaction.closeLoading();
        console.log(err);

      });
    }  else {
      this.interaction.presentAlert('Formulario inválido', 'Datos incorrectos o incompletos', '', 'Ok');
    }
  }
}
