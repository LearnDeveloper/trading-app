import { Component, OnInit, Renderer2 } from '@angular/core';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    // Create a script element
    const script = this.renderer.createElement('script');

    // Set the script source
    script.src = 'https://dev.l-earn.pro/script.js';

    // Append the script to the DOM (e.g., to the body)
    this.renderer.appendChild(document.body, script);
  }
}
