import { Component, Input, OnInit } from '@angular/core';
import { ModalController, LoadingController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.scss']
})
export class AddUserModalComponent implements OnInit {
  @Input() userData: any;
  @Input() isEditing: boolean = false;
  form!: FormGroup;
  showPasswordMismatchError = false;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private userService: UserService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      nombre_completo: ['', Validators.required],
      rol: ['usuario', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.isEditing ? [] : [Validators.required, Validators.minLength(6)]],
      confirmar_password: ['', this.isEditing ? [] : [Validators.required]]
    });

    if (this.isEditing && this.userData) {
      this.form.patchValue({
        nombre_completo: this.userData.nombre_completo,
        rol: this.userData.rol,
        email: this.userData.email
      });
    } else {
      this.form.setValidators(this.passwordMatchValidator());
    }
  }

  passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('confirmar_password')?.value;
      this.showPasswordMismatchError = password && confirmPassword && password !== confirmPassword;
      return this.showPasswordMismatchError ? { mismatch: true } : null;
    };
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const userData = { ...this.form.value, vigente: true };
    const loading = await this.presentLoading(this.isEditing ? 'Actualizando usuario...' : 'Creando usuario...');

    try {
      if (this.isEditing) {
        this.modalCtrl.dismiss(userData);
        this.presentToast('Usuario actualizado exitosamente', 'success');
      } else {
        await this.userService.createUser(userData);
        this.presentToast('Usuario creado exitosamente', 'success');
        this.modalCtrl.dismiss();
      }
    } catch (error) {
      console.error('Error:', error);
      this.presentToast('Error al procesar el usuario', 'danger');
    } finally {
      loading.dismiss();
    }
  }

  private async presentLoading(message: string) {
    const loading = await this.loadingController.create({
      message,
      spinner: 'crescent',
    });
    await loading.present();
    return loading;
  }

  private async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
    });
    toast.present();
  }
}
