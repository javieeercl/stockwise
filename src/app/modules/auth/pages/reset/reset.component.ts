import { InteractionsService } from './../../../../services/interactions.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../../../../services/auth.service';
import { ValidatorFn, AbstractControl, ValidationErrors, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

const checkPasswords: ValidatorFn = (
  group: AbstractControl
): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { notEqual: true };
};

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetComponent implements OnInit {

  form: FormGroup;
  oobCode: string | null;
  mode: string | null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private interaction: InteractionsService
  ) {
    // Creación del formulario
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    }, { validators: checkPasswords });

    // Obtener los parámetros oobCode y mode de la URL
    this.oobCode = this.route.snapshot.queryParamMap.get('oobCode');
    this.mode = this.route.snapshot.queryParamMap.get('mode');
  }

  ngOnInit() {
    // Verificar que se obtuvo el oobCode y el modo es de resetPassword
    if (!this.oobCode || this.mode !== 'resetPassword') {
      // Redirigir al login si no es válido
      this.router.navigate(['/publico/login']);
    } else {
      this.interaction.presentAlert('Ingresa tu nueva clave', '', '', 'Ok');
    }
    this.form.reset();
  }

  get password() {
    return this.form.get('password');
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  async onSubmit() {
    if (this.form.valid && this.oobCode) {
      const res = await this.interaction.presentAlert('Cambiar Contraseña', '¿Desea guardar los cambios?', 'No', 'Si');
      if (res) {
        await this.interaction.showLoading('Modificando...');
        const { password } = this.form.value;

        // Llamada al método para cambiar la contraseña usando el oobCode
        await this.auth.passwordReset(password, this.oobCode).then((response) => {
          this.interaction.closeLoading();
          this.interaction.presentToast('Contraseña modificada con éxito');
          this.form.reset();
          this.router.navigate(['/publico/login']);
        }).catch(err => {
          this.interaction.closeLoading();
          this.interaction.presentAlert('Error', 'Hubo un problema al cambiar la contraseña', '', 'Ok');
        });
      }
    } else {
      this.interaction.presentAlert('Formulario inválido', 'Datos incorrectos o incompletos', '', 'Ok');
    }
  }

}
