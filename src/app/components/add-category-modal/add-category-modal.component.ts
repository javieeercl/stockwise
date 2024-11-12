import { Component, Input, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
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

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private storage: AngularFireStorage,
    private loadingController: LoadingController // Inyecta el controlador de loading
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      imagenUrl: [''],
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
      this.imageFile = file;
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
      imagenUrl: this.imageUrl
    };
    this.modalCtrl.dismiss(formData);
    loading.dismiss();
  }
}
