import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GroupAdminPanelComponent } from './group-admin-panel.component';

describe('GroupAdminPanelComponent', () => {
  let component: GroupAdminPanelComponent;
  let fixture: ComponentFixture<GroupAdminPanelComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [GroupAdminPanelComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupAdminPanelComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch groups and users on initialization', () => {
    component.ngOnInit();

    const request = httpMock.expectOne('http://localhost:3000/groupadmin');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ action: 'listGroups' });

    request.flush({ groups: [{ name: 'Group1' }], users: [] });

    expect(component.groups).toEqual([{ name: 'Group1' }]);
    expect(component.users).toEqual([]);
  });

  it('should create a group', () => {
    component.groupName = 'New Group';
    component.createGroup();

    const request = httpMock.expectOne('http://localhost:3000/groupadmin');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ action: 'createGroup', group: 'New Group' });

    request.flush({ success: true });

    // Assuming you have a refreshGroups() method, you can test it here.
  });

  it('should create a channel', () => {
    component.selectedGroupId = 1; // Assuming a selected group ID
    component.channelName = 'New Channel';
    component.createChannel();

    const request = httpMock.expectOne('http://localhost:3000/groupadmin');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      action: 'createChannel',
      groupId: 1,
      channelName: 'New Channel'
    });

    request.flush({ success: true });

    // Assuming you have a refreshGroups() method, you can test it here.
  });

  it('should add a user to a group', () => {
    component.selectedUserId = 1; // Assuming a selected user ID
    component.selectedGroupId = 1; // Assuming a selected group ID
    component.addUserToGroup(1, 1);

    const request = httpMock.expectOne('http://localhost:3000/groupadmin');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      action: 'joinGroup',
      userId: 1,
      groupId: 1
    });

    request.flush({ success: true });

    // Add expectations for handling success and failure scenarios.
  });

  it('should remove a user from a group', () => {
    component.selectedUserId = 1; // Assuming a selected user ID
    component.selectedGroupId = 1; // Assuming a selected group ID
    component.removeUserFromGroup(1, 1);

    const request = httpMock.expectOne('http://localhost:3000/groupadmin');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      action: 'leaveGroup',
      userId: 1,
      groupId: 1
    });

    request.flush({ success: true });

    // Add expectations for handling success and failure scenarios.
  });

  it('should remove a group', () => {
    component.removeGroup(1); // Assuming a group ID
    const request = httpMock.expectOne('http://localhost:3000/groupadmin');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      action: 'deleteGroup',
      groupId: 1
    });

    request.flush({ success: true });

    // Assuming you have a refreshGroups() method, you can test it here.
  });

  it('should remove a channel', () => {
    component.removeChannel(1, 'ChannelName'); // Assuming a group ID and channel name
    const request = httpMock.expectOne('http://localhost:3000/groupadmin');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      action: 'deleteChannel',
      groupId: 1,
      channelName: 'ChannelName'
    });

    request.flush({ success: true });

    // Assuming you have a refreshGroups() method, you can test it here.
  });

  it('should refresh groups', () => {
    component.refreshGroups();
    const request = httpMock.expectOne('http://localhost:3000/groupadmin');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ action: 'listGroups' });

    request.flush({ groups: [{ name: 'Group1' }] });

    expect(component.groups).toEqual([{ name: 'Group1' }]);
  });

});
