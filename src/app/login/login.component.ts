import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  constructor(private router: Router) {}
    users = [{"email":"aaa@gmail.com","password":"123"},{"email":"bbb@gmail.com","password":"1234"},{"email":"ccc@gmail.com","password":"123"}]
    email = "";
    password = "";
    success = false;
    submitform(){
      
      for(let i=0;i<this.users.length;i++){
        if(this.email == this.users[i].email && this.password == this.users[i].password){
            this.success = true;
            this.router.navigate(['/account']); // Redirect to the account page
            break;
            }
        else{
            alert("Email or password incorrect")
            }
            break;
       }
      
    }
    
}
