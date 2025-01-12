/* eslint-disable tailwindcss/no-custom-classname */
import { IoMdNotifications } from "react-icons/io";
import { useState } from "react";
import { Notification } from "@/constants/notifications";
import { notificationsService } from "@/services/notificationsService";

interface NotificationBellProps {
  notifications: Notification[];
  notificationCount: number;
  setNotificationsCount: (count: number) => void;
  setNotifications: (notifications: Notification[]) => void;
  onToggle: (isOpen: boolean) => void;
  isOpen: boolean;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  notifications,
  notificationCount,
  setNotificationsCount,
  setNotifications,
  onToggle,
  isOpen,
}) => {
  const [notifClicked, setNotifClicked] = useState(false);
  const fetchNotifications = async () => {
    try {
      const fetchedNotifications =
        await notificationsService.getNotifications();
      setNotifications(fetchedNotifications as Notification[]);
    } catch (err) {
      setNotifications([]);
      setNotificationsCount(0);
    }
  };

  return (
    <div className="relative z-50">
      <div className="bg-[rgba(28,28,28,0.4)]opacity-60 flex size-[23px] items-center justify-center rounded-full shadow-xl md:size-[40px]">
        <IoMdNotifications
          className="size-[13px] text-[rgba(28,28,28,0.9)] transition-all duration-300 dark:text-[#B8B8B8] sm:size-[20px] md:size-[30px]"
          onClick={() => {
            fetchNotifications();
            setNotifClicked(!notifClicked);
            setNotificationsCount(0);
            onToggle(!isOpen);
          }}
        />
        {notificationCount > 0 && (
          <span className="absolute right-0 top-0 flex size-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {notificationCount}
          </span>
        )}
      </div>
      {isOpen && (
        <div className="bg-white absolute right-0 top-10 w-80 rounded-lg shadow-lg">
          {notifications.map((notification, index) => (
            <div key={index} className="border-b border-gray-200 p-4">
              <p className="text-black">{notification.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
