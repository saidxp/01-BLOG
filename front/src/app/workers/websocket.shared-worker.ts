import { Client } from '@stomp/stompjs';

import { environment } from '../../environments/environment.development';

interface SharedWorkerContext {
    onconnect: (event: MessageEvent) => void;
}

const ports: MessagePort[] = [];

const workerContext = self as unknown as SharedWorkerContext;

let client: Client | null = null;
let connecting = false;

async function connectWebSocket(): Promise<void> {

    if (client?.active || connecting) {
        return;
    }

    connecting = true;

    try {

        // Loading .... {<!!>}
        const { default: SockJS } =
            await import('sockjs-client/dist/sockjs');

        client = new Client({

            webSocketFactory: () =>
                new SockJS(
                    `${environment.apiUrl}/ws`,
                    undefined,
                    { withCredentials: true } as any
                ),

            onConnect: () => {

                console.log('[SharedWorker] ===== CONNECTED =====');

                const destination = '/user/queue/notifications';

                console.log(
                    '[SharedWorker] Subscribing to:',
                    destination
                );

                const subscription = client!.subscribe(
                    destination,
                    (message) => {

                        console.log(
                            '[SharedWorker] ===== MESSAGE RECEIVED ====='
                        );

                        console.log(
                            '[SharedWorker] Message body:',
                            message.body
                        );

                        for (const port of ports) {

                            port.postMessage({
                                type: 'NOTIFICATION',
                                data: message.body,
                            });

                        }
                    }
                );

                console.log(
                    '[SharedWorker] ===== SUBSCRIPTION CREATED ====='
                );

                console.log(
                    '[SharedWorker] Subscription id:',
                    subscription.id
                );
            },

            onStompError: (frame) => {
                console.error(
                    '[SharedWorker] STOMP error:',
                    frame
                );
            },

            onWebSocketError: (error) => {
                console.error(
                    '[SharedWorker] WebSocket error:',
                    error
                );
            },
        });

        client.activate();

    } catch (error) {

        console.error(
            '[SharedWorker] Failed to start WebSocket:',
            error
        );

    } finally {

        connecting = false;

    }
}


workerContext.onconnect = (event: MessageEvent) => {

    const port = event.ports[0];

    ports.push(port);

    port.start();

    console.log(
        '[SharedWorker] Port connected'
    );

    port.onmessage = (event) => {

        // <<==>> \\ {<!-!>} <!> 
        if (event.data?.type === 'DISCONNECT') {
            console.log('[SharedWorker] Disconnect requested');

            

            for (const connectedPort of ports) {
                connectedPort.postMessage({
                    type: 'REFRESH',
                });
            }

             if (client) {
                client.deactivate();
                client = null;
            } 
            // {<->} \\ {}
        }
    };

    connectWebSocket();

};