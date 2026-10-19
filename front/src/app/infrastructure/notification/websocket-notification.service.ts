import { Injectable, inject } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { NotificationState } from '../../application/notification/state/notification-state.service';
import { environment } from '../../../environments/environment.development';
import { toNotificationEntity } from '../notification/mapper/notification.mapper';
import { Router } from '@angular/router';
import { inherits } from 'util';

@Injectable({ providedIn: 'root' })
export class WebSocketNotificationService {

  // private client: Client | null = null; // <<===>> \\   
  // last check ! soubaaiss 
  // The Notificaion State \\  {<!<->!>} \\ {<!!>} \\ 
  private notificationState = inject(NotificationState); // <<==>> \\ 
  private router = inject(Router);

  // async connect(): Promise<void> {

  //   if (typeof window === 'undefined') {
  //     console.log('SRR WebSocket skipped');
  //     return;
  //   }

  //   console.log(' WebSocket executing');
  //   if (this.client?.active) {
  //     return;
  //   }

  //   console.log("it's Excute In The Server Side Rendring That's The Big Problme  i can see it i can catch it to the end !!");
  //   // Load SockJS only in the browser
  //   const { default: SockJS } = await import('sockjs-client/dist/sockjs');

  //   this.client = new Client({
  //     webSocketFactory: () =>
  //       new SockJS(
  //         `${environment.apiUrl}/ws`,
  //         undefined,
  //         { withCredentials: true } as any
  //       ),

  //     onConnect: () => {
  //       console.log('===== CONNECTED =====');

  //       const destination = '/user/queue/notifications';

  //       console.log('Subscribing to:', destination); // <<==>> \\ (<!<->!>)
  //       const subscription = this.client!.subscribe(
  //         destination,
  //         (message) => {

  //           /// server backend it's send direcly to subscribe
  //           console.log('===== MESSAGE RECEIVED =====');
  //           console.log('Raw message:', message);
  //           console.log('Message body:', message.body);

  //           try {
  //             const dto = JSON.parse(message.body);

  //             console.log('Parsed notification:', dto);

  //             const notification = toNotificationEntity(dto);
  //             this.notificationState.addNotification(notification);

  //           } catch (error) {
  //             console.error('Failed to parse WebSocket message:', error);
  //           }
  //         }
  //       );

  //       console.log('===== SUBSCRIPTION CREATED =====');
  //       console.log('Subscription id:', subscription.id);
  //     },

  //     onStompError: (frame) => {
  //       console.error('STOMP error:', frame);
  //     },

  //     onWebSocketError: (error) => {
  //       console.error('WebSocket error:', error);
  //     },
  //   });

  //   this.client.activate();
  // }

  // disconnect(): void {
  //   this.client?.deactivate();
  //   this.client = null;

  private worker: SharedWorker | null = null;

  connect(): void {

    console.log('WebSocketNotificationService: connect() called');

    if (typeof window === 'undefined') {
      return;
    }

    this.worker = new SharedWorker(
      new URL('../../workers/websocket.shared-worker', import.meta.url),
      { type: 'module' }
    );

    this.worker.port.onmessage = (event) => {
      console.log('[Angular] Message from SharedWorker:', event.data.type);



      /// Her Is to refrech them :
      if (event.data?.type === 'REFRESH') {

      console.log("it's mode how are you doing <!!!!> <!!>")
        // logout all the client !!!
       //this.router.navigateByUrl('/#logout');
       // {<>}
      this.router.navigateByUrl('/');
      window.location.reload();
      return; 
      }

      if (event.data?.type !== 'NOTIFICATION') {
        return;
      }

      const dto = JSON.parse(event.data.data);

      console.log('[Angular] Notification DTO:', dto);
      const notification = toNotificationEntity(dto);
      this.notificationState.addNotification(notification); // {<!>} 

    };

    this.worker.port.start();
    console.log('[Angular] Connected to SharedWorker'); // {}
  }

  // Deconnect It From It <!> \\ {} \\ 
  disconnect(): void {
    if (!this.worker) {
      return;
    }

    this.worker.port.postMessage({
      type: 'DISCONNECT',
    });

  }

}