import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormArray } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-educatio-qualification',
  templateUrl: './educatio-qualification.component.html',
  styleUrls: ['./educatio-qualification.component.css']
})
export class EducatioQualificationComponent implements OnInit {
  educationForm: FormGroup;
  empId: string = this.cService.get("username");
  boards: string[] = [
    'Dhaka', 'Chittagong', 'Rajshahi', 'Cumilla', 
    'Jessore', 'Barishal', 'Sylhet', 'Dinajpur', 'Mymensingh'
  ];
  constructor( private fb: FormBuilder,
    private db:AngularFirestore,
    private cService:CookieService,
    private router:Router,
    private spinner:NgxSpinnerService
  ) {
    this.educationForm = this.fb.group({
      // SSC
      sscBoard: [''],
      sscSubject: [''],
      sscGrade: [null],
      // HSC
      hscBoard: [''],
      hscSubject: [''],
      hscGrade: [null],
      // Graduation
      gradInstitution: [''],
      gradSubject: [''],
      gradGrade: [null],
      // Post Grad
      postGradInstitution: [''],
      postGradSubject: [''],
      postGradGrade: [null]
    });
   }

  ngOnInit(): void {
    if(!this.cService.get("username") || this.cService.get("status")!='active'){
      alert("Admin Blocked Your Account")
      this.router.navigateByUrl('logout');
    }else{
      this.loadEducationData();
    }
  }
saveEducationData(){
  this.spinner.show();
  const educationDetails=this.educationForm.value;
  // console.log(educationDetails);
  this.db.collection('employee_education').doc(this.empId).set(educationDetails)
    .then(()=>{
      this.spinner.hide();
      alert("Congratulation! Education Data submitted successfully.")
    })
    .catch(error=>{
      this.spinner.hide();
      console.log("Problem during saving data ",error);
      alert("Sorry Data does not saved successfully.")
    })
}

loadEducationData() {
  // আপনার এমপ্লয়ি আইডি ব্যবহার করে ডাটাবেজ থেকে খোঁজা
  this.db.collection('employee_education').doc(this.empId).valueChanges()
    .subscribe((data: any) => {
      if (data) {
        // ফর্মে আগের ডাটাগুলো বসিয়ে দেওয়া (Patch Value)
        this.educationForm.patchValue(data);
        // console.log("আগের ডাটা লোড হয়েছে");
      }
    });
}
}
