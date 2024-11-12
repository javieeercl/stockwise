import { InteractionsService } from './../../../../services/interactions.service';
import { Router } from '@angular/router';
import { AuthService } from './../../../../services/auth.service';
import { Usuario } from './../../../../models/models';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { formatDate } from "@angular/common";
import { DatabaseService } from 'src/app/services/database.service';
import { StorageService } from 'src/app/services/storage.service';

const checkPasswords: ValidatorFn = (
  group: AbstractControl
): ValidationErrors | null => {
  const password = group.get('password')?.value
  const confirmPassword = group.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { notEqual: true};
};

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent implements OnInit {

  form: FormGroup;
  data: Usuario = {
    email: '',
    password: '',
    uid: '',
    rol: '',
    nombre_completo: '',
    vigente: false
  }

  selectedFile: any;
  fileSelected = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private database: DatabaseService,
    private router: Router,
    private interaction: InteractionsService
    )
  {
    this.form = this.fb.group({
      nombre_completo: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, {validators: checkPasswords});
  }

  ngOnInit(): void {
    this.form.reset();
  }

  ngOnDestroy(): void {

  }

  get nombre_completo(): any {
    return this.form.get('nombre_completo');
  }
  get email(): any {
    return this.form.get('email');
  }
  get password(): any {
    return this.form.get('password');
  }
  get confirmPassword(): any {
    return this.form.get('confirmPassword');
  }
  get imagen(): any {
    return this.form.get('imagen');
  }

  chooseFile(event: { target: { files: any[]; }; }){
    this.selectedFile = event.target.files[0];
  }

  async onSubmit(){
    if(this.form.valid){
      await this.interaction.showLoading('Registrando...');


      const { email, password, nombre_completo } = this.form.value;

      const res = await this.auth.registrarUser(email, password)
        .catch(error => {
          this.interaction.closeLoading();
        })

        if (res){
          const path = 'Usuario';

          const id = res.user?.uid || '';
          this.data.nombre_completo = nombre_completo;
          this.data.email = email
          this.data.uid = id;
          this.data.rol = 'usuario';
          this.data.password = '';
          this.data.vigente = true;

          await this.database.createUsuario(this.data).then(() => {

            this.form.reset();
            this.auth.logout();
            this.interaction.closeLoading();
            this.interaction.presentToast('Registrado con exito', 'success');
            this.router.navigate(['/publico/login'])

          });
        }
    } else {
      this.interaction.presentAlert('Formulario inválido', 'Datos incorrectos o incompletos', '', 'Ok');
    }
  }
}
