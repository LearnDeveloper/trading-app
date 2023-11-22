import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DarkModeService } from 'angular-dark-mode';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})
export class AccountInfoComponent implements OnInit {
  darkMode$: Observable<boolean> = this.darkModeService.darkMode$;
  private translator = inject(TranslateService);
  constructor(    private toastr : ToastrService,private router:Router, private cookieService: CookieService,
    private darkModeService: DarkModeService,private dataservice:DataService

    ){}
  userData : any;
  nickName : any;
  notificationFlag : any;

  // https://applicationv2.l-earn.pro/signup

  linkToCopy:any;
  isLinkCopied: boolean = false;

  copyLink() {
    this.showShare = true;;
    this.showInfo('Link Copied share it with your friends to invite to L-EARN')
    setTimeout(() => {
      this.isLinkCopied = false;
    }, 2000); // Reset the "copied" message after 2 seconds
  }
  showShare : boolean = false;
  shareOnFacebook() {
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${this.linkToCopy}`;
    window.open(facebookShareUrl, '_blank');
  }

  shareOnTwitter() {
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${this.linkToCopy}`;
    window.open(twitterShareUrl, '_blank');
  }
  shareOnWhatsApp() {
    const message = 'Elevate your trading skills to professional levels and attain mastery in the art of trading';
    const url = this.linkToCopy;
    const whatsappLink = this.generateWhatsAppLink(message, url);
    window.open(whatsappLink, '_blank');
  }

  shareOnLinkedIn() {
    const url = this.linkToCopy;
    const title = 'L-EARN';
    const summary = 'Elevate your trading skills to professional levels and attain mastery in the art of trading';
    const source = 'Navigate Volatile Markets Confidently and Outperform Your Competition';
    const linkedinLink = this.generateLinkedInLink(url, title, summary, source);
    window.open(linkedinLink, '_blank');
  }

  generateWhatsAppLink(message: string, url: string): string {
    const encodedMessage = encodeURIComponent(message);
    const encodedURL = encodeURIComponent(url);
    return `https://api.whatsapp.com/send?text=${encodedMessage}%20${encodedURL}`;
  }

  generateLinkedInLink(url: string, title: string, summary: string, source: string): string {
    const encodedURL = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedSummary = encodeURIComponent(summary);
    const encodedSource = encodeURIComponent(source);
    return `https://www.linkedin.com/shareArticle?mini=true&url=${encodedURL}&title=${encodedTitle}&summary=${encodedSummary}&source=${encodedSource}`;
  }

  referalFlag : boolean = false;
  ngOnInit(): void {
    if (!localStorage.getItem('reload')) { 
      localStorage.setItem('reload', 'no reload') 
      location.reload();
    } else {
      localStorage.removeItem('reload') 
    }
   
    this.selectedLanguage = localStorage.getItem('selectedLanguage')
    const cookieValue = this.cookieService.get('luid');
    this.userData = JSON.parse(cookieValue);
    // this.userData = JSON.parse(sessionStorage.getItem('userData'));
    // this.notificationFlag = sessionStorage.getItem('notificationToken');
    this.getreferredDetails();
    const randomCode = this.generateRandomCode();
    this.linkToCopy = `https://applicationv2.l-earn.pro/signup?ReferralCode=${this.userData.refferral_code}`
    console.log(randomCode);
    console.log(this.userData);
    const words = this.userData.full_name.split(' '); // Split the string into an array of words
    const firstLetters = words.map((word: string) => word.charAt(0)); // Extract the first letter of each word
    const result = firstLetters.join(''); // Join the first letters back together
    this.nickName = result
    console.log(this.nickName);
  }
  selectedTheme: string = 'dark';

  onToggle(): void {
    console.log(this.darkModeService.toggle());
    this.darkModeService.toggle();
  }

  selectedLanguage : String = "en";
  langChanged(lang:any): void {
    this.selectedLanguage = lang;
    if (lang == 'it') {
      this.translator.use('it');
      localStorage.setItem('selectedLanguage','it')
      return;
    }
    this.translator.use('en');
    localStorage.setItem('selectedLanguage','en')
    console.log(`lang Changed to ${this.translator.currentLang}`);      

  }

  requestNotificationPermission() {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          this.showInfo('Notification Permission Granted You can now receive notifications.');
        } else {
          Notification.requestPermission().then((permission) => {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
              const notification = new Notification("Hi there!");
              // …
            }
          });
          console.warn('Notification permission denied.');
          Notification.requestPermission().then((permission) => {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
              const notification = new Notification("Hi there!");
              // …
            }
          });
          this.showError('Notification permission denied.')
        }
      });
    } else {
      console.log('Notification permission is already granted.');
      this.showSuccess('Notifications are already Enabled')
    }
  }



  // Function to display a notification
  showNotification(title: string, body: string) {
    new Notification(title, { body });
  }

  showError(msg:any) {
    this.toastr.error(msg);
  }

  showSuccess(msg:any) {
    this.toastr.success(msg);
  }

  showInfo(msg:any) {
    this.toastr.info(msg);
  }

  notifyMe() {
    if (!("Notification" in window)) {
      // Check if the browser supports notifications
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      // Check whether notification permissions have already been granted;
      // if so, create a notification
      const notification = new Notification("Hi there!");
      // …
    } else if (Notification.permission !== "denied") {
      // We need to ask the user for permission
      Notification.requestPermission().then((permission) => {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          const notification = new Notification("Hi there!");
          // …
        }
      });
    }
  
    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them anymore.
  }
  referrercode : any;
  generateRandomCode() {
    // Define the characters that can be used in the code
    const characters = 'LRN0123456789';
    const randomIndex = Math.floor(Math.random() * 67845);
    console.log(randomIndex);

  
    // Initialize the code as an empty string
    this.referrercode = `LRN${randomIndex}`;
  
  
    return this.referrercode;
  }

  logout(){
    this.cookieService.delete('luid');
    this.router.navigate(['/signin'])
    this.showSuccess('Logged out successfully')
  }

  navigateTo(){
    this.router.navigate(['/privacy'])
  }

  navigateTo2(){
    this.router.navigate(['/contact'])

  }

  navigateToTerms()
  {
    this.router.navigate(['/terms'])

  }

  referal()
  {
    this.referalFlag = true
  }

  deleteAccountflag : boolean = false;
  deleteAccount()
  {
    this.deleteAccountflag = true;
  }

  subsribedFlag : boolean =false;
  subsribed()
  {
    this.subsribedFlag = true;
  }

  Unsubsribed()
  {
    this.router.navigate(['/payment'])
  }

  deleteAccountFunction()
  {
    let payload = {
     "email" : this.userData?.email
    }
    console.log("payload",payload);
    this.dataservice.deleteaccount(payload).subscribe((result) => {
        this.showSuccess('Deleted Data Successfully')
        this.cookieService.deleteAll('luid');
        this.router.navigate(['/signin'])
        this.ngOnInit();
      
    });
  }

  referredDetails : any;

  getreferredDetails()
  {
    let payload = {
     "referralcode" : this.userData?.refferral_code
    }
    console.log("payload",payload);
    this.dataservice.getReferralDetails(payload).subscribe((result) => {
      this.referredDetails = result;
      console.log("referredDetails", this.referredDetails);
        // this.showSuccess('Deleted Data Successfully')
        // this.cookieService.deleteAll('luid');
        // this.router.navigate(['/signin'])
        // this.ngOnInit();
      
    });
  }
}
