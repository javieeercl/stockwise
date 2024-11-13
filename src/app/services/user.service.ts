import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://us-central1-stockwise-fe332.cloudfunctions.net/api/createUser';

  constructor(private http: HttpClient, private afAuth: AngularFireAuth) {}

  async createUser(userData: any) {
    const user = await this.afAuth.currentUser;
    const token = user ? await user.getIdToken() : '';

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(this.apiUrl, userData, { headers }).toPromise();
  }
}
