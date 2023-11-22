// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-forgot-password',
//   templateUrl: './forgot-password.component.html',
//   styleUrls: ['./forgot-password.component.scss']
// })
// export class ForgotPasswordComponent {

// }

import { Component, OnInit, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import * as CryptoJS from 'crypto-js';
import { AuthService } from '../auth.service';
import { GoogleApiService, UserInfo } from '../google-api.service';
import { AbstractControl, ValidationErrors } from '@angular/forms';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  // email: string = '';
  // otp: string = '';
  // passwordnew: string = '';
  // reenterPassword: string = '';
  loginForm: FormGroup;

  private translator = inject(TranslateService);
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private authService: SocialAuthService,
    private authServiceGoogle: AuthService,
    private httpClient: HttpClient,
    private cookieService: CookieService,
    private toastr : ToastrService,
    private route: ActivatedRoute,
    private googleApi: GoogleApiService,
    private dataService:DataService) {
      this.loginForm = this.formBuilder.group({
        textInput: [''],
      });
  
   }

   ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/
          ),
        ],
      ],      
      repassword: ['', Validators.required],
      OTP:['',Validators.required]
    },
    {
      validators: this.passwordMatchValidator, // Apply the custom validator here
    }
    );
   }

  // resetPassword() {
  //   // Validate the passwords
  //   if (this.passwordnew !== this.reenterPassword) {
  //     // Passwords do not match
  //     alert('Passwords do not match');
  //     return;
  //   }





  //   // Send a request to the server to initiate the password reset process
  //   // Include email, OTP, and password in the request
  //   console.log('Resetting password...');
  // }

  clearTextInput() {
    this.loginForm.get('email').setValue('');
  }

  onSubmit()
  {
    console.log(this.loginForm.valid);

   console.log(this.loginForm.value);
  this.dataService.forgotpassword(this.loginForm.value).subscribe((result) => {
    this.data = result;
    console.log(this.data);
    if(this.data.responseCode == "1001")
    {
      this.showError(this.data.message);
      return;
    }
    else{
      this.showSuccess('Password changes successfully')
      this.router.navigate(['/signin'])
    }
    
  });
  }

  data : any;
  resendDisabled : boolean = false;
  resendDetails : boolean = false;

  resendOTP() {
    // Implement OTP resend logic here
    // Reset the countdown and enable the "Resend OTP" button
    let payload = {
      email: this.loginForm.get('email').value,
      otp : ``
    }
    this.dataService.resendOtp(payload).subscribe((result) => {
      this.data = result;
      console.log(this.data);
      if(this.data.responseCode == "1001")
      {
        this.showError(this.data.error);
        return;
      }
      else{
        this.showSuccess('OTP sent successfully')
        // this.router.navigate(['/payment'])
      }
      
    });
    this.countdown = 30;
    this.resendDisabled = false;
    this.resendDetails = true;
    this.startCountdown();
  }

  handleBlur() {
    console.log('Input lost focus');
    this.resendOTP();
  }
  // Custom validator function
 passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const repassword = control.get('repassword')?.value;

  // Check if the password and repassword fields match
  if (password !== repassword) {
    return { passwordMatch: true };
  }

  return null; // Validation passes
}



  selectedLanguage : String = "en";
  langChanged(lang:any): void {
    this.selectedLanguage = lang;
    if (lang == 'it') {
      this.translator.use('it');
      localStorage.setItem('selectedLanguage','it')
      return;
    }
    this.translator.use('en');
    localStorage.setItem('selectedLanguage','en')
    console.log(`lang Changed to ${this.translator.currentLang}`);      

  }
  hidePassword: boolean = true; // Initially, hide the password

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
  hidePassword1: boolean = true; // Initially, hide the password

  togglePasswordVisibility1()
  {
    this.hidePassword1 = !this.hidePassword1;

  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
  countdown: number = 30;
  showError(msg:any) {
    this.toastr.error(msg);
  }

  showSuccess(msg:any) {
    this.toastr.success(msg);
  }



  startCountdown() {
    const interval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(interval);
        this.resendDisabled = true;
      }
    }, 1000);
  }
}
