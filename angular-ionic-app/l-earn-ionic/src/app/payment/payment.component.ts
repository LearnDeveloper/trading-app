// src/app/payment/payment.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../data.service';

declare var store: any; // If using 'cordova-plugin-inapppurchase'


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  constructor( private toastr : ToastrService,
    private cookieService : CookieService,
    private route: ActivatedRoute,
    private dataservice : DataService,
    private router: Router,
    ) {}

    queryParam : any;
    userData : any;
  ngOnInit(): void {
    const cookieValue = this.cookieService.get('luid');
    console.log("cookie",cookieValue);
    this.userData = JSON.parse(cookieValue);
    console.log("userData", this.userData);
    this.route.queryParams.subscribe(params => {
      const referralCode = params['status'];
      if (referralCode) {
        this.queryParam = referralCode;
        console.log('Referral Code:', referralCode);
        this.updatepaymentFunction();
      }
    });
    store.verbosity = store.DEBUG;
    store.register({
      id: 'your_product_id',
      alias: 'Your Product Name',
      type: store.NON_CONSUMABLE,
    });

    store.refresh();
  }

  openPopup() {
    // Define the URL you want to open in the popup
    const url = 'https://buy.stripe.com/test_9AQcO5azRcxQ3pC5km';

    // Define the properties of the popup window
    const popupWindow = window.open(url, '_top', 'width=600,height=400');

    // Focus on the popup window (optional)
    if (popupWindow) {
      popupWindow.focus();
    }
  }

  purchaseProduct() {
    store.order('your_product_id');
  }

  handlePurchaseEvent(purchase:any) {
    if (purchase && purchase.purchaseState === store.FINISHED) {
      // Handle successful purchase
      console.log('Purchase successful');
    } else {
      // Handle purchase failure or other events
      console.log('Purchase failed or cancelled');
    }
  }

  updatepaymentFunction()
  {
    let payload = {
     "email" : this.userData?.email,
     "path" : "payment"
    }
    console.log("payload",payload);
    this.dataservice.updatepayment(payload).subscribe((result) => {
      console.log(result);
      this.showSuccess('Payment Successful')
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

}
