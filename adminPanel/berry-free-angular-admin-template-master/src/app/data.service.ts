import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as AWS from 'aws-sdk';

// Import AWS SDK in your Angular service
// Configure AWS credentials
AWS.config.update({
  accessKeyId: 'AKIAQOTD3BNS2H4RCJK7',
  secretAccessKey: 'cKI8Ok7liSunjBOnj8/Dvpx8WqMn7JUmsEBYsi1Q',
});

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private s3: AWS.S3;
  private apiUrl = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/login"; // Replace with your API endpoint URL
  private getuser = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/getAllusers";
  private createuser = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/createuser";
  private verifyotpapi = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/verifyotp";
  private resendotpapi = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/resend";
  private createposition ="https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/createposition";
  private getposition = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/getposition";
  private uploadvideoAPI = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/uploadvideo";
  private getvideoAPI = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/getvideo";
  private paymentAPI = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/stripeNew";
  private editprofileAPI = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/editprofileadmin";
  private editpositionAPI = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/editpositions";
  private stripegetpayments = "https://elzls3zr6g.execute-api.us-east-1.amazonaws.com/dev/stripegetpaymentsNew";

  constructor(private http: HttpClient) {
    this.s3 = new AWS.S3();
  }

  login(payload: any): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }

  getUser(): Observable<any> {
    return this.http.post(this.getuser,'');
  }

  getVideo(): Observable<any> {
    return this.http.post(this.getvideoAPI,'');
  }

  getPayments(): Observable<any> {
    return this.http.post(this.stripegetpayments,'');
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

  uploadvideo(payload: any): Observable<any> {
    return this.http.post(this.uploadvideoAPI, payload);
  }

  editProfile(payload: any): Observable<any> {
    return this.http.post(this.editprofileAPI, payload);
  }

  editPosition(payload: any): Observable<any> {
    return this.http.post(this.editpositionAPI, payload);
  }

  fetchPayments(): Observable<any> {
    return this.http.post(this.paymentAPI, '');
  }

  

  // uploadVideo(file: File, bucketName: string, key: string): AWS.S3.ManagedUpload {
  //   const params: AWS.S3.PutObjectRequest = {
  //     Bucket: bucketName,
  //     Key: key,
  //     Body: file,
  //   };

  //   return this.s3.upload(params, (err, data) => {
  //     if (err) {
  //       console.error('Video upload error', err);
  //     } else {
  //       console.log('Video uploaded successfully', data);
  //     }
  //   });
  // }

  startVideoUpload(file: File, bucketName: string, key: string): Promise<AWS.S3.CreateMultipartUploadOutput> {
    const params: AWS.S3.CreateMultipartUploadRequest = {
      Bucket: bucketName,
      Key: key,
      ACL: 'public-read',
      ContentType: file.type,
    };

    return this.s3.createMultipartUpload(params).promise();
  }

  uploadVideoPart(uploadId: string, file: File, bucketName: string, key: string, partNumber: number, body: Blob): Promise<AWS.S3.UploadPartOutput> {
    const params: AWS.S3.UploadPartRequest = {
      Bucket: bucketName,
      Key: key,
      PartNumber: partNumber,
      UploadId: uploadId,
      Body: body,
    };

    return this.s3.uploadPart(params).promise();
  }

  completeVideoUpload(uploadId: string, bucketName: string, key: string, parts: AWS.S3.CompletedPart[]){
    const params: AWS.S3.CompleteMultipartUploadRequest = {
      Bucket: bucketName,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts },
      
    };

    return this.s3.completeMultipartUpload(params).promise();
  }



}
