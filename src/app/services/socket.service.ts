import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io-client';
import io from 'socket.io-client'; // Import 'io' from 'socket.io-client'

const SERVER_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: Socket; // Use definite assignment assertion

  constructor() { }

  initSocket() {
    this.socket = io(SERVER_URL);
    return () => {
      this.socket.disconnect();
    };
  }

  send(message: string) {
    this.socket.emit('message', message);
  }
  joinChannel(message: string) {
    this.socket.emit('join', message);
  }
  leaveChannel(message: string) {
    this.socket.emit('leave', message);
  }

  sendImage(base64: string) {
    this.socket.emit('image', base64);
  }

  onImageReceived(): Observable<string> {
    return new Observable(observer => {
      this.socket.on('image', (data: string) => {
        observer.next(data);
      });
    });
  }
  
  onMessage(): Observable<string> {
    return new Observable(observer => {
      this.socket.on('message', (data: string) => {
        observer.next(data);
      });
    });
  }
  onLatestMessages(): Observable<any[]> {
    return new Observable(observer => {
      this.socket.on('latestMessages', (data: any[]) => {
        observer.next(data);
      });
    });
  }
  
}