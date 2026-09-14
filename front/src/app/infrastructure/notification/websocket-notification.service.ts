import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { NotificationState } from '../../application/notification/state/notification-state.service';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class WebSocketNotificationService {

  private client: Client | null = null;

  async connect(): Promise<void> {

    // Don't execute WebSocket/SockJS during Angular SSR
    if (typeof window === 'undefined') {
      return;
    }

    if (this.client?.active) {
      return;
    }

    // Load SockJS only in the browser
    const { default: SockJS } = await import('sockjs-client');

    this.client = new Client({
      webSocketFactory: () =>
        new SockJS(
          `${environment.apiUrl}/ws`,
          undefined,
          { withCredentials: true } as any
        ),

      onConnect: () => {
        console.log('STOMP CONNECTED');

        this.client!.subscribe(
          '/user/queue/notifications',
          (message) => {
            const dto = JSON.parse(message.body);

            console.log(
              "Hello, it's a message from backend:",
              dto
            );

            // const notification = toNotificationEntity(dto);
            // this.notificationState.addNotification(notification);
          }
        );
      },

      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      },

      onWebSocketError: (error) => {
        console.error('WebSocket error:', error);
      },
    });

    this.client.activate();
  }

  disconnect(): void {
    this.client?.deactivate();
    this.client = null;
  }
}