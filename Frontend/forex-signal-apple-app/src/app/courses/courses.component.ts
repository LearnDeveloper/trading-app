import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  constructor(
    private cookieService: CookieService, private http: HttpClient
    ){}

    userData:any;
  ngOnInit()
  {
    const cookieValue = this.cookieService.get('luid');
    this.userData = JSON.parse(cookieValue);
    console.log("userdata", this.userData);
  
  }

  sendMail() {
   
    this.http.post('mail.php', 'vikivikas41@gmail.com').subscribe();
  
}

}
