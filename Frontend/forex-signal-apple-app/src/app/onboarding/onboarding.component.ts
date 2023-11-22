// onboarding.component.ts
import { Component,ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent implements OnInit {
  private translator = inject(TranslateService);

  getCurrentSlideNumber(item:any) {
  console.log("item",item);
  }

  
  slides:any = [
    {
      image: '../../assets/images/onboard1.png',
      title: 'Welcome to My App',
      description: 'Get started with our amazing features.',
      id : "1"
    },
    {
      image: '../../assets/images/onboard2.png',
      title: 'Feature 1',
      description: 'Description of Feature 1.',
      id : "2"
    },
    {
      image: '../../assets/images/onboard3.png',
      title: 'Feature 2',
      description: 'Description of Feature 2.',
      id : "3"
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigate(place:String){
    if(place == "signin")
    {
      this.router.navigate(['signin']);
    }
    else if(place == "signup")
    {
      this.router.navigate(['signup']);
    }
  }

  langChanged(lang:any): void {
    console.log(`lang Changed to ${this.translator.currentLang}`);      
    if (lang == 'it') {
      this.translator.use('it');
      return;
    }
    this.translator.use('en');
  }
  
}
