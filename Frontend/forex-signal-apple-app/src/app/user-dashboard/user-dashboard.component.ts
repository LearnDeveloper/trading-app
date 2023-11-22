import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe, Location } from '@angular/common';
import * as Plyr from 'plyr';
import { Router } from '@angular/router';



@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})


export class UserDashboardComponent {
  paymentURL = "http://localhost:4200/user-dashboard?paymentsuccess=token:LRN12912";

  @ViewChild('videoPlayer') videoPlayer: ElementRef;

  user : any;
  poster = 'https://dev.l-earn.pro/assets/images/Logo.png'
  userData : any;
  notificationFlag : any;
  loggedIn : boolean;
  nickName : any;
  loading : boolean = false;
  constructor(private authService: SocialAuthService,private dataService : DataService,private location: Location,
    private cookieService: CookieService,private datePipe: DatePipe,private router: Router
    ){}
  ngOnInit() {
 
    this.getCurrentUrl()
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
    this.notificationFlag = sessionStorage.getItem('notificationToken');
    console.log("cookieValue",JSON.parse(cookieValue));
    const words = this.userData.full_name.split(' '); // Split the string into an array of words
    const firstLetters = words.map((word: string) => word.charAt(0)); // Extract the first letter of each word
    const result = firstLetters.join(''); // Join the first letters back together
    this.nickName = result
    console.log(this.nickName);
    this.getVideos();
    this.getuserLikesbyID();
  }
  signOut(): void {
    this.authService.signOut();
    console.log('Logged out successfully...')
  }
  selectedLanguage : String = 'en';

  langChanged(lang:any): void {
    this.selectedLanguage = lang;
    console.log("en", this.selectedLanguage);
    if (lang == 'it') {
      return;
    }
  }
  // ngAfterViewInit() {
  //   const player = new Plyr(this.videoPlayer.nativeElement);
  // }
  getCurrentUrl() {
    let url = window.location.href
    console.log( window.location.href);
    if(url == this.paymentURL)
    {
      // call Payout Function
    }
  }

  encryptAndStoreData(data: string) {
    const encryptedData = CryptoJS.AES.encrypt(data, 'secret-key').toString();
    this.cookieService.set('encryptedCookie', encryptedData);
  }
  decryptAndGetData() {
    const encryptedData = this.cookieService.get('encryptedCookie');
    if (encryptedData) {
      const bytes = CryptoJS.AES.decrypt(encryptedData, 'secret-key');
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      console.log("decryptedData",decryptedData)
      return decryptedData;

    }
    return null;
  }

  title = 'angular-videoplayer-app';
  playlist = [
    {
      title: 'Welcome to Trading',
      src: 'https://learnmainfeeds.s3.amazonaws.com/videos/3a3fb848-8528-4222-af92-0225b1a5eed7.mp4',
      type: 'video/mp4',
      description : "Description goes here Description goes here Description goes here Description goes here Description goes here Description goes here"
    },
    {
      title: 'Welcome to Trading 2',
      src: 'h../../assets/demo2.mp4',
      type: 'video/mp4',
      description : "Description goes here Description goes here Description goes here Description goes here Description goes here Description goes here"
    },
    {
      title: 'Welcome to Trading 3',
      src: '../../assets/demo.mp4',
      type: 'video/mp4',
      description : "Description goes here Description goes here Description goes here Description goes here Description goes here Description goes here"
    }
  ];
  currentIndex = 0;
  activeVideo = this.playlist[this.currentIndex];
  api!: { getDefaultMedia: () => { (): any; new(): any; subscriptions: { (): any; new(): any; loadedMetadata: { (): any; new(): any; subscribe: { (arg0: () => void): void; new(): any; }; }; ended: { (): any; new(): any; subscribe: { (arg0: () => void): void; new(): any; }; }; }; }; play: () => void; };

  onPlayerSet(api: any) {
    this.api = api;
    this.api.getDefaultMedia().subscriptions.loadedMetadata.subscribe(this.startVideo.bind(this));
    this.api.getDefaultMedia().subscriptions.ended.subscribe(this.nextVideo.bind(this));
  }
  nextVideo() {
    this.currentIndex++;
    if (this.currentIndex === this.playlist.length) {
      this.currentIndex = 0;
    }
    this.activeVideo = this.playlist[this.currentIndex];
  }
  startVideo() {
    this.api.play();
  }
  onClickPlaylistVideo(item: { title: string; src: string; type: string; description: string }, index: number) {
    this.currentIndex = index;
    this.activeVideo = item;
  }

  videoData : any;

  englishData : any[] = [];
  italianData : any[] = [];
  getVideos() {
  this.loading = true;
    // // Implement OTP resend logic here
    // // Reset the countdown and enable the "Resend OTP" button
    // let payload = {
    //   email: this.data[0].data[0].email,
    //   otp : ``
    // }
    this.dataService.getVideos().subscribe((result) => {
      this.loading = false;
      this.videoData = result;
      for(let i=0; i < this.videoData.length; i++)
      {
        this.englishData.push(
          {
            title:this.videoData[i].titleEng,
            subtitle: this.videoData[i].subtitleEng,
            videourl : this.videoData[i].videourlEng,
            created_date : this.videoData[i].created_date,
            totalviews : this.videoData[i].totalviews,
            isSelected : this.videoData[i].isSelected,
            id : this.videoData[i].id


          }
        )
        if(this.videoData[i].titleIta != null)
        {
        this.italianData.push(
          {
            title:this.videoData[i].titleIta,
            subtitle: this.videoData[i].subtitleIta,
            videourl : this.videoData[i].videourlIta,
            created_date : this.videoData[i].created_date,
            totalviews : this.videoData[i].totalviews,
            isSelected : this.videoData[i].isSelected,
            id : this.videoData[i].id




          }
        )
      }
    }
      console.log("enf", this.englishData);
      console.log("ita", this.italianData);


      
    });
  }

  videoLikes:any;
  // videoLikes:any = [
  //   {
  //    id:"2"
  //   },
  //   {
  //     id:"4"
  //    }
  // ]

  // isVideoliked(id:any){
  //   console.log("id",id)
  //   return this.videoLikes.includes(id);
  // }
  isVideoLiked(id: any): boolean {
    const idToCheck: any[] = this.videoLikes.map((item: { id: any; }) => item.id); // Extract "id" values
    return idToCheck.includes(id);
  }
  


  popupFlag : boolean = false;

  closePopup(){

  }

  formatDate(originalDate: string): string {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const [day, month, year, time] = originalDate.split(/[-:]/);
    const [hours, minutes, seconds] = time.split(':');

    const monthName = months[parseInt(month, 10) - 1];
    const formattedDate = `${monthName} ${parseInt(day, 10)}, ${year}`;

    return formattedDate;
  }
  videos = [
    {
      title: 'Video Title 1',
      subtitle: 'Sub Title 1',
      views: 1000,
      date: '2023-01-15',
      thumbnail: 'https://example.com/thumbnail1.jpg',
    },
    {
      title: 'Video Title 2',
      subtitle: 'Sub Title 2',
      views: 1500,
      date: '2023-01-16',
      thumbnail: 'https://example.com/thumbnail2.jpg',
    },
    // Add more video data here...
  ];



  popupUrl : any;
  subtitlePopup : any;
  titlePopUp : any;
  videoView(url:any,title: any,subtitle:any){
    console.log(title);
    this.subtitlePopup = subtitle
    this.titlePopUp = title;
    this.popupUrl = url;
    this.popupFlag = true;
    console.log(url);

  }
  calCulatorFlag : boolean =false;

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

  isSelected: boolean = false;


  toggleSelected(video : any,action:any) {
    console.log("videoLikes", this.videoLikes);

    if(action == 'add')
    {
      console.log("video", video);
      let payload = {
        userId : this.userData.user_id,
        id : video.id,
        action : "add"
      }
      this.videoLikes.push(payload);
      console.log("payload",payload);
      this.dataService.updateLikes(payload).subscribe((result) => {
        this.getuserLikesbyID();
        console.log("addedd");
      });
    }
    if(action == 'remove')
    {
      const idToRemove = video.id;
      this.removeItemById(this.videoLikes, idToRemove);
      console.log("video", video);
      let payload = {
        userId : this.userData.user_id,
        id : video.id,
        action : "remove"
      }
      console.log("payload",payload);
      this.dataService.updateLikes(payload).subscribe((result) => {
        this.getuserLikesbyID();
        console.log("removed");
      });
    }

  }

  removeItemById(array:any, idToRemove:any) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === idToRemove) {
        array.splice(i, 1);
        i--; // Decrement i to account for the removed element
      }
    }
  }

  getuserLikesbyID()
  {
    let payload = {
      userId : this.userData.user_id,
    }
    this.dataService.getuserlikes(payload).subscribe((result) => {
      this.videoLikes = result;
      console.log("Saved");
    });
  }

  updatevideoView(video:any){
   console.log(video);
   let payload = {
    id : video.id
   }
   this.dataService.updatevideoview(payload).subscribe((result) => {;
    console.log("view updated");
  });
  }
  

}
