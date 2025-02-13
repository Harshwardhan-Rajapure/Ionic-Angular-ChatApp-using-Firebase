import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { addIcons } from 'ionicons';
import { lockClosedOutline, mailOutline } from 'ionicons/icons';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import {
  IonContent,
  IonCard,
  IonInput,
  IonButton,
  IonIcon,
  IonText,
  IonSpinner,
  IonAlert,
  IonInputPasswordToggle,
} from '@ionic/angular/standalone';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    IonContent,
    IonCard,
    IonInput,
    IonButton,
    IonIcon,
    IonText,
    IonSpinner,
    IonAlert,
    IonInputPasswordToggle,
  ],
})
export class LoginPage implements OnInit {
  form!: FormGroup;
  isLogin = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  private auth = inject(AuthService);

  constructor() {
    addIcons({
      mailOutline,
      lockClosedOutline,
    });
  }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(8)],
      }),
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log(this.form.value);
    this.login(this.form.value);
  }

  async login(formValue: { email: string; password: string }) {
    try {
      this.setIsLogin(true);
      await this.auth.login(formValue.email, formValue.password);
      this.setIsLogin(false);
      this.auth.navigatebyUrl('/tabs'); //navigation
      this.form.reset();
    } catch (e: any) {
      this.setIsLogin(false);
      console.log(e.code);
      let msg: string = 'Could not sign you up, Please try again.';
      if (e.code == 'auth/user-not-found') {
        msg = 'Email address could not be found';
      } else if (e.code == 'auth/wrong-password')
        msg = 'Please enter a correct password';
      this.setErrorMessage(msg);
    }
  }

  setIsLogin(value: boolean) {
    this.isLogin.set(value);
  }

  setErrorMessage(value: string | null) {
    this.errorMessage.set(value);
  }
}
