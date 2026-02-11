import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-registration-details',
  templateUrl: './registration-details.component.html',
  styleUrls: ['./registration-details.component.css']
})
export class RegistrationDetailsComponent implements OnInit {
  empId: string = this.cService.get("username"); // ব্যবহারকারীর ইউনিক আইডি
  registrationdetailsForm: FormGroup;
  constructor(
    private fb:FormBuilder,
    private spinner:NgxSpinnerService,
    private db:AngularFirestore,
    private cService:CookieService,
    private router:Router
  ) {
      this.registrationdetailsForm = this.fb.group({
      designation: ['', Validators.required],
      department: ['', Validators.required],
      projectName: ['', Validators.required],
      employmentType: ['', Validators.required],
      employmentStatus: ['', Validators.required],
      dateOfJoining: ['', Validators.required],
      contractStartDate: ['', Validators.required],
      contractEndDate: [''], // এটি অপশনাল হতে পারে
      supervisorName: ['', Validators.required],
      dutyStation: ['', Validators.required]
    });
   }

  ngOnInit(): void {
   if(!this.cService.get("username") || this.cService.get("status")!='active'){
      alert("Admin Blocked Your Account")
      this.router.navigateByUrl('logout');
    }else{
      this.getUserData();
    }
    
  }
  getUserData() {
      this.spinner.show();
      this.db.collection('registration_details').doc(this.empId).valueChanges()
        .subscribe((data: any) => {
          if (data) {
            const formattedData = { ...data };

            // তারিখ রূপান্তরের জন্য একটি সেফ ফাংশন
            const convertDate = (d: any) => {
              if (!d) return null;
              if (d.seconds) return new Date(d.seconds * 1000); // ফায়ারবেস টাইমস্ট্যাম্প হলে
              return new Date(d); // স্ট্রিং বা অন্য ফরম্যাট হলে
            };

        formattedData.dateOfJoining = convertDate(data.dateOfJoining);
        formattedData.contractStartDate = convertDate(data.contractStartDate);
        formattedData.contractEndDate = convertDate(data.contractEndDate);
            // যদি ডাটা থাকে, তবে ফর্মে অটোমেটিক বসিয়ে দিবে
            this.registrationdetailsForm.patchValue(formattedData);
          }
          this.spinner.hide();
        }, error => {
          this.spinner.hide();
          console.error("ডাটা রিড করতে সমস্যা হয়েছে:", error);
        });
    }

submitData() {
    if (this.registrationdetailsForm.valid) {
      this.spinner.show();
      // ডাটা সেভ বা আপডেট করা
      this.db.collection('registration_details').doc(this.empId).set(this.registrationdetailsForm.value, { merge: true })
        .then(() => {
          this.spinner.hide();
          alert("Data successfully Saved");
        })
        .catch(err => {
          this.spinner.hide();
          alert("Problem during save the data");
        });
    }
  }
}
