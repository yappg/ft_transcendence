import { IoMdNotifications } from 'react-icons/io';
import { useState } from 'react';
import { Notification } from '@/constants/notifications';

interface NotificationBellProps {
  notifications: Notification[];
  notificationCount: number;
  setNotificationsCount: (count: number) => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  notifications,
  notificationCount,
  setNotificationsCount,
}) => {
  const [notifClicked, setNotifClicked] = useState(false);

  return (
    <div className="relative z-50">
      <div className="flex size-[33px] items-center justify-center rounded-full bg-[rgba(28,28,28,0.4)] opacity-60 shadow-xl md:size-[40px]">
        <IoMdNotifications
          className="size-[13px] text-[rgba(28,28,28,0.9)] transition-all duration-300 sm:size-[20px] md:size-[30px] dark:text-[#B8B8B8]"
          onClick={() => {
            setNotifClicked(!notifClicked);
            setNotificationsCount(0);
          }}
        />
        {notificationCount > 0 && (
          <span className="absolute right-0 top-0 flex size-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {notificationCount}
          </span>
        )}
      </div>
      {notifClicked && (
        <div className="absolute right-0 top-10 w-80 rounded-lg bg-white shadow-lg">
          {notifications.map((notification, index) => (
            <div key={index} className="border-b border-gray-200 p-4">
              <p>{notification.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
