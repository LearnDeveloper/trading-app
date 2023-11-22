import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/login"; // Replace with your API endpoint URL
  private getuser = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/getuser";
  private createuser = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/createuser";
  private verifyotpapi = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/verifyotp";
  private resendotpapi = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/resend";
  private getPositionAPI = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/getposition";
  private videoAPI = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/getvideo";
  private editProfileAPI = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/editprofile";
  private deleteAPI = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/deleteaccount";
  private updatepaymentAPI = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/updatepayment";
  private email = "https://applicationv2.l-earn.pro/mail.php";
  private updateTokenAPI  = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/updatenotificationtoken";
  private updatelikesAPI = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/updatelikes";
  private getlikesbyUserIdAPI = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/getlikesbyuserid";
  private updatevideoviewAPI = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/updatevideoview";
  private getReferralDetailsAPI = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/getreferreddetails";
  private forgotpasswordAPI = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/forgotpassword";


  constructor(private http: HttpClient) {}

  login(payload: any): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }

  updatevideoview(payload: any): Observable<any> {
    return this.http.post(this.updatevideoviewAPI, payload);
  }

  getuserlikes(payload: any): Observable<any> {
    return this.http.post(this.getlikesbyUserIdAPI, payload);
  }

  updateToken(payload: any): Observable<any> {
    return this.http.post(this.updateTokenAPI, payload);
  }

  updateLikes(payload: any): Observable<any> {
    return this.http.post(this.updatelikesAPI, payload);
  }

  sendMail(payload: any): Observable<any> {
    return this.http.post(this.email, payload);
  }

  getUser(): Observable<any> {
    return this.http.post(this.getuser,'');
  }

  createUser(payload: any): Observable<any> {
    return this.http.post(this.createuser, payload);
  }

  
   verifyOtp(payload: any): Observable<any> {
    return this.http.post(this.verifyotpapi, payload);
  }

  resendOtp(payload: any): Observable<any> {
    return this.http.post(this.resendotpapi, payload);
  }

  forgotpassword(payload: any): Observable<any> {
    return this.http.post(this.forgotpasswordAPI, payload);
  }

  getPositions(): Observable<any> {
    return this.http.post(this.getPositionAPI,'');
  }
  

  getVideos(): Observable<any> {
    return this.http.post(this.videoAPI,'');
  }

  editProfile(payload:any): Observable<any> {
    return this.http.post(this.editProfileAPI,payload);
  }

  deleteaccount(payload:any): Observable<any> {
    return this.http.post(this.deleteAPI,payload);
  }

  getReferralDetails(payload:any): Observable<any> {
    return this.http.post(this.getReferralDetailsAPI,payload);
  }

  updatepayment(payload:any): Observable<any> {
    return this.http.post(this.updatepaymentAPI,payload);
  }

} 
