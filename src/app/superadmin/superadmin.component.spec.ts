import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperadminComponent } from './superadmin.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('SuperadminComponent', () => {
  let component: SuperadminComponent;
  let fixture: ComponentFixture<SuperadminComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SuperadminComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperadminComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch users', () => {
    const mockUsers = [{ id: '1', username: 'user1', email: 'user1@example.com', roles: 'user' }];
    
    component.fetchUsers();

    const req = httpTestingController.expectOne('http://localhost:3000/superadmin');
    expect(req.request.method).toEqual('POST');

    req.flush({ users: mockUsers });

    expect(component.users).toEqual(mockUsers);
  });

  it('should change user role', () => {
    const mockUserId = '1';
    const mockNewRole = 'admin';

    component.changeUserRole(mockUserId, mockNewRole);

    const req = httpTestingController.expectOne('http://localhost:3000/superadmin');
    expect(req.request.method).toEqual('POST');

    req.flush({}); // Assuming backend responds with empty body on success

    // You can add expectations based on how your component handles the response
  });

  it('should create user', () => {
    const mockNewUser = {
      username: 'newUser',
      email: 'newUser@example.com',
      roles: 'user',
      password: 'password',
      valid: true
    };

    component.newUser = mockNewUser;
    component.createUser();

    const req = httpTestingController.expectOne('http://localhost:3000/superadmin');
    expect(req.request.method).toEqual('POST');

    req.flush({ success: true }); // Assuming backend responds with success

    // You can add expectations based on how your component handles the response
  });

  it('should delete user', () => {
    const mockUserId = '1';

    component.deleteUser(mockUserId);

    const req = httpTestingController.expectOne('http://localhost:3000/superadmin');
    expect(req.request.method).toEqual('POST');

    req.flush({}); // Assuming backend responds with empty body on success

    // You can add expectations based on how your component handles the response
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
