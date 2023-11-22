import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.scss']
})
export class PositionsComponent {
  constructor(private datePipe: DatePipe,private dataService : DataService,  private cookieService : CookieService,private router: Router
    ) {}
 date:any;
 result : any;
 userData : any;
 loading: boolean = false;
  ngOnInit() {
    this.getPositions();
      this.result = [
      { 
        title: "BTC/USDT",
        percentage:"+17.15%",
        entryprice : "1.78",
        averageprice : "1.23",
        takeprice : "1.23",
        portfolio : "5%",
        category : "opened",
        flag : "short"
      },
      { 
        title: "BTC/USDT",
        percentage:"+17.15%",
        entryprice : "1.78",
        averageprice : "1.23",
        takeprice : "1.23",
        portfolio : "5%",
        category : "opened",
        flag : "long"
      },
      { 
        title: "BTC/USDT",
        percentage:"+17.15%",
        entryprice : "1.78",
        averageprice : "1.23",
        takeprice : "1.23",
        portfolio : "5%",
        category : "opened",
        flag : "short"
      },
      { 
        title: "BTC/USDT",
        percentage:"+17.15%",
        entryprice : "1.78",
        averageprice : "1.23",
        takeprice : "1.23",
        portfolio : "5%",
        category : "opened",
        flag : "long"
      },
      { 
        title: "BTC/USDT",
        percentage:"+17.15%",
        entryprice : "1.78",
        averageprice : "1.23",
        takeprice : "1.23",
        portfolio : "5%",
        category : "opened",
        flag : "long"
      },

    ]
    const cookieValue = this.cookieService.get('luid');
    this.userData = JSON.parse(cookieValue);
    if(!this.userData.isSubscribed)
    {
      this.router.navigate(['/payment'])
    }
    if(!this.userData.authenticated)
    {
      this.router.navigate(['/otp'])
    }
  
    const currentDate = new Date();
    this.date = this.datePipe.transform(currentDate, 'dd-MM-YYYY- HH:mm:ss', 'Asia/Dubai');
    console.log('Current Date and Time in AEDT (Abu Dhabi):', this.date);
  }

  formatDate(dateString: string): string {
    // Parse the input date string to a Date object
    const date = new Date(dateString);
  
    // Format the date in the desired format
    return this.datePipe.transform(date, 'dd/MM/yy');
  }

  getFormattedDateTimeInAEDT() {
    const currentDate = new Date();
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Australia/Sydney',
      hour: '2-digit',
      minute: '2-digit',
    };
    const formattedTime = this.datePipe.transform(currentDate, 'HH:mm', 'AEDT', 'en-AU');

    const day = currentDate.getDate();
    const month = currentDate.toLocaleString('default', { month: 'short' });
    const year = currentDate.getFullYear();

    const dayWithSuffix = this.getDayWithSuffix(day);

    return `AEDT ${formattedTime} ${dayWithSuffix} ${month} ${year}`;
  }

  // Function to get the day with the "st," "nd," "rd," or "th" suffix
  getDayWithSuffix(day: number) {
    if (day >= 11 && day <= 13) {
      return `${day}th`;
    }
    switch (day % 10) {
      case 1:
        return `${day}st`;
      case 2:
        return `${day}nd`;
      case 3:
        return `${day}rd`;
      default:
        return `${day}th`;
    }
  }

  dataPosition : any;
  openPosition : any;
  closePosition : any;
  getPositions() {
    this.loading = true;
    // // Implement OTP resend logic here
    // // Reset the countdown and enable the "Resend OTP" button
    // let payload = {
    //   email: this.data[0].data[0].email,
    //   otp : ``
    // }
    this.dataService.getPositions().subscribe((result) => {
      this.loading = false;
      this.dataPosition = result;
      console.log(this.dataPosition);
      this.openPosition = this.dataPosition.filter((x: { category: string; }) => x.category == "opened").reverse();
      this.closePosition = this.dataPosition.filter((x: { category: string; }) => x.category == "closed").reverse();

      // this.openPosition.filter((x: { status: boolean; })=>x.status == true).reverse();
      // this.closePosition.filter((x: { status: boolean; })=>x.status == true).reverse();
      console.log("openPosition",this.openPosition);
      console.log("closePosition",this.closePosition);
      if(this.dataPosition.responseCode == "1001")
      {
        // this.showError("Unable to Send OTP");
        // return;
      }
      else{
        // this.showSuccess('OTP sent successfully')
        // this.router.navigate(['/otp'])
      }
      
    });
  }

  calCulatorFlag : boolean = false;
  performAction()
  {
    if(this.calCulatorFlag)
    {
    this.calCulatorFlag = false;
    return;
    }
    else{
      this.calCulatorFlag = true;
      return;
    }
   
  }



}
