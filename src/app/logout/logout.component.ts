import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(
    private cService:CookieService,
    private router:Router
  ) { }

  ngOnInit(): void {
    if(this.cService.get('username')){
      this.cService.deleteAll();
    }
  }

}
