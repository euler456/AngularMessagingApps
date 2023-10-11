import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
const httpOptions = {
  headers: new HttpHeaders({'Content-Type':'application/json'})
};
import { NgForm } from '@angular/forms';
// import { Userpwd } from '../userpwd';
// import { Userobj } from '../userobj';
import { Router } from '@angular/router';
// import {USERPWDS} from '../mock-users';
const BACKEND_URL = 'http://localhost:3000';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  userpwd = { email: 'abc@gmail.com', pwd: '123' };

  constructor(private router: Router, private httpClient: HttpClient) {}

  ngOnInit() {}

  public loginfunc() {
    this.httpClient.post(BACKEND_URL + '/login',this.userpwd, httpOptions)
      .subscribe((data: any) => {        
        if (data.valid == true) {
          alert("successful login");
          sessionStorage.setItem('userid', `${data.user.userid}`);
          sessionStorage.setItem('username', data.user.username);
          sessionStorage.setItem('roles', data.user.roles); // Adjust this based on your server response   
          sessionStorage.setItem('emails', data.user.email); // Adjust this based on your server response                     
          sessionStorage.setItem('filename', data.user.filename); // Adjust this based on your server response                     

          this.router.navigateByUrl('dashboard');
          console.log("Request  in login.ts");

        } else {
          alert("Username or Email incorrect");

          console.log(data);
        }
      });
  }
}