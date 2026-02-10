import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app'; 

@Component({
  selector: 'app-testcomponenet',
  templateUrl: './testcomponenet.component.html',
  styleUrls: ['./testcomponenet.component.css']
})
export class TestcomponenetComponent implements OnInit {

  constructor(private db: AngularFirestore,) { }

ngOnInit(): void {
    try{
      console.log("Saving to Firestore using native SDK...");
      const db = firebase.firestore();
       this.db.collection('user_details').doc('subnote').set({
                  userid: 'santunu Sen',
                  password: 'ABCDEFGH',
                  role: 'employee',
                  status: 'active'
      }).then(()=>{
        console.log("Success: user_details saved");
      }).catch((e)=>{
        console.log("Error "+e);
      })
      
      }catch(e){
        console.error("this is "+e);
      }
}
}




                // let resdata={
                //   userid: 'Joy Sen',
                //   password: '12345',
                //   role: 'employee',
                //   status: 'active'
                // }
                // const db=firebase.firestore();
                // this.db.collection('/user_details').add(resdata);
                // console.log(resdata)
