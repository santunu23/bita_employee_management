import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { arrayUnion } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private db: AngularFirestore) { }
  async submituserdetails(data:any){
    //console.log("Come to the service.")
    return this.db.collection('/user_details').doc(data.userid).set({
            userid: data.userid,
            password:data.password,
            role: data.role,
            status: data.status,
            img:data.img
    })
  }
  submitNewMember(resData: any) {
    //console.log(resData);
    return this.db.collection('/employee_db').doc(resData.userid).set({
                        fullname:resData.fullname,
                        gtype:resData.gtype,
                        fname:resData.fname,
                        mname:resData.mname,
                        dob:resData.dob,
                        maritialstatus: resData.maritialstatus,
                        bgroup: resData.bgroup,
                        religion:resData.religion,
                        paddress:resData.paddress,
                        praddress:resData.praddress,
                        nationality:resData.nationality,
                        nino:resData.nino,
                        mno:resData.mno,
                        emno:resData.emno,
                        email:resData.email,
                        img:resData.img,
                        userid:resData.userid,
                        createAt:resData.createdAt

    });
  }
 async saveEmployeeExperience(empId: string, experienceData: any){
  const docRef= this.db.collection('EmployeeExperiences').doc(empId);
  const doc = await docRef.get().toPromise();
    if(doc.exists){
              return this.db.collection('EmployeeExperiences').doc(empId).set({
            employeeId: empId,
            experiencedata: arrayUnion(...experienceData),
            updatedAt: new Date()
          },{merge:true});
    }else{
            return docRef.set({
              employeeId: empId,
              experiencedata: experienceData,
              updatedAt: new Date()
           });
    }
  }

  async saveTrainingData(empId:string, trainingdata:any[]){
    const docRef = this.db.collection('trainingdatacollection').doc(empId);
    // ১. প্রথমে ডকুমেন্টটি রিড করে দেখা
   const doc = await docRef.get().toPromise();
   if (doc.exists) {
        return this.db.collection('trainingdatacollection').doc(empId).set({
        employeeId: empId,
        trainingdata: arrayUnion(...trainingdata),
        updatedAt: new Date()
      },{merge:true});
   }else{
        return docRef.set({
        employeeId: empId,
        trainingdata: trainingdata,
        updatedAt: new Date()
    });
   }

  }

  login(username:string,password:string){
    return this.db.collection('/user_details', ref=>
      ref.where('userid','==',username)
      .where('password','==',password)
    ).valueChanges(); 
  }
}
