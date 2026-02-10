import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { lastValueFrom } from 'rxjs'; // এটি নিশ্চিত করুন
import { DataService } from '../data.service';
import imageCompression from 'browser-image-compression';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  
  img: any;
  selectedFile: any;
  registrationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private asstorage: AngularFireStorage,
    private fns: AngularFireFunctions,
    private db: AngularFirestore,
    private firebaseservice: DataService,
  ) { }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      fullname: [null, [Validators.required, Validators.minLength(3)]],
      gender: [null, [Validators.required]],
      fname: [null, [Validators.required]],
      mname: [null, [Validators.required]],
      maritialstatus: [null, [Validators.required]],
      nationality: [null, [Validators.required]],
      bgroup: [null, [Validators.required]],
      religion: [null, [Validators.required]],
      paddress: [null, [Validators.required, Validators.minLength(3)]],
      praddress: [null, [Validators.required, Validators.minLength(3)]],
      nino: [null, [Validators.required, Validators.minLength(3)]],
      mno: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(11)]],
      email: [null, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      emno: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(11)]],
    });
  }

  upload(event: Event) {
    this.selectedFile = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = () => {
      this.img = reader.result;
    };
  }

  async submitData() {
    if (this.registrationForm.valid && this.selectedFile) {
      this.spinner.show();
      console.log("Starting Submission...");
          const options = {
                maxSizeMB: 0.2,          // সর্বোচ্চ সাইজ হবে ২০০ কেবি
                maxWidthOrHeight: 1024,  // সর্বোচ্চ পিক্সেল ১০২৪
                useWebWorker: true
              };
      try {
        // ধাপ ১: সার্ভার থেকে আইডি ও পাসওয়ার্ড জেনারেট করা
        //const callable = this.fns.httpsCallable('generateCredentials');
        //const credentials: any = await lastValueFrom(callable({}));
        const response = await fetch('https://us-central1-bitaemployeedb23.cloudfunctions.net/generateCredentials');
        const credentials = await response.json();
        const empId = credentials.employeeId;
        const pass = credentials.tempPassword;
        console.log("ID Generated:", empId);
        console.log("ID Generated:", pass);
        const compressedFile = await imageCompression(this.selectedFile, options);

        // ধাপ ২: ছবি আপলোড (আইডি অনুযায়ী নামকরণ)
        const filePath = `employees/${empId}_photo.jpg`;
        const fileRef = this.asstorage.ref(filePath);
        const task = this.asstorage.upload(filePath, compressedFile);

        // ধাপ ৩: আপলোড শেষ হওয়া পর্যন্ত অপেক্ষা এবং লিঙ্ক নেওয়া
        const snapshot = await task.snapshotChanges().toPromise();
        console.log("Image Uploaded!");
        const downloadURL = await lastValueFrom(fileRef.getDownloadURL());
        console.log("Download URL:", downloadURL);
        // ধাপ ৪: user_details and employee_db তে সেভ
        console.log("Saving to Firestore...");        
             
        let userdetailsdata={
              userid: empId,
              password: pass,
              role: 'employee',
              status: 'active'
        }

        let addnewMember={
          fullname: this.registrationForm.value['fullname'],
          gtype: this.registrationForm.value['gender'],
          fname: this.registrationForm.value['fname'],
          mname: this.registrationForm.value['mname'],
          maritialstatus: this.registrationForm.value['maritialstatus'],
          bgroup: this.registrationForm.value['bgroup'],
          religion: this.registrationForm.value['religion'],
          paddress: this.registrationForm.value['paddress'],
          praddress: this.registrationForm.value['praddress'],
          nationality: this.registrationForm.value['nationality'],
          nino: this.registrationForm.value['nino'],
          mno: this.registrationForm.value['mno'],
          emno: this.registrationForm.value['emno'],
          email: this.registrationForm.value['email'],
          userid: empId,
          img: downloadURL,
          createdAt: new Date().toISOString()
        }
         await Promise.all([
                  await this.firebaseservice.submituserdetails(userdetailsdata),
                  await this.firebaseservice.submitNewMember(addnewMember)
        ])
      
        console.log("Firestore Data Saved Successfully!");
        this.spinner.hide();
        alert(`Success! Please save your User ID and Password!\n User ID: ${empId}\nPassword: ${pass}`);
        this.registrationForm.reset();
        this.img = null;
        // this.cService.set('username',empId);
        // this.cService.set('urole','employee');

      } catch (error) {
        this.spinner.hide();
        console.error("Full Error Details:", error);
        alert("সমস্যা হয়েছে: " + (error.message || "Unknown Error"));
      }
    } else {
      alert("অনুগ্রহ করে সব তথ্য দিন এবং একটি ছবি সিলেক্ট করুন।");
    }
  }
}