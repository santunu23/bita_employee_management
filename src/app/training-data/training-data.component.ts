import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from '../data.service';
import { MatTableDataSource } from '@angular/material/table';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-training-data',
  templateUrl: './training-data.component.html',
  styleUrls: ['./training-data.component.css']
})
export class TrainingDataComponent implements OnInit {
  trainingDataForm: FormGroup;
  trainingList: any[] = [];
  displayedColumns: string[] = ['title', 'organization', 'duration', 'action'];
  empId: string = this.cService.get("username");
  constructor(
     private fb: FormBuilder,
     private spinner: NgxSpinnerService,
     private service:DataService,
     private db: AngularFirestore,
     private cService:CookieService,
     private router:Router
  ) { 
     this.trainingDataForm = this.fb.group({
    // এটি একটি ডাইনামিক অ্যারে
    training: this.fb.array([]) 
  });

  // শুরুতে অন্তত একটি এক্সপেরিয়েন্স বক্স দেখানোর জন্য কল করুন
  this.addtrainingForm();
  }

  ngOnInit(): void {
    if(!this.empId){
      this.router.navigateByUrl("logout");
    }else if(!this.cService.get("username") || this.cService.get("status")!='active'){
      alert("Admin Blocked Your Account")
      this.router.navigateByUrl('logout');
    }else{
      this.getTrainingData(); 
    }
    
  }

  get training() : FormArray {
    return this.trainingDataForm.get("training") as FormArray;
  }

  addtrainingForm(){
          const exp = this.fb.group({
          trainingtitle: ['', Validators.required],
          organization: ['', Validators.required],
          trainingdate: ['', Validators.required],
          durration: ['', Validators.required]
      });
      this.training.push(exp);
    }

  removeExperience(i: number) {
    this.training.removeAt(i);
  }
    saveAllData(){
        if(this.trainingDataForm.valid){
          this.spinner.show();
          const mannualEmpId= this.empId;
          const trainingdataArray= this.trainingDataForm.value.training;
          this.service.saveTrainingData(mannualEmpId,trainingdataArray)
          .then(()=>{
            this.spinner.hide();
            alert("Data saved in Database successfully")
            this.trainingDataForm.reset();
            (this.trainingDataForm.get('training') as FormArray).clear();
            this.addtrainingForm();
          })
        }
      const allData = this.trainingDataForm.value.training;
        console.log(allData);
        }
    // ডাটাবেজ থেকে ডাটা রিড করা
    getTrainingData() {
      this.db.collection('trainingdatacollection').doc(this.empId).valueChanges()
        .subscribe((data: any) => {
          if (data && data.trainingdata) {
            this.trainingList = data.trainingdata;
          }else {
          this.trainingList = [];
        }
        });
    }
    deleteTraining(index: number) {
      if (confirm('Are you sure to delete the record?')) {
        this.trainingList.splice(index, 1);
        this.db.collection('trainingdatacollection').doc(this.empId).update({
          trainingdata: this.trainingList
        }).then(() => {
          // টোস্টারের বদলে সাধারণ এলার্ট
          alert('Successfully Deleted'); 
        });
      }
}
    }