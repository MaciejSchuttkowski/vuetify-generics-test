import { defineStore } from 'pinia';

export enum NotificationType {
  error = 'error',
  success = 'success',
  warning = 'warning',
  info = 'info',
}
export interface Notification {
  title?: string;
  message: string;
  type: NotificationType;
}
export const useNotificationsStore = defineStore('Notifications', {
  // state - initialer Zustand:
  state: (): {
    notifications: Notification[];
  } => ({
    notifications: [],
  }),
  // getters - Helfer-Funktionen für einfachen Zugriff auf bestimmte Elemente:
  getters: {
    getAllNotifications: (state): Notification[] => [...state.notifications].reverse(),
  },
  actions: {
    pushNotification(notification: Notification) {
      this.notifications.push(notification);
      if (notification.type === NotificationType.success) {
        setTimeout(() => this.removeNotification(notification), 2000);
      }
    },
    popOldestNotification(): Notification | undefined {
      if (this.notifications.length) {
        return this.notifications.splice(0, 1)[0];
      }
      return undefined;
    },
    removeNotification(notification: Notification) {
      const idx = this.notifications.indexOf(notification);
      if (idx !== -1) {
        this.notifications.splice(idx, 1);
      }
    },
    /* Komfort-Funktionen */
    pushError(message: string, title?: string): void {
      this.notifications.push({
        message: message,
        title: title,
        type: NotificationType.error,
      });
    },
    pushInfo(message: string, title?: string): void {
      const notification = {
        message: message,
        title: title,
        type: NotificationType.info,
      };
      this.notifications.push(notification);
      setTimeout(() => this.removeNotification(notification), 2000);
    },
    pushSuccess(message: string, title?: string): void {
      const notification = {
        message: message,
        title: title,
        type: NotificationType.success,
      };
      this.notifications.push(notification);
      setTimeout(() => this.removeNotification(notification), 2000);
    },
    pushWarning(message: string, title?: string): void {
      this.notifications.push({
        message: message,
        title: title,
        type: NotificationType.warning,
      });
    },
  },
});
