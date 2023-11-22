import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularDeviceInformationService } from 'angular-device-information';
import { IpService } from '../ipserivce.service';
import { DataService } from '../data.service';
import { ToastrService } from 'ngx-toastr';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  hidePassword: boolean = true; // Initially, hide the password
  ipAddress : String;
  loggedInData : any;
  private translator = inject(TranslateService);
  constructor(private formBuilder: FormBuilder,private router: Router,
    private authService: SocialAuthService,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private deviceInformationService: AngularDeviceInformationService,
    private toastr : ToastrService,
    private cookieService : CookieService,
    private ipService: IpService,private dataService:DataService) {
      this.ipService.getIpAddress().subscribe(data => {
        this.ipAddress = data.ip;
        console.log("IpAddress",this.ipAddress);
      });
    }

    user: SocialUser;
    loggedIn: boolean;
    queryParam: any;


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const referralCode = params['ReferralCode'];
      if (referralCode) {
        this.queryParam = referralCode;
        console.log('Referral Code:', referralCode);
      }
    });
    this.signupForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/
          ),
        ],
      ],
      
      termsAndConditions: [true, Validators.requiredTrue],
      Referral : this.queryParam || ['']
        
    });


    this.selectedLanguage = localStorage.getItem('selectedLanguage')
    if(this.cookieService.get('luid'))
    {
      this.router.navigate(['/user-dashboard'])
      return;
    }


    // this.liabilityFillingForm.get('sroName').patchValue(this.srocode);

  }
  data:any;
  kannadaToggled: boolean = this.translator.currentLang === 'en' ? false : true;
  selectedLanguage:any;
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
  loading : boolean = false;
  onSubmit() {
    
    console.log(this.signupForm.valid);
    
    if (this.signupForm.valid) {
      this.loading = true;

      localStorage.setItem('email',this.signupForm.get('email').value);
      // Process the signup here
      let payload = {
          "path" : "create",
          "user_id": "",
          "full_name": this.signupForm.get('fullName').value,
          "Phone_Number": this.signupForm.get('phone').value,
          "email": this.signupForm.get('email').value,
          "password": this.signupForm.get('password').value,
          "refferred_code" :this.signupForm.get('Referral').value,
          "device_info": {
              "isMobile": this.deviceInformationService.isMobile(),
              "isTablet": this.deviceInformationService.isTablet(),
              "isDesktop": this.deviceInformationService.isDesktop(),
              "deviceType": this.deviceInformationService.getDeviceType(),
              "OS": this.deviceInformationService.getDeviceInfo().os,
              "osVersion": this.deviceInformationService.getDeviceInfo().osVersion,
              "screen_resolution": this.deviceInformationService.getDeviceInfo().screen_resolution,
              "userAgent": this.deviceInformationService.getDeviceInfo().userAgent,
              "IP Address":this.ipAddress,
          },
          "created_date":"",
          "language": "",
          "firebase_token": "",
          "isActive": true,
          "isBanned":false,
          "isAdmin" : false,
        }
      this.dataService.createUser(payload).subscribe((result) => {
        this.data = result;
        console.log(this.data);
        if(this.data.responseCode == "1001")
        {
          this.showError(this.data.error);
          this.loading = false;
        }
        else{
          this.loading = false;
          this.loading = false;
          this.cookieService.set('luid',JSON.stringify(this.data.data[0]));
          this.showSuccess('OTP sent Successfully')
          this.router.navigate(['/otp'])

        }
        
      });
      // this.router.navigate(['otp']);
    }
  }

  

  showError(msg:any) {
    this.toastr.error(msg);
  }

  showSuccess(msg:any) {
    this.toastr.success(msg);
  }


  get fullName() {
    return this.signupForm.get('fullName');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get phone() {
    return this.signupForm.get('phone');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get termsAndConditions() {
    return this.signupForm.get('termsAndConditions');
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

  refreshToken(): void {
    this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }

  private accessToken = '';


  getAccessToken(): void {
    this.authService.getAccessToken(GoogleLoginProvider.PROVIDER_ID).then(accessToken => this.accessToken = accessToken);
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

  signInWithGoogle(): void {
  //   this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
  //     .then((user) => {
  //       console.log('user',user);
  //       let userData:any = user;
  //       localStorage.setItem('user',userData);
  //       this.router.navigate(['/user-dashboard'])
  //       // Handle successful Google login here
  //     })
  //     .catch((error) => {
  //       // Handle error
  //     });
  // }

  // signInWithFacebook(): void {
  //   this.authService.signIn(FacebookLoginProvider.PROVIDER_ID)
  //     .then((user) => {
  //       console.log('user',user);
  //       // Handle successful Facebook login here
  //     })
  //     .catch((error) => {
  //       // Handle error
  //     });
  // }

  }

} 

