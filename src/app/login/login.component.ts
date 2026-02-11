import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  loginpage:any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service:DataService,
    private storage:AngularFireStorage,
    private cService:CookieService
  ) { 
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }
  onLogin() {
      if (this.loginForm.valid) {
        const { username, password } = this.loginForm.value;
        //console.log('Login attempt:', username, password);

        this.service.login(username,password).subscribe((res:any)=>{
          if(res.length>0){
            const userData = res[0];
            this.cService.set('username',username);
            this.cService.set('Role','Employee');
            this.cService.set('propicURL',userData.img);
            this.cService.set('status',userData.status);
            this.router.navigateByUrl('welcome')
          }else{
            alert('Wrong username or password!!')
          }
        })
      }
    }

}
