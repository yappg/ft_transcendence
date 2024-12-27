import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { TbLogout2 } from 'react-icons/tb';
// import { div } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/settings/Card';

const Logout = () => {
  const auth = useAuth();

  const handleClick = () => {
    const fetchLogout = async () => {
      try {
        const response = await fetch('http://localhost:8080/accounts/auth/logout/', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLogout();
    auth.logout();
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger
        asChild
        className=" bg-transparent size-full p-0"
      >
        <div className="size-full">
          <Card title="Logout" Icon={TbLogout2}  path="" />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#28AFB0] dark:bg-[#C1382C]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to log out? You will need to log in again to access your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default Logout;
