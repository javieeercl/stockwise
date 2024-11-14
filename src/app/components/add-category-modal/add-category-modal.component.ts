import { Component, Input, OnInit } from '@angular/core';
import { ModalController, LoadingController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-category-modal',
  templateUrl: './add-category-modal.component.html',
  styleUrls: ['./add-category-modal.component.scss']
})
export class AddCategoryModalComponent implements OnInit {
  @Input() categoriaId!: string;
  @Input() categoriaData: any;
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
      nombre: [
        '', 
        [
          Validators.required, 
          Validators.minLength(3), 
          Validators.maxLength(50), 
          Validators.pattern('^[a-zA-Z0-9 ]+$')
        ]
      ],
      imagenUrl: ['']
    });
  }

  ngOnInit() {
    if (this.categoriaData) {
      this.form.patchValue({
        nombre: this.categoriaData.nombre,
        imagenUrl: this.categoriaData.imagenUrl
      });
      this.imageUrl = this.categoriaData.imagenUrl;
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  chooseFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      const validExtensions = ['image/png', 'image/jpeg'];
      if (!validExtensions.includes(file.type)) {
        this.presentToast('Formato de archivo no permitido. Solo se aceptan imágenes PNG o JPG.', 'danger');
        this.selectedFileName = 'Sin archivo seleccionado';
        this.imageFile = null;
      } else {
        this.selectedFileName = file.name;
        this.imageFile = file;
      }
    } else {
      this.selectedFileName = 'Sin archivo seleccionado';
    }
  }

  async showLoading(message: string) {
    const loading = await this.loadingController.create({
      message,
      spinner: 'crescent',
    });
    await loading.present();
    return loading;
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
    });
    toast.present();
  }

  async onSubmit() {
    if (this.form.valid) {
      const loading = await this.showLoading(this.isEditing ? 'Actualizando categoría...' : 'Creando categoría...');

      if (this.imageFile) {
        const filePath = `Categoria/${new Date().getTime()}_${this.imageFile.name}`;
        const fileRef = this.storage.ref(filePath);
        const uploadTask = this.storage.upload(filePath, this.imageFile);

        uploadTask.snapshotChanges()
          .pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe(
                (url) => {
                  this.imageUrl = url;
                  this.submitFormData(loading);
                },
                (error) => {
                  console.error('Error al obtener la URL de la imagen: ', error);
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
  }

  submitFormData(loading: HTMLIonLoadingElement) {
    const formData = {
      ...this.form.value,
      ...(this.imageUrl ? { imagenUrl: this.imageUrl } : {})
    };
    this.modalCtrl.dismiss(formData);
    loading.dismiss();
    this.presentToast(this.isEditing ? 'Categoría actualizada con éxito' : 'Categoría creada con éxito', 'success');
  }
}
