// Keep every browser tab connected to this single worker.
const ports = new Set();

onconnect = ({ ports: [port] }) => {
  ports.add(port);
  port.start();

  // A tab can send a mock notification with port.postMessage(notification).
  port.onmessage = ({ data: notification }) => {
    // Broadcast it to every connected tab, including the sender.
    for (const connectedPort of ports) {
      try {
        connectedPort.postMessage(notification);
      } catch {
        // A failed post usually means that tab is no longer available.
        ports.delete(connectedPort);
      }
    }
  };
};
