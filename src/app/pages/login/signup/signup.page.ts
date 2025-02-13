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
import { lockClosedOutline, mailOutline, personOutline } from 'ionicons/icons';
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
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
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
export class SignupPage implements OnInit {
  form!: FormGroup;
  isSignup = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  private auth = inject(AuthService);
  // private router = inject(Router);

  constructor() {
    addIcons({
      mailOutline,
      lockClosedOutline,
      personOutline,
    });
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required],
      }),
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
    this.signup(this.form.value);
  }

  async signup(formValue: { name: string; email: string; password: string }) {
    try {
      this.setIsSignup(true);
      const { id } = await this.auth.register(formValue);
      this.setIsSignup(false);

      this.auth.navigatebyUrl('/tabs'); //navigation

      this.form.reset();
    } catch (e: any) {
      this.setIsSignup(false);

      let msg: string = 'Could not sign you up, Please try again.';
      if (e.code == 'auth/email-already-in-use') {
        msg = 'Email already in use';
      }
      this.setErrorMessage(msg);
    }
  }

  setIsSignup(value: boolean) {
    this.isSignup.set(value);
  }

  setErrorMessage(value: string | null) {
    this.errorMessage.set(value);
  }
}
