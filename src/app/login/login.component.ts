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

export class LoginComponent implements OnInit{
  userpwd = {username:'abc@gmail.com',pwd:'123'};
  userobj = {userid:1 ,username: this.userpwd.username,userbirthdate: "1990-01-01",userage:100};
  constructor(private router: Router,private httpClient: HttpClient) {}
  ngOnInit(){}
  public loginfunc(){
    this.httpClient.post(BACKEND_URL + '/login',this.userpwd, httpOptions)
      .subscribe((data: any)=>{
        alert(JSON.stringify(this.userpwd));
        if(data.valid == true){
          sessionStorage.setItem('userid', this.userobj.userid.toString());
          sessionStorage.setItem('username', this.userobj.username);
          sessionStorage.setItem('userbirthdate', this.userobj.userbirthdate);
          sessionStorage.setItem('userage', this.userobj.userage.toString());
          this.httpClient.post<any>(BACKEND_URL + '/loginafter',this.userobj, httpOptions)
          .subscribe((m: any) =>{console.log(m[0]);});
          this.router.navigateByUrl('account');
        }else{
          console.log(data)
          alert('Sorry username or password is not valid');
        }
      });
    } 
      
}
