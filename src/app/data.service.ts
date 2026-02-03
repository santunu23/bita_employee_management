import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private db: AngularFirestore) { }
  submitNewMember(resData: any) {
    console.log(resData);
    return this.db.collection('/employee').add({
                        fullname:resData.fullname,
                        gtype:resData.gtype,
                        fname:resData.fname,
                        mname:resData.mname,
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
                        password:resData.password,
                        createAt:resData.createdAt

    });
  }
}
