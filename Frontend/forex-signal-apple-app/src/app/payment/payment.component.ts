// src/app/payment/payment.component.ts
import { Component, OnInit,ChangeDetectorRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../data.service';
import { Platform, AlertController } from '@ionic/angular';
import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2/ngx';
// import {PAYMENT_METHODS, PAYMENT_REQUEST_SUPPORT, PaymentRequestService} from '@ng-web-apis/payment-request';

declare var store: any; // If using 'cordova-plugin-inapppurchase'

const PRODUCT_GEMS_KEY = 'l_earn_app_subscription';
const PRODUCT_PRO_KEY = 'l_earn_app_subscription';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
//   providers: [
//     {
//         provide: [PAYMENT_METHODS],
//         useValue: [
//             // a sample with Google Pay from https://developers.google.com/pay/api/web/guides/paymentrequest/tutorial?hl=en
//             {supportedMethods: 'https://google.com/pay', data: googlePaymentDataRequest},
//             {supportedMethods: 'basic-card'}
//         ]
//     }
// ]
})
export class PaymentComponent implements OnInit {
  gems = 0;
  isPro = false;
  products: IAPProduct[] = [];

  constructor( private toastr : ToastrService,
    // @Inject(PAYMENT_REQUEST_SUPPORT) private readonly canRequest: boolean,
    private cookieService : CookieService,
    private route: ActivatedRoute,
    private dataservice : DataService,
    private router: Router,
    // private readonly paymentRequest: PaymentRequestService,
    private plt: Platform, private store: InAppPurchase2, private alertController: AlertController, private ref: ChangeDetectorRef
    ) {
      // this.plt.ready().then(() => {
      //   // Only for debugging!
      //   this.store.verbosity = this.store.DEBUG;
  
      //   this.registerProducts();
      //   this.setupListeners();
  
      //   // Get the real product information
      //   this.store.ready(() => {
      //     this.products = this.store.products;
      //     this.ref.detectChanges();
      //   });
      // });
    }

  //   pay(details: PaymentDetailsInit) {
  //     this.paymentRequest.request(details).then(
  //         response => {
  //             response.complete();
  //         },
  //         error => {},
  //     );
  // }

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
    // store.verbosity = store.DEBUG;
    // store.register({
    //   id: 'your_product_id',
    //   alias: 'Your Product Name',
    //   type: store.NON_CONSUMABLE,
    // });

    // store.refresh();
  }

  openPopup() {
    // Define the URL you want to open in the popup
    const url = 'https://buy.stripe.com/28ocQ0alDgMYfaobIL';

    // Define the properties of the popup window
    const popupWindow = window.open(url, '_top', 'width=600,height=400');

    // Focus on the popup window (optional)
    if (popupWindow) {
      popupWindow.focus();
    }
  }

  
  registerProducts() {
    this.store.register({
      id: PRODUCT_GEMS_KEY,
      type: this.store.NON_CONSUMABLE,
    });

    this.store.register({
      id: PRODUCT_PRO_KEY,
      type: this.store.NON_CONSUMABLE,
    });

    this.store.refresh();
  }

  setupListeners() {
    // General query to all products
    this.store.when('product')
      .approved((p: IAPProduct) => {
        console.log("p",p);
        // Handle the product deliverable
        if (p.id === PRODUCT_PRO_KEY) {
          this.isPro = true;
        } else if (p.id === PRODUCT_GEMS_KEY) {
          this.gems += 100;
        }
        this.ref.detectChanges();

        return p.verify();
      })
      .verified((p: IAPProduct) => p.finish());


    // Specific query for one ID
    this.store.when(PRODUCT_PRO_KEY).owned((p: IAPProduct) => {
      this.isPro = true;
    });
  }

  purchase(product: IAPProduct) {
    this.store.order(product).then((p: any) => {
      // Purchase in progress!
    }, (e: any) => {
      this.presentAlert('Failed', `Failed to purchase: ${e}`);
    });
  }

  // To comply with AppStore rules
  restore() {
    this.store.refresh();
  }

  async presentAlert(header:any, message:any) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
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
