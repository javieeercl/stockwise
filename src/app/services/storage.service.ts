import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: AngularFireStorage) { }

  fileName(){
    const newTime = Math.floor(Date.now()/1000);
    return Math.floor(Math.random()*20) + newTime;
  }

async storeFile(location: string, fileData: any): Promise<any> {
  try {
    return new Promise((resolve, reject) => {
      const fileRef = this.storage.ref(location + fileData.name);
      
      // Subir el archivo
      fileRef.put(fileData).then(() => {
        // Obtener la URL de descarga
        fileRef.getDownloadURL().subscribe(
          (url: any) => resolve(url),
          (error: any) => {
            console.error('Error al obtener la URL de descarga', error);
            reject(error); // Rechaza la promesa si falla la obtención de la URL
          }
        );
      }).catch((error) => {
        console.error('Error al almacenar el archivo', error);
        reject(error); // Rechaza la promesa si falla el almacenamiento
      });
    });
  } catch (error) {
    console.error('Error inesperado en storeFile', error);
    throw error; // Lanza el error para que sea manejado por quien llama a la función
  }
}

}
