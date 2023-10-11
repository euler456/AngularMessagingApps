import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router'; 

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [HttpClientTestingModule, RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle login', () => {
    const mockUser = { email: 'test@example.com', pwd: 'password' };
    const mockResponse = {
      valid: true,
      user: {
        userid: 1,
        username: 'Test User',
        roles: 'user',
        email: 'test@example.com',
        filename: 'profile.jpg'
      }
    };

    spyOn(router, 'navigateByUrl');

    component.userpwd = mockUser;
    component.loginfunc();

    const req = httpTestingController.expectOne('http://localhost:3000/login');

    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(sessionStorage.getItem('userid')).toBe('1');
    expect(sessionStorage.getItem('username')).toBe('Test User');
    expect(sessionStorage.getItem('roles')).toBe('user');
    expect(sessionStorage.getItem('emails')).toBe('test@example.com');
    expect(sessionStorage.getItem('filename')).toBe('profile.jpg');
    expect(router.navigateByUrl).toHaveBeenCalledWith('dashboard');
  });

  it('should handle invalid login', () => {
    const mockUser = { email: 'invalid@example.com', pwd: 'invalidpassword' };
    const mockResponse = { valid: false };

    spyOn(console, 'log');

    component.userpwd = mockUser;
    component.loginfunc();

    const req = httpTestingController.expectOne('http://localhost:3000/login');

    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(sessionStorage.getItem('userid')).toBeNull();
    expect(console.log).toHaveBeenCalledWith(mockResponse);
  });
});
