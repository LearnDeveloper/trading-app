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

// Project import

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent {
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
    private fb: FormBuilder
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
      language: ['', [Validators.required]],
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

  fetchData(): void {
    this.dataservice.getUser().subscribe((result) => {
      // this.data = result;
      this.dataSource = new MatTableDataSource(result);;
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
  email: [element.full_name],
  phoneNumber: [element.Phone_Number],
  fullName: element.full_name,
  language : [element.isactive],
  userId : [element.user_id],
  password : [element.password],
  active : [element.isActive],
  banned : [element.isBanned]

});

}


}
