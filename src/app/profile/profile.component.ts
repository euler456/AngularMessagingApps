import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

const BACKEND_URL = 'http://localhost:3000';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userProfile: any = {};
  selectedFile: File | null = null;

  constructor(private router: Router, private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.userProfile.username = sessionStorage.getItem('username');
    this.userProfile.email = sessionStorage.getItem('emails');
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files) {
      this.selectedFile = inputElement.files[0];
    }
  }

  updateProfile() {
    const userId = sessionStorage.getItem('userid');
    const requestPayload = {
      action: 'editUser',
      userId: userId,
      username: this.userProfile.username,
      email: this.userProfile.email,
      filename: this.selectedFile ? this.selectedFile.name : null // Assuming selectedFile is defined
    };
  
    this.httpClient.post(BACKEND_URL + '/loginafter', requestPayload, httpOptions)
      .subscribe((data: any) => {
        if (data.valid == true) {
          sessionStorage.setItem('username', data.user.username);
          sessionStorage.setItem('emails', data.user.email);
          sessionStorage.setItem('filename', data.user.filename);

          alert('Profile updated successfully!');
          this.uploadProfileImage();
        } else {
          console.log(data);
        }
      });
  }
  
  uploadProfileImage() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('profileImage', this.selectedFile, this.selectedFile.name);

      this.httpClient.post(BACKEND_URL + '/uploadProfileImage', formData)
        .subscribe((data: any) => {
          if (data.success) {
            console.log('Profile image uploaded successfully!');
          } else {
            console.error('Error uploading profile image:', data.error);
          }
        });
    }
  }
}
