import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent implements OnInit {
  form!: FormGroup;  // Definir el formulario reactivo
  tipos = [{ name: 'Tipo 1' }, { name: 'Tipo 2' }];  // Lista de tipos para el select

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    // Inicialización del formulario con los validadores adecuados
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      descripcion: ['', Validators.required],
      tipo: ['', Validators.required]  // Campo para el select de tipos
    });
  }

  // Getters para acceder a los controles de formulario desde el template
  get nombre() {
    return this.form.get('nombre');
  }

  get email() {
    return this.form.get('email');
  }

  get descripcionField() {
    return this.form.get('descripcion');
  }

  // Método que maneja el envío del formulario
  onSubmit() {
    if (this.form.valid) {
      console.log('Formulario válido, procesando...', this.form.value);
      // Agrega tu lógica de procesamiento aquí
    }
  }

  // Manejo del cambio en el select
  handleChange(event: any) {
    console.log('Cambio detectado en el select:', event);
  }
}
