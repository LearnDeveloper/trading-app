// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-add-videos',
//   templateUrl: './add-videos.component.html',
//   styleUrls: ['./add-videos.component.scss']
// })
// export class AddVideosComponent {

// }


// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-add-position',
//   templateUrl: './add-position.component.html',
//   styleUrls: ['./add-position.component.scss']
// })
// export class AddPositionComponent {

// }


// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-view-user',
//   templateUrl: './view-user.component.html',
//   styleUrls: ['./view-user.component.scss']
// })
// export class ViewUserComponent {

// }

// Angular import
import { Component, NgZone, ViewChild } from '@angular/core';
import { DatePipe, Location, LocationStrategy } from '@angular/common';
import { BerryConfig } from '../app-config';
import { DataService } from '../data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { S3 } from 'aws-sdk'; // Import AWS SDK
import { bool } from 'aws-sdk/clients/signer';

// Project import

@Component({
  selector: 'app-add-videos',
  templateUrl: './add-videos.component.html',
  styleUrls: ['./add-videos.component.scss']
})
export class AddVideosComponent {
  // public props
  displayedColumns: string[] = ['user id', 'full name', 'email','phone number','is Active','device details', 'Action']; // Replace with your column names
  dataSource: MatTableDataSource<any>;
  selectedPosition: string = 'opened'; // Default to 'opened' position

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  popup : boolean = false;
  s3: AWS.S3;
  // selectedFile: File | null = null;

  berryConfig;
  navCollapsed: boolean;
  navCollapsedMob = false;
  windowWidth: number;
  color = '#0056b3'
  videoForm: FormGroup;
  
  // Constructor  constructor(public dialog: MatDialog) {}

  constructor(
    private zone: NgZone,
    private location: Location,
    private locationStrategy: LocationStrategy,
    private dataservice : DataService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private toastr : ToastrService,

  ) {
    this.berryConfig = BerryConfig;
    // this.s3 = new AWS.S3();
    let current_url = this.location.path();
    const baseHref = this.locationStrategy.getBaseHref();
    if (baseHref) {
      current_url = baseHref + this.location.path();
    }

    if (current_url === baseHref + '/layout/theme-compact' || current_url === baseHref + '/layout/box') {
      this.berryConfig.isCollapse_menu = true;
    }

    this.windowWidth = window.innerWidth;
    this.navCollapsed = this.windowWidth >= 1025 ? BerryConfig.isCollapse_menu : false;
  }

  // public method
  navMobClick() {
    if (this.navCollapsedMob && !document.querySelector('app-navigation.coded-navbar')?.classList.contains('mob-open')) {
      this.navCollapsedMob = !this.navCollapsedMob;
      setTimeout(() => {
        this.navCollapsedMob = !this.navCollapsedMob;
      }, 100);
    } else {
      this.navCollapsedMob = !this.navCollapsedMob;
    }
  }
  date:any;
  ngOnInit(): void {
    const currentDate = new Date();
    this.date = this.datePipe.transform(currentDate, 'dd-MM-YYYY- HH:mm:ss', 'Asia/Dubai');
    console.log('Current Date and Time in AEDT (Abu Dhabi):', this.date);
    this.videoForm = this.fb.group({
      titleEng: ['', [Validators.required, Validators.maxLength(10)]],
      subTitleEng: ['', [Validators.required, Validators.maxLength(5)]],
      titleIta: ['', [Validators.required, Validators.maxLength(10)]],
      subTitleIta: ['', [Validators.required, Validators.maxLength(5)]],
     });
  }


  // uploadVideo() {
  //   const formData = new FormData();
  //   formData.append('video', this.selectedFile);
  //   formData.append('title', this.videoForm.get('title').value);
  //   formData.append('subtitle', this.videoForm.get('subTitle').value);
  //   //   let payload = {
  //   //     "title" : ,
  //   //     "subtitle" : this.videoForm.get('subTitle').value,
  //   //     "video" : this.selectedFile
  //   // }
  //   console.log("payload",formData);
  //   this.dataservice.uploadvideo(formData).subscribe((result) => {
  //     // this.data = result;
  //    console.log("result", result);
  //    this.showSuccess(`${this.selectedPosition} Position is added successfully`)
  //   });
  // }
  data : any;
  editpopup : boolean = false;

  
  selectedUser : any;

  showError(msg:any) {
    this.toastr.error(msg);
  }

  showSuccess(msg:any) {
    this.toastr.success(msg);
  }

  // onFileSelected(event: any) {
  //   this.selectedFile = event.target.files[0];
  //   this.uploadVideoAWS();
  // }
 
  // uploadVideoAWS() {
  //   if (this.selectedFile) {
  //     const bucketName = 'learnmainfeeds'; // Replace with your S3 bucket name
  //     const videoKey = `videos/${this.selectedFile.name}`; // Adjust the key as needed

  //     const params = {
  //       Bucket: bucketName,
  //       Key: videoKey,
  //       Body: this.selectedFile
  //     };

  //     this.s3.upload(params, (err, data) => {
  //       if (err) {
  //         console.error('Error uploading video:', err);
  //       } else {
  //         console.log('Video uploaded successfully:', data);
  //         // Call your Lambda function here and pass the necessary data (e.g., video URL)
  //       }
  //     });
  //   }
  // }


  // onFileSelected(event: any) {
  //   const fileInput = event.target as HTMLInputElement;
  //   if (fileInput.files && fileInput.files[0]) {
  //     // Get the selected video file object
  //     const selectedFile = fileInput.files[0];
  //     this.selectedVideoPath = selectedFile.name;
  //     this.selectedFile = selectedFile;
  //     console.log("selectedFile",selectedFile);
  //     console.log("selectedVideoPath",this.selectedVideoPath);
  //   } else {
  //     this.selectedVideoPath = undefined;
  //   }
  // }

  // Validate the selected file as a video
  selectedFiles : any;
  videoUrlEng: any;
  videoUrlIta: any;


  // async someFunction() {
  //   await this.waitForFunctionToComplete();
  //   // Code here will run after waitForFunctionToComplete completes.
  // }

   async uploadDatatoDB (){

    // if (this.fileToUpload) {
    //   const bucketName = 'YOUR_BUCKET_NAME';
    //   const key = 'video/' + this.fileToUpload.name;

    //   const upload = this.dataservice.uploadVideo(this.fileToUpload, bucketName, key);

    //   // Track upload progress
    //   upload.on('httpUploadProgress', (progressEvent) => {
    //     this.progress = (progressEvent.loaded / progressEvent.total) * 100;
    //   });
    // }
    // let titleEng = this.videoForm.get('title').value;
    // let subTitleEng = this.videoForm.get('subTitle').value;
    let payload = {
      "titleEng" : this.videoForm.get('titleEng').value,
      "subtitleEng": this.videoForm.get('subTitleEng').value,
      "videourlEng" : this.videoUrlEng,
      "titleIta" : this.videoForm.get('titleIta').value,
      "subtitleIta": this.videoForm.get('subTitleIta').value,
      "videourlIta" : this.videoUrlIta,

    }
    //  this.dataservice.uploadvideo(payload);
    //   console.log("upload Data", uploadData);
    this.dataservice.uploadvideo(payload).subscribe((result) => {
      // this.data = result;
     console.log("result", result);
     this.showSuccess(`Video Data Stored in Database`)
    });

  }

  handleFileInputEnglish(event:any) {
    let file:FileList = event.target.file;
    console.log("file",event.target.files[0]);
    this.fileToUploadEng = event.target.files[0];
  }
  
  handleFileInputItalian(event:any) {
    let file:FileList = event.target.file;
    console.log("file",event.target.files[0]);
    this.fileToUploadIta = event.target.files[0];
  }
  uploadInProgress: boolean = false;

  // uploadFile() {
  //   if (this.fileToUpload) {
  //     const bucketName = 'learnmainfeeds';
  //     const key = 'uploads/' + this.fileToUpload.name;

  //     this.uploadInProgress = true;

  //     this.dataservice.uploadFile(bucketName, key, this.fileToUpload)
  //       .then((data) => {
  //         console.log('File uploaded successfully:', data.Location);
  //         this.uploadInProgress = false;
  //       })
  //       .catch((error) => {
  //         console.error('File upload error:', error);
  //         this.uploadInProgress = false;
  //       });
  //   }
  // }

  async uploadBothVideos(){
    // this.uploadVideoEng();
    // this.uploadVideoItalian()
    try {
      const result1 = await this.uploadVideoEng();
      const result2 = await this.uploadVideoItalian();
      
      // Both function1 and function2 have completed at this point
      // You can now call function3 or perform any other desired action.
      
      const result3 = await this.uploadDatatoDB();
      console.log("All three functions have completed successfully.");
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  
  async uploadVideoEng() {
    if (this.fileToUploadEng) {
      const bucketName = 'learnmainfeeds';
      const key = 'video/' + this.fileToUploadEng.name;

      const uploadInfo = await this.dataservice.startVideoUpload(
        this.fileToUploadEng,
        bucketName,
        key
      );

      const uploadId = uploadInfo.UploadId;
      const fileSize = this.fileToUploadEng.size;
      const chunkSize = 5 * 1024 * 1024; // 5 MB chunks (adjust as needed)
      const numParts = Math.ceil(fileSize / chunkSize);
      const parts: AWS.S3.CompletedPart[] = [];

      for (let partNumber = 1; partNumber <= numParts; partNumber++) {
        const start = (partNumber - 1) * chunkSize;
        const end = Math.min(start + chunkSize, fileSize);
        const partBody = this.fileToUploadEng.slice(start, end);

        const partInfo = await this.dataservice.uploadVideoPart(
          uploadId,
          this.fileToUploadEng,
          bucketName,
          key,
          partNumber,
          partBody
        );

        parts.push({
          ETag: partInfo.ETag,
          PartNumber: partNumber,
        });

        this.progressEng = (partNumber / numParts) * 100;
      }

     let UploadData = await this.dataservice.completeVideoUpload(uploadId, bucketName, key, parts);
      console.log('Video upload complete',UploadData);
      this.videoUrlEng = UploadData.Location;
    }
  }

  async uploadVideoItalian() {
    if (this.fileToUploadIta) {
      const bucketName = 'learnmainfeeds';
      const key = 'video/' + this.fileToUploadIta.name;

      const uploadInfo = await this.dataservice.startVideoUpload(
        this.fileToUploadIta,
        bucketName,
        key
      );

      const uploadId = uploadInfo.UploadId;
      const fileSize = this.fileToUploadIta.size;
      const chunkSize = 5 * 1024 * 1024; // 5 MB chunks (adjust as needed)
      const numParts = Math.ceil(fileSize / chunkSize);
      const parts: AWS.S3.CompletedPart[] = [];

      for (let partNumber = 1; partNumber <= numParts; partNumber++) {
        const start = (partNumber - 1) * chunkSize;
        const end = Math.min(start + chunkSize, fileSize);
        const partBody = this.fileToUploadIta.slice(start, end);

        const partInfo = await this.dataservice.uploadVideoPart(
          uploadId,
          this.fileToUploadIta,
          bucketName,
          key,
          partNumber,
          partBody
        );

        parts.push({
          ETag: partInfo.ETag,
          PartNumber: partNumber,
        });

        this.progressIta = (partNumber / numParts) * 100;
      }

     let UploadData = await this.dataservice.completeVideoUpload(uploadId, bucketName, key, parts);
      console.log('Video upload complete',UploadData);
      this.videoUrlIta = UploadData.Location;
    }
  }

  loader : Boolean = false;



  //  async upload() {
    

  // }

  // async uploadFunctions() {
  //   let data =  await this.upload();
  //   console.log(data);
  //   this.uploadDatatoDB();
  // }


//  upload()  {


//     const file = this.selectedFiles;
//     console.log(file);
  
    
//     const contentType = file.type;
//     const bucket = new S3(
//           {
//               accessKeyId: 'AKIAQOTD3BNS2H4RCJK7',
//               secretAccessKey: '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',
//               region: 'us-east-1'
//           }
//       );
//       const params = {
//           Bucket: 'learnmainfeeds',
//           Key: `videos/${file.name}.mp4`,
//           Body: file,
//           ACL: 'public-read',
//           ContentType: contentType
//       };
//       bucket.upload(params, async function (err, data) {
//           if (err) {
//               console.log('There was an error uploading your file: ', err);
//               return false;
//           }
//           console.log('Successfully uploaded file.', data);
//           this.videoUrl = data;
//           return true;
//       });
     
//     }

fileToUploadEng: File | null = null;
fileToUploadIta: File | null = null;

progressEng: number = 0;
progressIta: number = 0;



    

    selectFile(event) {
    this.loader = true;
    this.selectedFiles = event.target.files[0];
    if(this.selectedFiles){
      const file = this.selectedFiles;
      console.log(file);
      const contentType = file.type;
      const bucket = new S3(
            {
                accessKeyId: 'AKIAQOTD3BNS2H4RCJK7',
                secretAccessKey: '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',
                region: 'us-east-1'
            }
        );
        const params = {
            Bucket: 'learnmainfeeds',
            Key: `videos/${file.name}.mp4`,
            Body: file,
            ACL: 'public-read',
            ContentType: contentType
        };
          bucket.upload(params,  function (err: any, data: { Location: any; }) {
            if (err) {
                console.log('There was an error uploading your file: ', err);
                return false;
            }
          if(data){
            this.videoUrl =  data.Location;
            localStorage.setItem('videoUrl',data.Location)
            console.log("loader", this.loader);
alert(`${file.name} Video Upload Successfully`)        
    return this.videoUrl;

          }

        });
        if(this.videoUrlEng != ""){
          this.loader = false;
        }
    }
    }

  
}
