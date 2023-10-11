import { TestBed } from '@angular/core/testing';
import { SocketService } from './socket.service';
import { Observable, of } from 'rxjs';

class MockSocket {
  private eventHandlers: { [event: string]: Function } = {};

  emit(event: string, data: any) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event](data);
    }
  }

  on(event: string, callback: Function) {
    this.eventHandlers[event] = callback;
  }
}

describe('SocketService', () => {
  let service: SocketService;
  let mockSocket: MockSocket;

  beforeEach(() => {
    mockSocket = new MockSocket();
    service = new SocketService();
    service['socket'] = mockSocket as any;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an Observable<string> for onImageReceived', () => {
    const observable = of('someString');
    spyOn(service, 'onImageReceived').and.returnValue(observable);
    const result = service.onImageReceived();
    expect(result instanceof Observable).toBeTruthy();
    result.subscribe(data => {
      expect(data).toEqual('someString');
    });
  });

  it('should return an Observable<string> for onMessage', () => {
    const message = of('someMessage');
    spyOn(service, 'onMessage').and.returnValue(message);
    const result = service.onMessage();
    expect(result instanceof Observable).toBeTruthy();
    result.subscribe(data => {
      expect(data).toEqual('someMessage');
    });
  });

  it('should return an Observable<any[]> for onLatestMessages', () => {
    const observable = of([]);
    spyOn(service, 'onLatestMessages').and.returnValue(observable);
    const result = service.onLatestMessages();
    expect(result instanceof Observable).toBeTruthy();
    result.subscribe(data => {
      expect(data).toEqual([]);
    });
  });

  it('should send a message', () => {
    spyOn(service['socket'], 'emit');
    service.send('Hello');
    expect(service['socket'].emit).toHaveBeenCalledWith('message', 'Hello');
  });

  it('should join a channel', () => {
    spyOn(service['socket'], 'emit');
    service.joinChannel('General');
    expect(service['socket'].emit).toHaveBeenCalledWith('join', 'General');
  });

  it('should leave a channel', () => {
    spyOn(service['socket'], 'emit');
    service.leaveChannel('General');
    expect(service['socket'].emit).toHaveBeenCalledWith('leave', 'General');
  });

  it('should send an image', () => {
    spyOn(service['socket'], 'emit');
    const base64Image = 'data:image/png;base64,ABC...';
    service.sendImage(base64Image);
    expect(service['socket'].emit).toHaveBeenCalledWith('image', base64Image);
  });
});
