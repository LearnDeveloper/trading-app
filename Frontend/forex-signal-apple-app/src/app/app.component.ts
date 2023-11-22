import { Component, inject } from '@angular/core';
import { getAnalytics,logEvent } from "firebase/analytics";
import { TranslateService } from '@ngx-translate/core';
import { initializeApp } from 'firebase/app';
import { Router } from '@angular/router';
import { getMessaging,getToken,onMessage   } from "firebase/messaging";
import { Token } from '@angular/compiler';
import { onBackgroundMessage } from "firebase/messaging/sw";
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { CookieService } from 'ngx-cookie-service';
import { DarkModeService } from 'angular-dark-mode';
import { DataService } from './data.service';


// TODO: Replace the following with your app's Firebase project configuration



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  showSplash = true;
  deviceInfo:String;
  deviceLocation :any = [];
  ipAddress: string;
  firebaseConfig = {
    apiKey: "AIzaSyBIPE77ZX4fHpr4h2pUaGJN9ojtNX3YK-g",
    authDomain: "trading-app-7c173.firebaseapp.com",
    projectId: "trading-app-7c173",
    storageBucket: "trading-app-7c173.appspot.com",
    messagingSenderId: "814500289946",
    appId: "1:814500289946:web:fe18257396c1f30a4dee23",
    measurementId: "G-L2BX08X7LP"
  };

  loggedInData : any;
  user: SocialUser;
  loggedIn: boolean;
  userData : any;
  tokenPopUp : boolean = false;

  ngOnInit(): void {
    localStorage.setItem('selectedLanguage','en')
    // if(!this.userData.isSubscribed)
    // {
    //   this.router.navigate(['/payment'])
    // }
     this.darkModeService.enable()
    this.cookieService.set('lang',this.translator.currentLang);
    const app = initializeApp(this.firebaseConfig);
    const analytics = getAnalytics(app);
    console.log("analytics", analytics);
    const messaging = getMessaging(app);
   logEvent(analytics, 'notification_received');
   getToken(messaging, { vapidKey: 'BN-YAlD70D-60fJxcYr94ekjaJoSHWPxp8K2xE8odE_CeVIGFiekez55ksrVuzjJVOojk8WUeamesOxOJrj_2fk' }).then((currentToken) => {
    if (currentToken) {
      console.log("token",currentToken);
      sessionStorage.setItem('notificationToken',"true");
      let payload = {
        token : currentToken
      }
      this.dataService.updateToken(payload).subscribe((result) => {
        console.log("Token Saved");
      });
      // Send the token to your server and update the https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/updatenotificationtoken UI if necessary
      // ...
      
    } else {
      // Show permission request UI
      console.log('No registration token available. Request permission to generate one.');
      sessionStorage.setItem('notificationToken',"false");

      // ...                                                                                                                                                                                                                                            
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    sessionStorage.setItem('notificationToken',"false");

    // ...
  });
  const messagingData = getMessaging();
onMessage(messagingData, (payload) => {
  console.log('Message received. ', payload);
  // ...



});

    // Simulate a delay (e.g., 3 seconds) to hide the splash screen
    setTimeout(() => {
      this.showSplash = false;
    }, 1500); // 3000 milliseconds = 3 seconds
  }

  message:any = null;
  constructor(private router: Router,
    private translator: TranslateService,
    private authService: SocialAuthService,
    private cookieService: CookieService,
    private darkModeService: DarkModeService,
    private lightModeClass:DarkModeService,
    private dataService: DataService
    // private afMessaging: AngularFireMessaging

    ) {
      console.log("App Component called")
      translator.setDefaultLang('en');
      translator.use('en');
  }
  
  requestNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission()
        .then(permission => {
          if (permission === 'granted') {
            // this.subscribeToPushNotifications();
            const notification = new Notification("Welcome to L-earn this is a demo notification you will be receieving the notifications whenever the positions are updated");
            this.tokenPopUp = true;
          }
          else {
            console.log('Notification permission denied.');
          }
        })
        .catch(error => {
          console.error('Error requesting notification permission:', error);
        });
    }
    // if (!("Notification" in window)) {
    //   // Check if the browser supports notifications
    //   alert("This browser does not support desktop notification");
    // } else if (Notification.permission === "granted") {
    //   // Check whether notification permissions have already been granted;
    //   // if so, create a notification
    //   const notification = new Notification("Hi there!");
    //   // …
    // } else if (Notification.permission !== "denied") {
    //   // We need to ask the user for permission
    //   Notification.requestPermission().then((permission) => {
    //     // If the user accepts, let's create a notification
    //     if (permission === "granted") {
    //       const notification = new Notification("Welcome to L-earn this is a demo notification you will be receieving the notifications whenever the positions are updated");
    //       // …
    //     }
    //   });
    // }
  }

  iosPushNotificationRequest()
  {
    // if (window?.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers['push-permission-request']) {
    //   window.iOSPushCapability = true;
    // }
    // const pushPermissionRequest = function(){
    //   if (window.iOSPushCapability)
    //     window.webkit.messageHandlers['push-permission-request'].postMessage('push-permission-request');
    // }
    // window.addEventListener('push-permission-request', (message) => {
    //   if (message && message.detail){
    //     switch (message.detail) {
    //       case 'granted':
    //         // permission granted
    //         break;
    //       default:
    //         // permission denied
    //         break;
    //     }
    //   }
    // });
  }

  
  

  // subscribeToPushNotifications() {
  //   navigator.serviceWorker.ready.then(registration => {
  //     registration.pushManager
  //       .subscribe({
  //         userVisibleOnly: true,
  //         applicationServerKey: 'yourServerPublicKey', // Replace with your server's public key
  //       })
  //       .then(subscription => {
  //         // Send the subscription object to your server for sending push notifications.
  //         console.log('Subscribed to push notifications:', subscription);
  //       })
  //       .catch(error => {
  //         console.error('Error subscribing to push notifications:', error);
  //       });
  //   });
  // }

}