// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-add-position',
//   templateUrl: './add-position.component.html',
//   styleUrls: ['./add-position.component.scss']
// })
// export class AddPositionComponent {

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
import { DatePipe, Location, LocationStrategy } from '@angular/common';
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
  selector: 'app-add-position',
  templateUrl: './add-position.component.html',
  styleUrls: ['./add-position.component.scss']
})
export class AddPositionComponent {
  // public props
  displayedColumns: string[] = ['user id', 'full name', 'email','phone number','is Active','device details', 'Action']; // Replace with your column names
  dataSource: MatTableDataSource<any>;
  selectedPosition: string = 'opened'; // Default to 'opened' position

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  popup : boolean = false;

  berryConfig;
  navCollapsed: boolean;
  navCollapsedMob = false;
  windowWidth: number;
  color = '#0056b3'
  positionForm: FormGroup;
  closedPositionForm: FormGroup;    
  // Constructor  constructor(public dialog: MatDialog) {}

  constructor(
    private zone: NgZone,
    private location: Location,
    private locationStrategy: LocationStrategy,
    private dataservice : DataService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private datePipe: DatePipe,
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
  date:any;
  ngOnInit(): void {
    const currentDate = new Date();
    this.date = this.datePipe.transform(currentDate, 'dd-MM-YYYY- HH:mm:ss', 'Asia/Dubai');
    console.log('Current Date and Time in AEDT (Abu Dhabi):', this.date);
    this.positionForm = this.fb.group({
      coinTitle: ['', [Validators.required, Validators.maxLength(10)]],
      percentage: ['', [Validators.required, Validators.maxLength(5)]],
      entryPrice: ['', [Validators.required, Validators.maxLength(5)]],
      averagePrice: ['', [Validators.required, Validators.maxLength(5)]],
      takeProfit: ['', [Validators.required, Validators.maxLength(5)]],
      portfolio: ['', [Validators.required, Validators.maxLength(6)]],
      shortlong: ['1',[Validators.required]],
      status :[true,[Validators.required]]
    });
    this.closedPositionForm = this.fb.group({
      openDate: ['', [Validators.required]],
      closedEntryPrice: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      closeDate: ['', [Validators.required, Validators.maxLength(5)]],
      closedExitPrice: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      closedCoinTitle : ['', [Validators.required, Validators.maxLength(10)]],
      closedPercentage :['', [Validators.required, Validators.maxLength(10)]],
      closedshortlong : ['1',[Validators.required]],
      closedstatus : [true,[Validators.required]]
    });
  }

  onSubmit() {
    if (this.positionForm.valid) {
      let payload = {
        "coinTitle": this.positionForm.get('coinTitle').value,
        "percentage": this.positionForm.get('percentage').value,
        "entryPrice": this.positionForm.get('entryPrice').value,
        "averagePrice": this.positionForm.get('averagePrice').value,
        "takeProfit": this.positionForm.get('takeProfit').value,
        "portfolio": this.positionForm.get('portfolio').value,
        "shortlong": this.positionForm.get('shortlong').value,
        "createdTime" : this.date,
        "category" : this.selectedPosition,
        "status" : this.positionForm.get('status').value
    }
    console.log("payload",payload);
    this.dataservice.createpositionfunction(payload).subscribe((result) => {
      // this.data = result;
     console.log("result", result);
     this.showSuccess(`${this.selectedPosition} Position is added successfully`)
    });
    }
  }

  onSubmitClosed() {
      let payload = {
        "openDate": this.closedPositionForm.get('openDate').value,
        "closedEntryPrice": this.closedPositionForm.get('closedEntryPrice').value,
        "closeDate": this.closedPositionForm.get('closeDate').value,
        "closedExitPrice": this.closedPositionForm.get('closedExitPrice').value,
        "closedstatus": this.closedPositionForm.get('closedstatus').value,
        
        "CoinTitle": this.closedPositionForm.get('closedCoinTitle').value,
        "percentage": this.closedPositionForm.get('closedPercentage').value,
        "shortlong": this.closedPositionForm.get('closedshortlong').value,

        "category" : this.selectedPosition,
        "createdTime" : this.date
    }
    console.log("payload",payload);
    this.dataservice.createpositionfunction(payload).subscribe((result) => {
      // this.data = result;
     console.log("result", result);
     this.showSuccess(`${this.selectedPosition} Position is added successfully`)
    });
      // You can access the form values using this.userForm.value
      // Add your logic here, e.g., send data to the server
      console.log(this.closedPositionForm.value);
  }
  data : any;
  editpopup : boolean = false;

  
  selectedUser : any;

  showError(msg:any) {
    this.toastr.error(msg);
  }

  showSuccess(msg:any) {
    this.toastr.success(msg);
  }

}
