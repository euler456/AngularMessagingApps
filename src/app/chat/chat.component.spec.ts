import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ChatComponent } from './chat.component';
import { SocketService } from '../services/socket.service';
import { DomSanitizer } from '@angular/platform-browser';
import { of } from 'rxjs';

@Component({selector: 'app-dummy', template: ''})
class DummyComponent {}

describe('ChatComponent', () => {
  let fixture: ComponentFixture<ChatComponent>;
  let component: ChatComponent;
  let socketService: SocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatComponent, DummyComponent], // Added DummyComponent for routerLink
      imports: [HttpClientTestingModule],
      providers: [SocketService, DomSanitizer],
    });

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    socketService = TestBed.inject(SocketService);

    // Mock sessionStorage for testing
    spyOn(sessionStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'username') return 'TestUser';
      if (key === 'selectedChannel') return 'TestChannel';
      if (key === 'selectedGroupId') return 'TestGroupId';
      return null;
    });
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should join a channel', () => {
    spyOn(socketService, 'joinChannel').and.stub();
    component.messagecontent = 'Test Message';

    component.joinChannel('TestChannel');

    expect(socketService.joinChannel).toHaveBeenCalledWith(JSON.stringify({
      content: 'Test Message',
      sender: 'TestUser',
      channel: 'TestChannel'
    }));
  });

  it('should leave a channel', () => {
    spyOn(socketService, 'leaveChannel').and.stub();
    component.messagecontent = 'Test Message';

    component.leaveChannel('TestChannel');

    expect(socketService.leaveChannel).toHaveBeenCalledWith(JSON.stringify({
      content: 'Test Message',
      sender: 'TestUser',
      channel: 'TestChannel'
    }));
    expect(component.textMessages).toEqual([]);
    expect(component.imageMessages).toEqual([]);
    expect(component.channelSelected).toBe(false);
  });

  it('should extract base64 from JSON', fakeAsync(() => {
    const base64Data = '{"content":"data:image/png;base64,abc123","sender":"User"}';
    component.extractBase64(base64Data).then((base64) => {
      expect(base64).toEqual('abc123');
    });
    tick();
  }));

  it('should send an image to the server', () => {
    spyOn(socketService, 'sendImage').and.stub();
    const base64 = 'abc123';

    component.sendImageToServer(base64);

    expect(socketService.sendImage).toHaveBeenCalledWith(JSON.stringify({
      content: base64,
      sender: 'TestUser',
      channel: 'TestChannel'
    }));
  });

  it('should load channel content', () => {
    spyOn(socketService, 'onLatestMessages').and.returnValue(of([
      { content: 'data:image/png;base64,abc123', username: 'User' },
      { content: 'text message', username: 'User' }
    ]));

    component.loadChannelContent('TestChannel');

    expect(component.selectedChannelName).toEqual('TestChannel');
    expect(component.channelSelected).toBe(true);
    expect(component.textMessages.length).toBe(1);
  });

  it('should send a chat message', () => {
    spyOn(socketService, 'send').and.stub();
    component.messagecontent = 'Hello, world!';

    component.chat();

    expect(socketService.send).toHaveBeenCalledWith(JSON.stringify({
      content: 'Hello, world!',
      sender: 'TestUser',
      channel: 'TestChannel'
    }));
    expect(component.messagecontent).toBe('');
  });

  it('should fetch users and channels data', () => {
    spyOn(component.httpClient, 'post').and.returnValue(of({
      users: [{ name: 'User1' }],
      channels: [{ name: 'Channel1' }]
    }));

    component.fetchUsersAndChannelsData('TestGroupId');

    expect(component.usersList.length).toBe(1);
    expect(component.channelsList.length).toBe(1);
  });

  it('should handle file selected', fakeAsync(() => {
    const fileReaderSpy = jasmine.createSpyObj('FileReader', ['readAsDataURL', 'onload']);
    spyOn(window, 'FileReader').and.returnValue(fileReaderSpy);

    const inputElement: HTMLInputElement = fixture.debugElement.query(By.css('input[type="file"]')).nativeElement;
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    const event = new Event('change');
    Object.defineProperty(event, 'target', {
        writable: false,
        value: {
            files: [file],
        },
    });

    inputElement.dispatchEvent(event);
    tick();

    const messageData = {
        content: 'data:image/png;base64,xyz123',
        sender: 'TestUser',
        channel: 'TestChannel'
    };

    expect(fileReaderSpy.readAsDataURL).toHaveBeenCalledWith(file);
    fileReaderSpy.onload(new ProgressEvent('load', { target: { result: 'data:image/png;base64,xyz123' } } as any));
    expect(socketService.sendImage).toHaveBeenCalledWith(JSON.stringify(messageData));
}));

  it('should decode base64 image', () => {
    const base64String = 'xyz123';
    const content = `data:image/png;base64,${base64String}`;
    const message = { data: 'base64', content };
    
    const result = component.decodeBase64(message);

    expect(result).toBe(content);
  });

  it('should handle sending image to server with no base64 content', () => {
    spyOn(socketService, 'sendImage').and.stub();

    component.sendImageToServer('');

    expect(socketService.sendImage).toHaveBeenCalledWith(JSON.stringify({
      content: '',
      sender: 'TestUser',
      channel: 'TestChannel'
    }));
  });

  it('should handle chat message with no content', () => {
    spyOn(socketService, 'send').and.stub();
    component.messagecontent = '';

    component.chat();

    expect(socketService.send).not.toHaveBeenCalled();
  });

  it('should handle chat message with content', () => {
    spyOn(socketService, 'send').and.stub();
    component.messagecontent = 'Hello, world!';

    component.chat();

    expect(socketService.send).toHaveBeenCalledWith(JSON.stringify({
      content: 'Hello, world!',
      sender: 'TestUser',
      channel: 'TestChannel'
    }));
    expect(component.messagecontent).toBe('');
  });

  it('should handle fetching users and channels data with error', () => {
    spyOn(component.httpClient, 'post').and.returnValue({
      subscribe: (successCallback: any, errorCallback: any) => {
        errorCallback('Error fetching data');
      },
    } as any);

    spyOn(console, 'error');

    component.fetchUsersAndChannelsData('TestGroupId');

    expect(console.error).toHaveBeenCalledWith('Error fetching data:', 'Error fetching data');
  });
});
