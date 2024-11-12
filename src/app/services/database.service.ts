import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

export interface Categoria {
  id?: string;
  nombre: string;
  imagenUrl?: string;
}

export interface Producto {
  id?: string;
  nombre: string;
  precio: number;
  stock: number;
  imagenUrl?: string;
}

export interface Usuario {
  uid: string;
  email: string;
  nombre_completo: string;
  password?: string; // Se sugiere no almacenar contraseñas en texto plano
  rol: string;
  vigente: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) {}

  // Métodos para Categorías
  getCategorias(): Observable<Categoria[]> {
    return this.firestore.collection<Categoria>('Categoria').valueChanges();
  }

  createCategoria(data: Categoria): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection('Categoria').doc(id).set({ ...data, id });
  }

  updateCategoria(id: string, data: Partial<Categoria>): Promise<void> {
    return this.firestore.collection('Categoria').doc(id).update(data);
  }

  deleteCategoria(id: string): Promise<void> {
    return this.firestore.collection('Categoria').doc(id).delete();
  }

  // Métodos para Productos
  getProductos(categoriaId: string): Observable<Producto[]> {
    return this.firestore.collection('Categoria').doc(categoriaId).collection<Producto>('Producto').valueChanges();
  }

  addProductoToCategoria(categoriaId: string, producto: Producto): Promise<void> {
    const productoId = this.firestore.createId();
    return this.firestore.collection('Categoria').doc(categoriaId).collection('Producto').doc(productoId).set({ ...producto, id: productoId });
  }

  updateProducto(categoriaId: string, productoId: string, data: Partial<Producto>): Promise<void> {
    return this.firestore.collection('Categoria').doc(categoriaId).collection('Producto').doc(productoId).update(data);
  }

  deleteProducto(categoriaId: string, productoId: string): Promise<void> {
    return this.firestore.collection('Categoria').doc(categoriaId).collection('Producto').doc(productoId).delete();
  }

  createUsuario(usuario: Usuario): Promise<void> {
    const uid = usuario.uid || this.firestore.createId();
    return this.firestore.collection('Usuario').doc(uid).set({ ...usuario, uid });
  }

  // Obtener usuario por UID
  getUsuario(uid: string): Observable<Usuario | undefined> {
    return this.firestore.collection<Usuario>('Usuario').doc(uid).valueChanges();
  }

  // Actualizar usuario
  updateUsuario(uid: string, data: Partial<Usuario>): Promise<void> {
    return this.firestore.collection('Usuario').doc(uid).update(data);
  }

  // Eliminar usuario
  deleteUsuario(uid: string): Promise<void> {
    return this.firestore.collection('Usuario').doc(uid).delete();
  }
}
