import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChatComponent } from './chat.component';
import { SocketService } from '../services/socket.service';
import { of } from 'rxjs';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let socketService: jasmine.SpyObj<SocketService>;

  beforeEach(async () => {
    const socketServiceSpy = jasmine.createSpyObj('SocketService', ['initSocket', 'onMessage', 'onLatestMessages', 'joinChannel', 'leaveChannel', 'send', 'sendImage']);
    socketServiceSpy.onMessage.and.returnValue(of('Test Message'));
    socketServiceSpy.onLatestMessages.and.returnValue(of([{ content: 'Test Image', sender: 'Test User' }]));

    await TestBed.configureTestingModule({
      declarations: [ ChatComponent ],
      imports: [ HttpClientTestingModule ],
      providers: [
        { provide: SocketService, useValue: socketServiceSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    socketService = TestBed.inject(SocketService) as jasmine.SpyObj<SocketService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should join a channel and leave previous channel', () => {
    // Arrange
    component.messagecontent = 'Test Message';
    sessionStorage.setItem('username', 'Test User');
    sessionStorage.setItem('selectedChannel', 'Default Channel');

    // Act
    component.joinChannel('Test Channel');

    // Assert
    expect(socketService.joinChannel).toHaveBeenCalledWith(JSON.stringify({
      content: 'Test Message',
      sender: 'Test User',
      channel: 'Default Channel'
    }));
    expect(socketService.leaveChannel).toHaveBeenCalledWith(JSON.stringify({
      content: 'Test Message',
      sender: 'Test User',
      channel: 'Default Channel'
    }));
  });

  it('should leave a channel', () => {
    // Arrange
    component.messagecontent = 'Test Message';
    sessionStorage.setItem('username', 'Test User');
    sessionStorage.setItem('selectedChannel', 'Default Channel');

    // Act
    component.leaveChannel('Test Channel');

    // Assert
    expect(socketService.leaveChannel).toHaveBeenCalledWith(JSON.stringify({
      content: 'Test Message',
      sender: 'Test User',
      channel: 'Default Channel'
    }));
    expect(component.textMessages.length).toBe(0);
    expect(component.imageMessages.length).toBe(0);
    expect(component.channelSelected).toBeFalse();
  });

  it('should initialize socket connection', () => {
    // Assert
    expect(socketService.initSocket).toHaveBeenCalled();
  });

  it('should handle onMessage', () => {
    // Assert
    expect(component.textMessages.length).toBe(1);
    expect(component.textMessages[0].content).toBe('Test Message');
  });

  it('should handle onLatestMessages for image message', () => {
    // Assert
    expect(component.imageMessages.length).toBe(1);
    expect(component.imageMessages[0].content).toBe('Test Image');
    expect(component.imageMessages[0].sender).toBe('Test User');
  });

  it('should handle onLatestMessages for text message', () => {
    // Arrange
    const latestMessages = [{ content: 'Test Text Message', sender: 'Test User' }];

    // Act

    // Assert
    expect(component.textMessages.length).toBe(1);
    expect(component.textMessages[0].content).toBe('Test Text Message');
    expect(component.textMessages[0].sender).toBe('Test User');
  });

  it('should handle onFileSelected', () => {
    // Arrange
    const event = new Event('change');
    const base64String = 'data:image/png;base64,TestBase64String';
    const file = new File([atob(base64String.split(',')[1])], 'TestImage.png', { type: 'image/png' });
    

    // Act
    component.onFileSelected(event);

    // Assert
    expect(socketService.sendImage).toHaveBeenCalledWith(JSON.stringify({
      content: base64String,
      sender: 'Test User',
      channel: 'Default Channel'
    }));
  });

  // Add more tests for other functions as needed
});
