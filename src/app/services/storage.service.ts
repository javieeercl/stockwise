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

  async storeFile(location: string, fileData: any) {
    try {
      return new Promise((resolve, reject) => {
        const fileRef = this.storage.ref(location + fileData.name)
        fileRef.put(fileData).then(function(){
          fileRef.getDownloadURL().subscribe((url: any) => {
            resolve(url);
          })
        }).catch((error) => {
          reject(error);
        })
      });
    } catch(e){

    }
  }
}
