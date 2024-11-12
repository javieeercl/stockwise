import { Component, Input, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-product-modal',
  templateUrl: './add-product-modal.component.html',
  styleUrls: ['./add-product-modal.component.scss']
})
export class AddProductModalComponent implements OnInit {
  @Input() categoriaId!: string; // ID de la categoría
  @Input() productData: any; // Datos del producto en caso de edición
  @Input() isEditing: boolean = false; // Indica si estamos en modo de edición

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
      precio: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      imagenUrl: ['']
    });
  }

  ngOnInit() {
    // Si hay datos del producto, los cargamos en el formulario para la edición
    if (this.productData) {
      this.form.patchValue({
        nombre: this.productData.nombre,
        precio: this.productData.precio,
        stock: this.productData.stock,
        imagenUrl: this.productData.imagenUrl
      });
      this.imageUrl = this.productData.imagenUrl; // Mostrar la imagen existente
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
      // Muestra el loading de inmediato
      const loading = await this.showLoading(this.isEditing ? 'Actualizando producto...' : 'Creando producto...');
      
      if (this.imageFile) {
        const filePath = `Producto/${new Date().getTime()}_${this.imageFile.name}`;
        const fileRef = this.storage.ref(filePath);
        const uploadTask = this.storage.upload(filePath, this.imageFile);

        // Observa el proceso de carga de la imagen
        uploadTask.snapshotChanges()
          .pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe(
                (url) => {
                  this.imageUrl = url;
                  this.submitFormData(loading); // Envía los datos cuando la imagen esté cargada
                },
                (error) => {
                  console.error('Error al obtener la URL de la imagen: ', error);
                  loading.dismiss(); // Cierra el loading si hay un error
                }
              );
            })
          ).subscribe();
      } else {
        // Si no hay una nueva imagen, envía los datos del formulario directamente
        this.submitFormData(loading);
      }
    }
  }

  submitFormData(loading: HTMLIonLoadingElement) {
    const formData = {
      ...this.form.value,
      imagenUrl: this.imageUrl // Guarda la URL de la imagen si existe
    };
    this.modalCtrl.dismiss(formData); // Envía los datos al componente padre
    loading.dismiss(); // Cierra el loading
  }
}
