import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../data.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
  animations: [
    trigger('fadeInAnimation', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        animate('0.5s ease-in', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class ContactUsComponent {

  constructor(
    private toastr : ToastrService,
    private dataservice: DataService
    ) {
    }
 


    // deleteAccountFunction()
    // {
    //   let payload = {
    //    "email" : this.userData?.email
    //   }
    //   console.log("payload",payload);
    //   this.dataservice.deleteaccount(payload).subscribe((result) => {
    //       this.showSuccess('Deleted Data Successfully')
    //       this.cookieService.deleteAll('luid');
    //       this.router.navigate(['/signin'])
    //       this.ngOnInit();
        
    //   });
    // }

    sendMail()
    {

      // https://applicationv2.l-earn.pro/mail.php
      this.dataservice.sendMail('vikivikas41@gmail.com').subscribe((result) => {
        
        this.showSuccess('Mail Sent Successfuly,Team will get back to you within next 2')
        // this.showSuccess('Deleted Data Successfully')
        // this.cookieService.deleteAll('luid');
        // this.router.navigate(['/signin'])
        // this.ngOnInit();
      
    });
     
    }

    showSuccess(msg:any) {
      this.toastr.success(msg);
    }
}
