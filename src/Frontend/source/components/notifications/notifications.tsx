import { IoMdNotifications } from 'react-icons/io';
import { useState } from 'react';
import { Notification } from '@/constants/notifications';

interface NotificationBellProps {
  notifications: Notification[];
  notificationCount: number;
  setNotificationsCount: (count: number) => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ notifications, notificationCount, setNotificationsCount }) => {
  const [notifClicked, setNotifClicked] = useState(false);

  return (
    <div className="relative z-50">
      <div className="flex size-[33px] items-center justify-center rounded-full bg-[rgba(28,28,28,0.4)] opacity-60 shadow-xl md:size-[40px]">
        <IoMdNotifications
          className="size-[13px] sm:size-[20px] text-[rgba(28,28,28,0.9)] dark:text-[#B8B8B8] md:size-[30px] transition-all duration-300"
          onClick={() => {
            setNotifClicked(!notifClicked);
            setNotificationsCount(0);
          }}
        />
        {notificationCount > 0 && (
          <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs">
            {notificationCount}
          </span>
        )}
      </div>
      {notifClicked && (
        <div className="absolute top-10 right-0 w-80 bg-white shadow-lg rounded-lg">
          {notifications.map((notification,index) => (
            <div key={index} className="p-4 border-b border-gray-200">
              <p>{notification.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;