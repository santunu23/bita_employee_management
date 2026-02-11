import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loginlandingpage',
  templateUrl: './loginlandingpage.component.html',
  styleUrls: ['./loginlandingpage.component.css']
})
export class LoginlandingpageComponent implements OnInit {
landingPageImage:any;
  constructor(
    private storage: AngularFireStorage,
    private cService:CookieService,
    private router:Router) { }

  ngOnInit(): void {
    if(!this.cService.get("username") || this.cService.get("status")!='active'){
      alert("Admin Blocked Your Account")
      this.router.navigateByUrl('logout');
    }
  }

}
