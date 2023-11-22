import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss']
})
export class SplashComponent implements OnInit {
  ngOnInit(): void {
    // Check if the flag is set in local storage
    const hasSplashBeenDisplayed = localStorage.getItem('splashDisplayed');

    if (!hasSplashBeenDisplayed) {
      // Display the splash screen
      // ...

      // Set the flag in local storage to indicate that the splash screen has been displayed
      localStorage.setItem('splashDisplayed', 'true');
    }
  }
}
