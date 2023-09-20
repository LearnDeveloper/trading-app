import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/login"; // Replace with your API endpoint URL
  private getuser = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/getAllusers";
  private createuser = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/createuser";
  private verifyotpapi = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/verifyotp";
  private resendotpapi = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/resend";
  private createposition ="https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/createposition";
  private getposition = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/getposition";

  constructor(private http: HttpClient) {}

  login(payload: any): Observable<any> {
    return this.http.post(this.apiUrl, payload);
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

  createpositionfunction(payload: any): Observable<any> {
    return this.http.post(this.createposition, payload);
  }

  getpositionfunction(): Observable<any> {
    return this.http.post(this.getposition,'');
  }

}
