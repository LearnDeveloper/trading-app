import { Component, OnInit, inject } from '@angular/core';
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

declare var AppleID:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  user: SocialUser;
  loading : boolean = false;
  loggedIn: boolean;
  mailSnippets: string[] = []
  userInfo?: UserInfo;
  loggedInData : any;
  hidePassword: boolean = true; // Initially, hide the password
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
  clearTextInput() {
    this.loginForm.get('username').setValue('');
  }
  isLoggedIn(): boolean {
    return this.googleApi.isLoggedIn()
  }

  logout() {
    this.googleApi.signOut()
  }
  async loginWithGoogle() {
   let data = await this.googleApi.login()
   console.log("data",data)
      this.getUserDetailsAndSendToAPI();
    }
  


  userDetails: any;

  getUserDetailsAndSendToAPI() {
    // Get user details
    this.userDetails = this.authServiceGoogle.getUserDetails();
    console.log("authServiceGoogle", this.authServiceGoogle);
    // Send user details to the API
    this.dataService.createUser(this.userDetails).subscribe(
      (response) => {
        // Handle the API response as needed
      },
      (error) => {
        // Handle API request errors
      }
    );
  }

  ngOnInit() {
    
    this.selectedLanguage = localStorage.getItem('selectedLanguage')
    if(this.cookieService.get('luid'))
    {
      this.router.navigate(['/user-dashboard'])
      return;
    }
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false],
    });
    console.log("this.translator.currentLang",this.translator.currentLang)

  }


  parseJwt (token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  public async apple() {
    try {
      console.log(AppleID)
      AppleID.auth.init({
                clientId : 'RU6L5H33WV.com.boomtechsol.learn',
                scope : 'name email',
                redirectURI : 'https://angular-apple-signin.stackblitz.io/apple-callback',
                state : 'init',
                nonce : 'test',
                usePopup : true //or false defaults to false
            });
      const data = await AppleID.auth.signIn();
      console.log(this.parseJwt(data.authorization.id_token))
      
    } catch (error) {
      console.log(error)
      //handle error.
    }
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
  data : any;

  rememberCheck(e:any){
    console.log("event",e.target.checked);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      let payload = {
        email : this.loginForm.get('username').value,
        password : this.loginForm.get('password').value
      }
      this.dataService.login(payload).subscribe((result) => {
        this.data = result;
        if(this.data[0].responseCode == "1001")
        {
          this.loading = false;
          this.showError(this.data[0].error);
        }
        else if(this.data[0].data.isDeleted){
          this.loading = false;
           this.showError("Account Not Found")
        }
        else if(this.data[0].data.isBanned){
          this.loading = false;
           this.showError("Your Banned from using the application please contact us")
        }
        else if(!this.data[0].data.isActive){
          this.loading = false;
          this.showError("The Account is Inactive please contact us")
       }
       else if(!this.data[0].data.authenticated){
        this.loading = false;
        this.cookieService.set('luid',JSON.stringify(this.data[0].data));
        this.resendOTP();
        this.router.navigate(['/otp'])
      }
      else if(!this.data[0].data.isSubscribed){
        this.loading = false;
        this.cookieService.set('luid',JSON.stringify(this.data[0].data));
        this.router.navigate(['/payment'])
      }
        else{
          this.showSuccess('Logged in Successfully')
          // Set a cookie with a name 'myCookie' and a value 'Hello, World!'
          this.loading = false;
          this.cookieService.set('luid',JSON.stringify(this.data[0].data));
          this.router.navigate(['/user-dashboard'])
        }

        
      });
    }
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((user) => {
        console.log('user',user);
        
        let payload = {
          email : this.loginForm.get('username').value,
          password : this.loginForm.get('password').value
        }
        this.dataService.login(payload).subscribe((result) => {
          this.data = result;
          if(this.data[0].responseCode == "1001")
          {
            this.loading = false;
            this.showError(this.data[0].error);
          }
          else if(this.data[0].data.isBanned){
            this.loading = false;
             this.showError("Your Banned from using the application please contact us")
          }
          else if(!this.data[0].data.isActive){
            this.loading = false;
            this.showError("The Account is Inactive please contact us")
         }
         else if(!this.data[0].data.authenticated){
          this.loading = false;
          this.cookieService.set('luid',JSON.stringify(this.data[0].data));
          this.resendOTP();
          this.router.navigate(['/otp'])
        }
        else if(!this.data[0].data.isSubscribed){
          this.loading = false;
          this.cookieService.set('luid',JSON.stringify(this.data[0].data));
          this.router.navigate(['/payment'])
        }
          else{
            this.showSuccess('Logged in Successfully')
            // Set a cookie with a name 'myCookie' and a value 'Hello, World!'
            this.loading = false;
            this.cookieService.set('luid',JSON.stringify(this.data[0].data));
            this.router.navigate(['/user-dashboard'])
          }
  
          
        });
        let userData:any = user;
        localStorage.setItem('user',userData);
        this.router.navigate(['/user-dashboard'])
        // Handle successful Google login here
      })
      .catch((error) => {
        // Handle error
      });
  }

  signInWithFacebook(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID)
      .then((user) => {
        console.log('user',user);
        // Handle successful Facebook login here
      })
      .catch((error) => {
        // Handle error
      });
  }

  showError(msg:any) {
    this.toastr.error(msg);
  }

  showSuccess(msg:any) {
    this.toastr.success(msg);
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  navigate(place:String){
    if(place == "signin")
    {
      this.router.navigate(['signin']);
    }
    else if(place == "signup")
    {
      this.router.navigate(['signup']);
    }
  }
 
  showSignUpToast()
  {
    this.showError("Registration can only be done in website please login to www.l-earn.pro")
  }
  
  refreshToken(): void {
    this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }

  private accessToken = '';


  getAccessToken(): void {
    this.authService.getAccessToken(GoogleLoginProvider.PROVIDER_ID).then(accessToken => this.accessToken = accessToken);
  }
  forgotPw()
  {
    this.showSuccess('Mail sent to reset your password please follow the mail')
  }

  getGoogleCalendarData(): void {
    if (!this.accessToken) return;

    this.httpClient
      .get('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      })
      .subscribe((events) => {
        alert('Look at your console');
        console.log('events', events);
      });
  }

  
  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(x => console.log(x));
  }

  ngAfterOnInit(){
    if(this.loggedIn){
      this.router.navigate(['/user-dashboard'])
    }

  }

  resendOTP() {
    // Implement OTP resend logic here
    // Reset the countdown and enable the "Resend OTP" button
    let payload = {
      email: this.data[0].data.email,
      otp : ``
    }
    this.dataService.resendOtp(payload).subscribe((result) => {
      this.data = result;
      console.log(this.data);
      if(this.data.responseCode == "1001")
      {
        this.showError("Unable to Send OTP");
        return;
      }
      else{
        this.showSuccess('OTP sent successfully')
        this.router.navigate(['/otp'])
      }
      
    });
  }
}
