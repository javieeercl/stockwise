import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { of } from 'rxjs';

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


    // Obtener Categoria por UID
    getCategoria(id: string): Observable<Categoria | null> {
      return this.firestore.collection<Categoria>('Categoria').doc(id).valueChanges().pipe(
        map((data) => {
          if (data) {
            return data;
          } else {
            console.warn(`No se encontró la categoría con ID ${id}`);
            return null;
          }
        })
      );
    }

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

  updateUser(uid: string, userData: Partial<Usuario>) {
    return this.firestore.collection('Usuario').doc(uid).update(userData);
  }

  // Obtener usuario por UID
  getUsuario(uid: string): Observable<Usuario | undefined> {
    return this.firestore.collection<Usuario>('Usuario').doc(uid).valueChanges();
  }

    // Obtener todos los usuarios
  getUsuarios(): Observable<Usuario[]> {
    return this.firestore.collection<Usuario>('Usuario').valueChanges();
  }

  // Eliminar usuario
  deleteUsuario(uid: string): Promise<void> {
    return this.firestore.collection('Usuario').doc(uid).delete();
  }
}
