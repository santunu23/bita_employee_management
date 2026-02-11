import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from '../data.service';
import { MatTableDataSource } from '@angular/material/table';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workexperience',
  templateUrl: './workexperience.component.html',
  styleUrls: ['./workexperience.component.css']
})
export class WorkexperienceComponent implements OnInit {
  experienceForm: FormGroup;
  workExperienceList: any[] = [];
  displayedColumns: string[] = ['company', 'position', 'duration', 'actions'];
  dataSource = new MatTableDataSource<any>();
  empId: string = this.cService.get("username");
  constructor(
     private fb: FormBuilder,
     private spinner: NgxSpinnerService,
     private service:DataService,
     private db:AngularFirestore,
     private cService:CookieService,
     private router:Router) {
  this.experienceForm = this.fb.group({
    // এটি একটি ডাইনামিক অ্যারে
    workExperience: this.fb.array([]) 
  });

  // শুরুতে অন্তত একটি এক্সপেরিয়েন্স বক্স দেখানোর জন্য কল করুন
  this.addExperience();
}
ngOnInit(): void {
  if(!this.empId){
    this.router.navigateByUrl('logout');
  }else if(!this.cService.get("username") || this.cService.get("status")!='active'){
    alert("Admin Blocked Your Account")
    this.router.navigateByUrl('logout');
  }else{
     this.getExperienceData();
  }
}

get experiences() : FormArray {
  return this.experienceForm.get("workExperience") as FormArray;
}

dateRangeValidator(group: FormGroup): {[key: string]: any} | null {
  const start = group.get('startDate')?.value;
  const end = group.get('endDate')?.value;

  // যদি এন্ড ডেট স্টার্ট ডেটের আগে হয়, তবে এরর রিটার্ন করবে
  if (start && end && new Date(start) > new Date(end)) {
    return { 'dateInvalid': true };
  }
  return null;
}
// নতুন কাজের অভিজ্ঞতা যোগ করার ফাংশন
addExperience() {
  const exp = this.fb.group({
    companyName: ['', Validators.required],
    designation: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: [''], // বর্তমান কাজ হলে এটি খালি থাকতে পারে
    isCurrent: [false], // বর্তমানে কাজ করছেন কি না
    jobResponsibility: ['', Validators.required]
  },{ validators: this.dateRangeValidator });
  this.experiences.push(exp);
}

// নির্দিষ্ট ইনডেক্স থেকে এক্সপেরিয়েন্স মুছে ফেলা
removeExperience(i: number) {
  this.experiences.removeAt(i);
}
saveAllData(){
    if(this.experienceForm.valid){
      this.spinner.show();
      const mannualEmpId= this.empId;
      const experienceArray= this.experienceForm.value.workExperience;
      this.service.saveEmployeeExperience(mannualEmpId,experienceArray)
      .then(()=>{
        this.spinner.hide();
        alert("Records saved in Database successfully")
        this.experienceForm.reset();
        (this.experienceForm.get('workExperience') as FormArray).clear();
            this.addExperience();
      })
    }
  const allData = this.experienceForm.value.workExperience;
console.log(allData);
}

getExperienceData() {
    this.db.collection('EmployeeExperiences').doc(this.empId).valueChanges()
    .subscribe((data: any) => {
      // console.log(data);
    if (data && data.experiencedata) {
    this.workExperienceList = data.experiencedata;
    }else {
    this.workExperienceList = [];
    }
    });
}

// datatable function
editExperience(i){

}
removeExperiencedata(index:number){
      if (confirm('Are you sure to delete the record?')) {
        this.workExperienceList.splice(index, 1);
        this.db.collection('EmployeeExperiences').doc(this.empId).update({
          experiencedata: this.workExperienceList
        }).then(() => {
          // টোস্টারের বদলে সাধারণ এলার্ট
          alert('Successfully Deleted'); 
        });
      }
}

}