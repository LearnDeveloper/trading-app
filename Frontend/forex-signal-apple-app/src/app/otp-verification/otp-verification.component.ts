import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../data.service';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.css'],
})
export class OtpVerificationComponent implements OnInit {
  otp: string;
  email : any;
  showOtpComponent = true;
  @ViewChild('ngOtpInput', { static: false}) ngOtpInput: any;
  config = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px'
    }
  };

  onOtpChange(otp:any) {
    this.otp = otp;
    console.log("otp", this.otp);
  }
  countdown: number = 30;
  resendDisabled: boolean = false;
  otp1:number = null;
  otp2:number = null;
  otp3:number = null;
  otp4:number = null;
  userData : any;

  constructor(private router:Router,private toastr : ToastrService,private dataService:DataService,
    private cookieService: CookieService,private dataservice : DataService
    ){}

  ngOnInit() {
    const cookieValue = this.cookieService.get('luid');
    console.log("cookie",cookieValue);
    this.userData = JSON.parse(cookieValue);
    console.log("userData", this.userData);
    // Start the countdown when the component is initialized
    this.startCountdown();
    this.email = this.userData.email;
  }

  data : any;

  verifyOTP() {

    console.log(`${this.otp1}${this.otp2}${this.otp3}${this.otp4}`)
    if(this.otp == null || this.otp == "" || this.otp == undefined )
    {
      this.showError("please enter the OTP");
    }
    else{
      let payload = {
        email: this.userData.email,
        otp : this.otp
      }
      this.dataService.verifyOtp(payload).subscribe((result) => {
        this.data = result;
        console.log(this.data);
        if(this.data.responseCode == "1001")
        {
          this.showError(this.data.error);
          return;
        }
        else{
          this.updatepaymentFunction();
          this.showSuccess('Logged in Successfully')
          this.cookieService.set('luid',JSON.stringify(this.data.data[0]));
          this.router.navigate(['/user-dashboard'])
        }
        
      });
    }
    // Implement OTP verification logic here
    
  }

  updatepaymentFunction()
  {
    let payload = {
     "email" : this.userData?.email,
     "path" : "auth"
    }
    console.log("payload",payload);
    this.dataservice.updatepayment(payload).subscribe((result) => {
      console.log(result);
      this.showSuccess('SSO Enabled Automatically')
      console.log("this.data.getNewData",result.getNewData)
      this.cookieService.deleteAll('luid');
      this.cookieService.set('luid',JSON.stringify(result.getNewData));
      // this.ngOnInit();
      this.router.navigate([''])
      
    });
  }


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

  resendOTP() {
    // Implement OTP resend logic here
    // Reset the countdown and enable the "Resend OTP" button
    let payload = {
      email: this.userData.email,
      otp : `${this.otp1}${this.otp2}${this.otp3}${this.otp4}`
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
    this.startCountdown();
  }

}
