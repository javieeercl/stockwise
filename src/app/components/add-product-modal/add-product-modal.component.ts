import { Component, Input, OnInit } from '@angular/core';
import { ModalController, LoadingController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-product-modal',
  templateUrl: './add-product-modal.component.html',
  styleUrls: ['./add-product-modal.component.scss']
})
export class AddProductModalComponent implements OnInit {
  @Input() categoriaId!: string;
  @Input() productData: any;
  @Input() isEditing: boolean = false;

  form: FormGroup;
  imageFile: File | null = null;
  imageUrl: string | null = null;
  selectedFileName: string = 'Sin archivo seleccionado';

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private storage: AngularFireStorage,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      precio: [1, [Validators.required, Validators.min(1)]],
      stock: [1, [Validators.required, Validators.min(0), Validators.max(10000)]],
      imagenUrl: ['']
    });
  }  

  ngOnInit() {
    if (this.productData) {
      this.form.patchValue({
        nombre: this.productData.nombre,
        precio: this.productData.precio,
        stock: this.productData.stock,
        imagenUrl: this.productData.imagenUrl
      });
      this.imageUrl = this.productData.imagenUrl;
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  chooseFile(event: any) {
    const file = event.target.files[0];
    if (file && ['image/png', 'image/jpeg'].includes(file.type)) {
      this.selectedFileName = file.name;
      this.imageFile = file;
    } else {
      this.presentToast('Formato de archivo no permitido. Solo se aceptan imágenes PNG o JPG.', 'danger');
      this.selectedFileName = 'Sin archivo seleccionado';
      this.imageFile = null;
    }
  }

  async onSubmit() {
    if (this.form.invalid) return;

    const loading = await this.showLoading(this.isEditing ? 'Actualizando producto...' : 'Creando producto...');

    if (this.imageFile) {
      const filePath = `Producto/${new Date().getTime()}_${this.imageFile.name}`;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, this.imageFile);

      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(
            (url) => {
              this.imageUrl = url;
              this.submitFormData(loading);
            },
            () => {
              loading.dismiss();
              this.presentToast('Error al subir la imagen', 'danger');
            }
          );
        })
      ).subscribe();
    } else {
      this.submitFormData(loading);
    }
  }

  submitFormData(loading: HTMLIonLoadingElement) {
    const formData = {
      ...this.form.value,
      ...(this.imageUrl ? { imagenUrl: this.imageUrl } : {})
    };

    this.modalCtrl.dismiss(formData);
    loading.dismiss();
    this.presentToast(this.isEditing ? 'Producto actualizado con éxito' : 'Producto creado con éxito', 'success');
  }

  async showLoading(message: string) {
    const loading = await this.loadingController.create({ message, spinner: 'crescent' });
    await loading.present();
    return loading;
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({ message, duration: 2000, color });
    toast.present();
  }
}
