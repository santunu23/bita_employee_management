import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NgForm,FormBuilder,FormGroup, Validators,FormArray } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { DataService } from '../data.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  
  img:any;
  selectedFile: any;
  ref:any;
  task:any;
  randomId= Math.random().toString(36).substring(2);
  registrationForm:FormGroup;
  

  constructor(
    private fb:FormBuilder,
    private spinner:NgxSpinnerService,
    private asstorage:AngularFireStorage,
    private fns: AngularFireFunctions,
    private firebaseservice: DataService
  ) { }

  ngOnInit(): void {
     this.registrationForm=this.fb.group({
      fullname:[null,[Validators.required,Validators.minLength(3)]],
      gender:[null,[Validators.required]],
      fname:[null,[Validators.required]],
      mname:[null,[Validators.required]],
      maritialstatus:[null,[Validators.required]],
      nationality:[null,[Validators.required]],
      bgroup:[null,[Validators.required]],
      religion:[null,[Validators.required]],
      paddress:[null,[Validators.required,Validators.minLength(3)]],
      praddress:[null,[Validators.required,Validators.minLength(3)]],
      nino:[null,[Validators.required,Validators.minLength(3)]],
      mno:[null,[Validators.required,Validators.pattern,Validators.minLength(10),Validators.maxLength(11)]],
      email:[null,[Validators.required,Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      emno:[null,[Validators.required,Validators.pattern,Validators.minLength(10),Validators.maxLength(11)]],

   })
  }
  //   createProjectname():FormGroup{
  //   return this.fb.group({
  //     pname:[null,[Validators.required]],
  //     jdate:['',[Validators.required,Validators.pattern]],
  //     rdate:['',[Validators.required,Validators.pattern]]
  //   })
  // }
    upload(event:Event){
      this.selectedFile=(event.target as HTMLInputElement).files[0];
      let reader=new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload=()=>{
        this.img=reader.result
      };
  }
    submitData(){
      if(this.registrationForm.status=='VALID' && this.img){
          this.spinner.show();
          const base64Data = this.img.split(',')[1];
          const callable = this.fns.httpsCallable('uploadToDrive');
          console.log("Calling Firebase Function...");
            callable({ imageStream: base64Data }).subscribe({
                  next: (res) => {
                    console.log("Success:", res);
                    if (res.success) {
                      console.log("submitdata "+res);
                      // সার্ভার থেকে আসা ID এবং Password সহ ফাইনাল অবজেক্ট তৈরি
                      let employeeData = {
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
                        
                        
                        // সার্ভার থেকে প্রাপ্ত তথ্য
                        img: res.link,              // গুগল ড্রাইভ লিঙ্ক
                        userid: res.employeeId,     // ৮ ডিজিটের র‍্যান্ডম আইডি
                        password: res.tempPassword, // ৬ ডিজিটের র‍্যান্ডম পাসওয়ার্ড
                        createdAt: new Date().toISOString()
                      };

                      // Save in firestore database
                      this.firebaseservice.submitNewMember(employeeData).then((docRef) => {
                        console.log("SUCCESS: Data saved to Firestore!",docRef.id);
                         console.log("Get clicked from the firebase service "+' image '+employeeData.img+', userid'+employeeData.userid+', password'+employeeData.password+employeeData.createdAt);
                        this.spinner.hide();
                        alert(`সফলভাবে নিবন্ধিত হয়েছে!\nID: ${res.employeeId}\nPassword: ${res.tempPassword}`);
                        this.registrationForm.reset();
                        this.img = null;
                      }).catch(err => {
                        this.spinner.hide();
                        console.error("Database Error:", err);
                      });
                    }
                  },
                  error: (err) => {
                    this.spinner.hide();
                    console.error("Cloud Function Error:", err);
                    alert("সার্ভারে ইমেজ আপলোড করতে সমস্যা হয়েছে। আপনার কার্ড বা ব্লেজ প্ল্যান চেক করুন।");
                  }
    });
  } else {
    alert("অনুগ্রহ করে সব তথ্য দিন এবং একটি ছবি সিলেক্ট করুন।");
  }
              // this.ref = this.asstorage.ref(this.randomId);
              // this.task = this.ref.put(this.selectedFile).then((res:any)=>{
              //   if(res){
              //   const downloadURL=this.ref.getDownloadURL().subscribe((url:any)=>{
              //     URL=url;
              //     if(URL.length>0){
              //       let res={
              //         fullname :this.registrationForm.value['fullname'],
              //         gtype:this.registrationForm.value['gender'],
              //         fname:this.registrationForm.value['fname'],
              //         mname:this.registrationForm.value['mname'],
              //         maritialstatus:this.registrationForm.value['maritialstatus'],
              //         bgroup: this.registrationForm.value['bgroup'],
              //         religion:this.registrationForm.value['religion'],
              //         paddress:this.registrationForm.value['paddress'],
              //         praddress:this.registrationForm.value['praddress'],
              //         nationality: this.registrationForm.value['nationality'],
              //         nino: this.registrationForm.value['nino'],
              //         mno : this.registrationForm.value['mno'],
              //         emno:this.registrationForm.value['emno'],
              //         email:this.registrationForm.value['email'],
              //         img:URL,
              //         userid:this.randomId,
              //         projectinvolvement:this.registrationForm.value['tickets']
              //       }
              //       console.log(res);
              //       // this.firebaseservice.submitnewmember(res).then(e=>{
              //       //       if(e){
              //       //         this.spinner.hide();
              //       //         this.dialog.open(SuccessmessageComponent);
              //       //         // form.reset();
              //       //         this.img=""
              //       //       }else{
              //       //         this.spinner.hide();
              //       //       }
              //       //     });
              //       }
              //   })
              //   }
              //   }).catch((error:any)=>{
              //         console.log(error); 
              // })
        }
   }
  //   addData(){
  //   this.tickets.push(this.createProjectname());
  // }

  //   get tickets():FormArray{
  //   return <FormArray>this.registrationForm.get('tickets')
  // }
  //   deleteValue(i){
  //   this.tickets.removeAt(i);
  // }
