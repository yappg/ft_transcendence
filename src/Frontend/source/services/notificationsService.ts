class NotificationsService {
  private ws: WebSocket;
  private notificationCount: number;
  private notifications: any[];

  constructor(url: string) {
    this.ws = new WebSocket(url);
    this.notificationCount = 0;
    this.notifications = [];

    this.ws.onopen = this.onOpen.bind(this);
    this.ws.onerror = this.onError.bind(this);
    this.ws.onclose = this.onClose.bind(this);
  }

  private onOpen(event: Event) {
    console.log('WebSocket connection opened');
  }

  private onError(event: Event) {
    console.log(event);
    console.error('WebSocket error:', event);
    if (event instanceof ErrorEvent) {
      console.error('Error message:', event.message);
    }
  }

  private onClose(event: CloseEvent) {
    console.log('WebSocket connection closed:', event);
  }

  public setOnMessageHandler(handler: (event: MessageEvent) => void) {
    this.ws.onmessage = handler;
  }

  public sendMessage(message: any) {
    this.ws.send(JSON.stringify(message));
  }

  public markAsRead(notificationId: string) {
    this.sendMessage({
      action: 'mark_as_read',
      notification_id: notificationId,
    });
  }

  public getNotificationCount() {
    return this.notificationCount;
  }

  public getNotifications() {
    return this.notifications;
  }

  public close() {
    this.ws.close();
  }
}
