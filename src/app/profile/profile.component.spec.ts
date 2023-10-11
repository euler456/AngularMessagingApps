import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ImguploadService } from '../imgupload.service';
import { of } from 'rxjs';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let imgUploadService: ImguploadService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [ImguploadService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    imgUploadService = TestBed.inject(ImguploadService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update profile', () => {
    const mockUser = { username: 'Test User', email: 'test@example.com' };
    const mockResponse = {
      valid: true,
      user: {
        username: 'Updated User',
        email: 'updated@example.com',
        filename: 'profile.jpg'
      }
    };

    spyOn(sessionStorage, 'getItem').and.returnValue('1');
    spyOn(httpClient, 'post').and.returnValue(of(mockResponse));
    spyOn(window, 'alert');

    component.userProfile = mockUser;
    component.updateProfile();

    expect(httpClient.post).toHaveBeenCalledWith(
      'http://localhost:3000/loginafter',
      {
        action: 'editUser',
        userId: '1',
        username: 'Test User',
        email: 'test@example.com',
      },
      jasmine.any(Object)
    );

    expect(sessionStorage.setItem).toHaveBeenCalledWith('username', 'Updated User');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('emails', 'updated@example.com');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('filename', 'profile.jpg');
    expect(window.alert).toHaveBeenCalledWith('Profile updated successfully!');
  });

  it('should handle failed profile update', () => {
    const mockUser = { username: 'Test User', email: 'test@example.com' };
    const mockResponse = { valid: false };

    spyOn(httpClient, 'post').and.returnValue(of(mockResponse));
    spyOn(console, 'log');

    component.userProfile = mockUser;
    component.updateProfile();

    expect(httpClient.post).toHaveBeenCalled();
    expect(sessionStorage.setItem).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(mockResponse);
  });

  it('should handle file selection', () => {
    const mockEvent = { target: { files: [{ name: 'profile.jpg' }] } };

    component.onFileSelected(mockEvent);

    expect(component.selectedFile).toEqual({ name: 'profile.jpg' });
  });

  it('should upload profile image', () => {
    const mockResponse = { data: { filename: 'profile.jpg' } };

    spyOn(sessionStorage, 'getItem').and.returnValue('1');
    spyOn(imgUploadService, 'imgupload').and.returnValue(of(mockResponse));

    component.selectedFile = { name: 'profile.jpg' };
    component.uploadProfileImage();

    expect(imgUploadService.imgupload).toHaveBeenCalledWith(jasmine.any(FormData));
    expect(sessionStorage.setItem).toHaveBeenCalledWith('filename', 'profile.jpg');
    expect(component.imagepath).toBe('profile.jpg');
  });

  it('should handle file upload failure', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('1');
    spyOn(imgUploadService, 'imgupload').and.returnValue(of(null));

    component.selectedFile = { name: 'profile.jpg' };
    component.uploadProfileImage();

    expect(imgUploadService.imgupload).toHaveBeenCalledWith(jasmine.any(FormData));
    expect(sessionStorage.setItem).not.toHaveBeenCalledWith('filename', 'profile.jpg');
    expect(component.imagepath).toBeNull();
  });
});
