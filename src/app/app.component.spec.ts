import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { Router } from '@angular/router';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should check if user is logged in', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('someUserRole'); // Mocking session storage
    const result = component.isLoggedIn();
    expect(result).toBeTruthy();
  });

  it('should get user role', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('someUserRole'); // Mocking session storage
    const result = component.getUserRole();
    expect(result).toBe('someUserRole');
  });

  it('should logout', () => {
    spyOn(sessionStorage, 'clear'); // Mock sessionStorage clear method
    spyOn(router, 'navigateByUrl'); // Mock router.navigateByUrl method
    component.logout();
    expect(sessionStorage.clear).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });
});
