import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/data.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  {
  loginForm: FormGroup;
  loggedIn: boolean;
  hidePassword: boolean = true; // Initially, hide the password
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private toastr : ToastrService,
    private dataService:DataService) {
    this.loginForm = this.formBuilder.group({
      textInput: [''],
    });
  }
  clearTextInput() {
    this.loginForm.get('username').setValue('');
  }
  ngOnInit() {

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false],
    });


  }


  data : any;

  rememberCheck(e:any){
    console.log("event",e.target.checked);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      let payload = {
        email : this.loginForm.get('username').value,
        password : this.loginForm.get('password').value
      }
      this.dataService.login(payload).subscribe((result) => {
        this.data = result;
        // console.log(this.data[0].data[0].isAdmin);
        if(this.data[0].responseCode == "1001")
        {
          this.showError(this.data[0].error);
          return;
        }
        if(this.data[0].data.isAdmin){
          this.showSuccess('Logged in Successfully')
          localStorage.setItem('isLoggedIN','1');
          sessionStorage.setItem('userData',JSON.stringify(this.data[0].data));
          console.log("userData",this.data[0].data)
          sessionStorage.setItem('isLoggedIN','1');
          this.router.navigate(['/admin/default'])
        }
        else{
          this.showError("Access Denied");
          return;
        }
        
      });
      // this.dataService.getUser().subscribe((result) => {
      //   this.data = result;
      //   console.log(this.data);
      // });
    }
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


}
