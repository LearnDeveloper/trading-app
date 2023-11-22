// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-edit-profile',
//   templateUrl: './edit-profile.component.html',
//   styleUrls: ['./edit-profile.component.scss']
// })
// export class EditProfileComponent {

// }

import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularDeviceInformationService } from 'angular-device-information';
import { IpService } from '../ipserivce.service';
import { DataService } from '../data.service';
import { ToastrService } from 'ngx-toastr';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  signupForm: FormGroup;
  emailFlag : boolean = true;
  hidePassword: boolean = true; // Initially, hide the password
  ipAddress : String;
  loggedInData : any;
  constructor(private formBuilder: FormBuilder,private router: Router,
    private deviceInformationService: AngularDeviceInformationService,private cookieService: CookieService,
    private toastr : ToastrService,
    private ipService: IpService,private dataService:DataService) {
      this.ipService.getIpAddress().subscribe(data => {
        this.ipAddress = data.ip;
        console.log("IpAddress",this.ipAddress);
      });
    }

    user: SocialUser;
    loggedIn: boolean;
    userData : any;
    nickName : any;
    loading : boolean = false;

  ngOnInit() {
    const cookieValue = this.cookieService.get('luid');
    console.log("cookie",cookieValue);
    this.userData = JSON.parse(cookieValue);
    console.log("userData", this.userData);
    const words = this.userData.full_name.split(' '); // Split the string into an array of words
    const firstLetters = words.map((word: string) => word.charAt(0)); // Extract the first letter of each word
    const result = firstLetters.join(''); // Join the first letters back together
    this.nickName = result
    console.log(this.nickName);

    this.signupForm = this.formBuilder.group({
      fullName: ['',[Validators.required, this.customInputValidator()]],
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
    });

    this.editPopup();
  }
  data:any;
  showMessage(){
    this.showError("Email ID cannot be edited")
  }
   customInputValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const value: string = control.value;
      const spaceCount: number = (value.match(/ /g) || []).length;
  
      if (value.length > 25 || spaceCount > 2) {
        return { invalidInput: true };
      }
  
      return null;
    };
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

  editPopup() {
    const element = this.userData;
    console.log(this.userData);
    console.log(element);
   this.signupForm.setValue({
    fullName: element.full_name,
    email: element.email,
    phone: element.Phone_Number,
    password : element.password
  });
}

// this.signupForm = this.formBuilder.group({
//   fullName: ['', Validators.required],
//   email: ['', [Validators.required, Validators.email]],
//   phone: ['', Validators.required],
//   password: [
//     '',
//     [
//       Validators.required,
//       Validators.pattern(
//         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/
//       ),
//     ],
//   ],
//   termsAndConditions: [true, Validators.requiredTrue],
// });

editProfile(){
  this.loading =true;
  let payload = {
    fullName: this.signupForm.get('fullName').value,
    email: this.signupForm.get('email').value,
    phone: this.signupForm.get('phone').value,
    password : this.signupForm.get('password').value
  }
  console.log("payload",payload);
  this.dataService.editProfile(payload).subscribe((result) => {
    this.loading =false;
    this.data = result;
    console.log(this.data);
    sessionStorage.setItem('userData',JSON.stringify(this.data.getNewData));
    if(this.data.updateDB.modifiedCount == 0)
    {
      this.showError("No Data Updated");
    }
    else{
      this.showSuccess('Edited Data Successfully')
      console.log("this.data.getNewData",this.data.getNewData)
      this.cookieService.deleteAll('luid');
      this.cookieService.set('luid',JSON.stringify(this.data.getNewData));
      this.ngOnInit();
    }
    
  });
}

}
