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
import { BsBoxArrowLeft } from 'react-icons/bs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const Logout = () => {
  const auth = useAuth();

  const handleClick = () => {
    const fetchLogout = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/auth/logout/', {
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
        className="bg-transparent border-none size-full hover:bg-[#000000] transition-all duration-300"
      >
        <Button
          variant="outline"
          className="size-full flex items-center justify-start gap-11 px-12"
        >
          <BsBoxArrowLeft size={30} color="white" />
          <h1 className="text-white font-dayson">Lougout</h1>
        </Button>
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
