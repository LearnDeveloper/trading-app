// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-view-position',
//   templateUrl: './view-position.component.html',
//   styleUrls: ['./view-position.component.scss']
// })
// export class ViewPositionComponent {

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
  selector: 'app-view-position',
  templateUrl: './view-position.component.html',
  styleUrls: ['./view-position.component.scss']
})
export class ViewPositionComponent {
  // public props
  displayedColumns: string[] = ['user id', 'full name', 'email','phone number','portfolio','shortlong','is Active','Action']; // Replace with your column names
  displayedColumns2: string[] = ['user id','percentage', 'full name', 'email','phone number','closedexitprice','shortlong','is Active','Action']; // Replace with your column names

  dataSourceOpen: MatTableDataSource<any>;
  dataSourceClose : MatTableDataSource<any>;
  
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
    private toastr : ToastrService,
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
      coinTitle: ['', [Validators.required, Validators.email]],
      percentage: ['', [Validators.required]],
      entryPrice: ['', [Validators.required]],
      averagePrice: ['', [Validators.required]],
      takeProfit: ['', [Validators.required]],
      portfolio: ['', [Validators.required]],
      status : [''],
      shortlong : [''],
      _id : ['']
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
  selectedPosition: string = 'opened'; // Default to 'opened' position
  openPosition : any;
  closePosition : any;
  fetchData(): void {
    this.dataservice.getpositionfunction().subscribe((result) => {
      console.log("results",result);
      this.openPosition = result.filter((x: { category: string; }) => x.category == "opened")
      this.closePosition = result.filter((x: { category: string; }) => x.category == "closed")
      console.log("openPosition",this.openPosition);
      console.log("closePosition",this.closePosition);
      this.dataSourceOpen = new MatTableDataSource(this.openPosition);
      this.dataSourceClose = new MatTableDataSource(this.closePosition);
      this.dataSourceOpen.paginator = this.paginator;
      this.dataSourceOpen.sort = this.sort;
      this.dataSourceClose.paginator = this.paginator;
      this.dataSourceClose.sort = this.sort;
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
  coinTitle: element.coinTitle,
  percentage: element.percentage,
  entryPrice: element.entryPrice,
  averagePrice: element.averagePrice,
  takeProfit: element.takeProfit,
  portfolio: element.portfolio,
  status : element.status,
  shortlong : element.shortlong,
  _id : element._id

});

}
isActiveBoolean :any;
edit(){
  console.log(this.userForm.value);
  let payload = this.userForm.value


  if(payload.status == "true"){
    this.isActiveBoolean = true;
   }
   else{
     this.isActiveBoolean = false;
   }

   let constructPayload = {
    "coinTitle": payload.coinTitle,
    "percentage": payload.percentage,
    "entryPrice": payload.entryPrice,
    "averagePrice": payload.averagePrice,
    "takeProfit": payload.takeProfit,
    "portfolio": payload.portfolio,
    "status": this.isActiveBoolean,
    "shortlong": payload.shortlong,
    "_id" : payload._id
}

console.log("constructPayload",constructPayload);
this.dataservice.editPosition(constructPayload).subscribe((result) => {
  console.log(result);
  this.editpopup = false;
  this.fetchData();
  this.showSuccess("Edited Successfully")
});
}

showError(msg:any) {
  this.toastr.error(msg);
}

showSuccess(msg:any) {
  this.toastr.success(msg);
}

}

