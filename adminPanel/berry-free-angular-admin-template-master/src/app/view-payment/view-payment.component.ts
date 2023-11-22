// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-view-payment',
//   templateUrl: './view-payment.component.html',
//   styleUrls: ['./view-payment.component.scss']
// })
// export class ViewPaymentComponent {

// }

// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-view-user',
//   templateUrl: './view-user.component.html',
//   styleUrls: ['./view-user.component.scss']
// })
// export class ViewUserComponent {

// }

// Angular import
import { Component, NgZone, ViewChild } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';
import { BerryConfig } from '../app-config';
import { DataService } from '../data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

// Project import

@Component({
  selector: 'app-view-payment',
  templateUrl: './view-payment.component.html',
  styleUrls: ['./view-payment.component.scss']
})
export class ViewPaymentComponent {
  // public props
  displayedColumns: string[] = ['user id', 'full name', 'email','phone number','is Active','device details', 'Action']; // Replace with your column names
  dataSource: MatTableDataSource<any>;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  popup : boolean = false;

  berryConfig;
  navCollapsed: boolean;
  navCollapsedMob = false;
  windowWidth: number;
  color = '#0056b3'
  userForm: FormGroup;
  // Constructor  constructor(public dialog: MatDialog) {}

  constructor(
    private zone: NgZone,
    private location: Location,
    private locationStrategy: LocationStrategy,
    private dataservice : DataService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private toastr : ToastrService,

  ) {
    this.berryConfig = BerryConfig;

    let current_url = this.location.path();
    const baseHref = this.locationStrategy.getBaseHref();
    if (baseHref) {
      current_url = baseHref + this.location.path();
    }

    if (current_url === baseHref + '/layout/theme-compact' || current_url === baseHref + '/layout/box') {
      this.berryConfig.isCollapse_menu = true;
    }

    this.windowWidth = window.innerWidth;
    this.navCollapsed = this.windowWidth >= 1025 ? BerryConfig.isCollapse_menu : false;
  }

  // public method
  navMobClick() {
    if (this.navCollapsedMob && !document.querySelector('app-navigation.coded-navbar')?.classList.contains('mob-open')) {
      this.navCollapsedMob = !this.navCollapsedMob;
      setTimeout(() => {
        this.navCollapsedMob = !this.navCollapsedMob;
      }, 100);
    } else {
      this.navCollapsedMob = !this.navCollapsedMob;
    }
  }
  ngOnInit(): void {
    this.fetchData();
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      fullName: ['', [Validators.required]],
      Subscribed: ['', [Validators.required]],
      userId: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      active : [''],
      banned : ['']
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      // You can access the form values using this.userForm.value
      // Add your logic here, e.g., send data to the server
      console.log(this.userForm.value);
    }
  }
  data : any;
  editpopup : boolean = false;

  userData : any;

  fetchData(): void {
    this.dataservice.getPayments().subscribe((result) => {
      // this.data = result;
      this.userData = result.data;
      console.log("userData", this.userData);
      this.dataSource = new MatTableDataSource(result.data);;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  
  selectedUser : any;
  openPopup(element) {
    this.selectedUser = element.device_info;
    console.log(element);
   this.popup = true;
}

editPopup(element) {
  this.selectedUser = element.device_info;
  console.log(element);
 this.editpopup = true;
 this.userForm.setValue({
  email: [element.email],
  phoneNumber: [element.Phone_Number],
  fullName: element.full_name,
  Subscribed : [element.isSubscribed],
  userId : [element.user_id],
  password : [element.password],
  active : [element.isActive],
  banned : [element.isBanned]
});

}
isBannedBoolean : any;
isActiveBoolean : any;
editData(){
  console.log("data", this.userForm.value);
  let payload = this.userForm.value

  if(payload.banned == "true"){
   this.isBannedBoolean = true;
  }
  else{
    this.isBannedBoolean = false;
  }

  if(payload.active == true){
    this.isActiveBoolean = true;
   }
   else{
     this.isActiveBoolean = false;
   }
  
  let constrcutPayload = {
    "email": payload.email[0],
    "phoneNumber": payload.phoneNumber[0],
    "fullName": this.userForm.get('fullName').value,
    "Subscribed": payload.Subscribed[0],
    "userId": payload.userId[0],
    "password": payload.password[0],
    "active": this.isActiveBoolean,
    "banned": this.isBannedBoolean
}

console.log("constrcutPayload",constrcutPayload);
  this.dataservice.editProfile(constrcutPayload).subscribe((result) => {
    console.log(result);
    this.editpopup = false;
    this.fetchData();
    this.showSuccess("Edited Successfully")
  });
}

referalFlag : boolean = false;
referredDetails : any;
async referredCode(element){
  var referred_code = element.referred_code;
  console.log("referred_code",referred_code);
  this.referredDetails = this.userData.filter(x => x.referred_code == element.refferral_code);
  console.log("referredDetails",this.referredDetails);
  this.referalFlag = true;
}

showError(msg:any) {
  this.toastr.error(msg);
}

showSuccess(msg:any) {
  this.toastr.success(msg);
}


}
