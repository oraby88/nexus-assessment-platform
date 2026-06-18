// Notifications (US4 / FR-ADM-008): read state + simulated email-delivery indicator.
import type { AppNotification } from '@/models';
import { mockRequest } from '@/services/http';
import { notifications } from '@/mocks';
import type { NotificationServiceContract } from '@/services/contracts';

export const notificationService = {
  list(): Promise<AppNotification[]> {
    return mockRequest(() => [...notifications]);
  },
  unreadCount(): Promise<number> {
    return mockRequest(() => notifications.filter((n) => !n.read).length);
  },
  markRead(id: string): Promise<void> {
    return mockRequest<void>(() => {
      const n = notifications.find((x) => x.id === id);
      if (n) n.read = true;
    });
  },
  markAllRead(): Promise<void> {
    return mockRequest<void>(() => {
      notifications.forEach((n) => (n.read = true));
    });
  },
} satisfies NotificationServiceContract;
