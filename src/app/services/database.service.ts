import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs/internal/Observable';

export interface Categoria {
  id?: string;
  nombre: string;
}

export interface Producto {
  id?: string;
  nombre: string;
  precio: number;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private firestore: AngularFirestore) {}

  createDoc(data: any, path: any, id: any){
    const collection = this.firestore.collection(path);
    return collection.doc(id).set(data);
  }

  createSubDoc(data: any, path: string, id: string, subPath:string, subId:string){
    const collection = this.firestore.collection(path).doc(id).collection(subPath);
    return collection.doc(subId).set(data);
  }

  createSecSubDoc(data: any, path: string, id: string, subPath:string, subId:string, secSubPath: string, secSubId: string){
    const collection = this.firestore.collection(path).doc(id).collection(subPath).doc(subId).collection(secSubPath);
    return collection.doc(secSubId).set(data);
  }

  getDoc<Tipo>(path: string, id: string){
    const collection = this.firestore.collection<Tipo>(path);
    return collection.doc(id).valueChanges();
  }

  deleteDoc(path: string, id: string){
    const collection = this.firestore.collection(path);
    return collection.doc(id).delete();
  }

  updateDoc(data: any, path: string, id: string){
    const collection = this.firestore.collection(path);
    return collection.doc(id).update(data);
  }

  updateSubDoc(data: any, path: string, id: string, subPath:string, subId:string){
    const collection = this.firestore.collection(path).doc(id).collection(subPath);
    return collection.doc(subId).update(data);
  }

  getId(){
    return this.firestore.createId();
  }

  async createDocID<Tipo>(data: Tipo, enlace: string, idDoc: string){
    const itemsCollection= this.firestore.collection<Tipo>(enlace);
    return itemsCollection.doc(idDoc).set(data);
  }

  getCollection<Tipo>(path: string) {
    const collection = this.firestore.collection<Tipo>(path);
    return collection.valueChanges();
  }

  getCollectionQuery<Tipo>(path: string, parametro: string, condicion: any, busqueda: string) {
    const collection = this.firestore.collection<Tipo>(path,
      ref => ref.where( parametro, condicion, busqueda));
    return collection.valueChanges();
  }

  getCollectionAll<Tipo>(path: string, parametro: string, condicion: any, busqueda: string, startAt: any) {
    if (startAt == null) {
      startAt = new Date();
    }
    const collection = this.firestore.collectionGroup<Tipo>(path,
      ref => ref.where( parametro, condicion, busqueda)
                .orderBy('fecha', 'desc')
                .limit(1)
                .startAfter(startAt)
      );
    return collection.valueChanges();
  }

  getCollectionPaginada<Tipo>(path: string, limit: number, startAt: any) {
    if (startAt == null) {
      startAt = new Date();
    }
    const collection = this.firestore.collection<Tipo>(path,
      ref => ref.orderBy('fecha', 'desc')
                .limit(limit)
                .startAfter(startAt)
      );
    return collection.valueChanges();
  }

  crearSubColeccion(collectionPath: string, idDoc: string, newPath: string, newId: string, data: any){
    const collection = this.firestore.collection(collectionPath).doc(idDoc).collection(newPath);
    return collection.doc(newId).set(data);
  }

  getSubCollection<Tipo>(path: string, id: string, subpath: string) {
    const collection = this.firestore.collection(path).doc(id).collection<Tipo>(subpath);
    return collection.valueChanges();
  }
  get3rdCollection<Tipo>(path: string, id: string, subpath: string, secId: string, secSubPath: string) {
    const collection = this.firestore.collection(path).doc(id).collection(subpath).doc(secId).collection<Tipo>(secSubPath);
    return collection.valueChanges();
  }

  getSubDoc<Tipo>(path: string, id: string, subpath: string, subId: string){
    const collection = this.firestore.collection(path).doc(id).collection<Tipo>(subpath);
    return collection.doc(subId).valueChanges();
  }



  //

  createCategoria(data: Categoria): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection('Categoria').doc(id).set({ ...data, id });
  }

  getCategorias(): Observable<Categoria[]> {
    return this.firestore.collection<Categoria>('Categoria').valueChanges();
  }

  updateCategoria(id: string, data: Partial<Categoria>): Promise<void> {
    return this.firestore.collection('Categoria').doc(id).update(data);
  }

  deleteCategoria(id: string): Promise<void> {
    return this.firestore.collection('Categoria').doc(id).delete();
  }

  
  addProductoToCategoria(categoriaId: string, producto: Producto): Promise<void> {
    const productoId = this.firestore.createId();
    return this.firestore
      .collection('Categoria')
      .doc(categoriaId)
      .collection('Producto')
      .doc(productoId)
      .set({ ...producto, id: productoId });
  }


  getProductos(categoriaId: string): Observable<Producto[]> {
    return this.firestore.collection('Categoria').doc(categoriaId)
      .collection<Producto>('Producto').valueChanges();
  }

  updateProducto(categoriaId: string, productoId: string, data: Partial<Producto>): Promise<void> {
    return this.firestore.collection('Categoria').doc(categoriaId)
      .collection('Producto').doc(productoId).update(data);
  }

  deleteProducto(categoriaId: string, productoId: string): Promise<void> {
    return this.firestore.collection('Categoria').doc(categoriaId)
      .collection('Producto').doc(productoId).delete();
  }

  // Fetch specific Categoria or Producto by ID

  getCategoriaById(id: string): Observable<Categoria | undefined> {
    return this.firestore.collection('Categoria').doc<Categoria>(id).valueChanges();
  }

  getProductoById(categoriaId: string, productoId: string): Observable<Producto | undefined> {
    return this.firestore.collection('Categoria').doc(categoriaId)
      .collection<Producto>('Producto').doc(productoId).valueChanges();
  }
  

}
