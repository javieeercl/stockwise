import { Injectable } from '@angular/core';
import { InteractionsService } from './interactions.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public authFirebase: AngularFireAuth, private interaction: InteractionsService) { }

  async login(email: string, password: string){
    return this.authFirebase.signInWithEmailAndPassword(email, password)
    .catch((error) => {
      this.interaction.toastError(error);
      throw new Error(error);
    });;
  }


  logout(){
    this.authFirebase.signOut()
    .catch((error) => {
      this.interaction.toastError(error);
      throw new Error(error);
    });;
  }

  async registrarUser(email: string, password: string){
    return this.authFirebase.createUserWithEmailAndPassword(email, password)
    .catch((error) => {
      this.interaction.toastError(error);
      throw new Error(error);
    });;
  }

  async requestPassword(email: string){
    return await this.authFirebase.sendPasswordResetEmail(email)
    .catch((error) => {
      this.interaction.toastError(error);
      throw new Error(error);
    });;
  }

  async passwordReset(password: string, oobCode: string){
    return await this.authFirebase.confirmPasswordReset(oobCode, password)
      .catch((error) => {
        this.interaction.toastError(error);
        throw new Error(error);
      });
  }

  stateUser(){
    return this.authFirebase.authState;
  }

  async deleteUser(){
    const user = await this.authFirebase.currentUser;
    if (user) {
      return user.delete();
    } else {
      return null;
    }
  }

  async getUid(){
    const user = await this.authFirebase.currentUser;
    if (user) {
      return user.uid;
    } else {
      return null;
    }
  }
}

