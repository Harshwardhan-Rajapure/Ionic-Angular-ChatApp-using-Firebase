import { Injectable, inject, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { ApiService } from '../api/api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  uid = signal<string | null>(null);
  private fireAuth = inject(Auth);
  private api = inject(ApiService);
  private router = inject(Router);

  constructor() {}

  setData(uid: string | null) {
    if (this.uid) this.uid.set(uid);
  }

  getId() {
    const auth = getAuth();
    const uid = auth.currentUser?.uid || null;
    this.setData(uid);
    return uid;
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ id: string }> {
    try {
      const register = await createUserWithEmailAndPassword(
        this.fireAuth,
        data.email,
        data.password
      );

      const id = register.user.uid;
      const userData = {
        name: data.name,
        email: data.email,
        uid: id,
        photo: 'https://i.pravatar.cc/' + this.randomIntFromInterval(200, 400),
      };

      // data in db
      await this.api.setData(`users/${id}`, userData);
      this.setData(id);

      return { id };
    } catch (e) {
      console.error('Registration error:', e);
      throw e;
    }
  }

  randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  async login(email: string, password: string) {
    try {
      const response = await signInWithEmailAndPassword(
        this.fireAuth,
        email,
        password
      );

      if (response?.user) {
        //save data
        this.setData(response.user.uid);
      }
    } catch (e) {
      console.error('Login error:', e);
      throw e;
    }
  }

  checkAuth() {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(
        this.fireAuth,
        (user) => {
          resolve(user);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  navigatebyUrl(path: string) {
    this.router.navigateByUrl(path, { replaceUrl: true });
  }

  async getUserdata(id: string) {
    try {
      const userRef = this.api.getRef(`users/${id}`);
      const snapshot = await this.api.getData(userRef);
      if (snapshot?.exists()) {
        return snapshot.val();
      } else {
        throw new Error('No such user exists.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await this.fireAuth.signOut();
      this.uid.set(null);
      this.navigatebyUrl('/login')
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
}
