import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router'; 

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let router: Router;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user groups', () => {
    const userId = '1';
    const mockGroups = [
      { group: 'Group 1', channels: [], users: [] },
      { group: 'Group 2', channels: [], users: [] },
    ];

    component.fetchUserGroups(userId);

    const req = httpTestingController.expectOne('http://localhost:3000/loginafter');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ action: 'fetchinfo', userId: userId });

    req.flush(mockGroups);

    expect(component.userGroups).toEqual(mockGroups);
  });

  it('should save selected group in session storage', () => {
    const groupId = 123;
    component.saveSelectedGroup(groupId);

    const selectedGroupId = sessionStorage.getItem('selectedGroupId');
    expect(selectedGroupId).toEqual(groupId.toString());
  });

  it('should redirect to login if user is not authenticated', () => {
    spyOn(router, 'navigateByUrl');
    spyOn(sessionStorage, 'getItem').and.returnValue(null);

    component.ngOnInit();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('should fetch user groups if user is authenticated', () => {
    spyOn(router, 'navigateByUrl');
    spyOn(sessionStorage, 'getItem').and.returnValue('1');
    const userId = '1';
    const mockGroups = [
      { group: 'Group 1', channels: [], users: [] },
      { group: 'Group 2', channels: [], users: [] },
    ];

    component.ngOnInit();

    const req = httpTestingController.expectOne('http://localhost:3000/loginafter');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ action: 'fetchinfo', userId: userId });

    req.flush(mockGroups);

    expect(component.userGroups).toEqual(mockGroups);
  });
});
