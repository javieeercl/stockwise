import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private firestore: AngularFirestore) {}

  // Crear ítem
  createItem(data: any) {
    return this.firestore.collection('inventory').add(data);
  }

  // Obtener lista de ítems
  getItems() {
    return this.firestore.collection('inventory').snapshotChanges();
  }

  // Obtener ítem por ID
  getItem(id: string) {
    return this.firestore.doc(`inventory/${id}`).valueChanges();
  }

  // Actualizar ítem
  updateItem(id: string, data: any) {
    return this.firestore.doc(`inventory/${id}`).update(data);
  }

  // Eliminar ítem
  deleteItem(id: string) {
    return this.firestore.doc(`inventory/${id}`).delete();
  }
}
