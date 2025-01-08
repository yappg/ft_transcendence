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
} from "@/components/ui/alert-dialog";
import { TbLogout2 } from "react-icons/tb";
import { Card } from "@/components/settings/Card";
import { useRouter } from "next/navigation";

const Logout = () => {
  const router = useRouter();

  const handleClick = () => {
    const fetchLogout = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/accounts/auth/logout/",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLogout();
    router.push("/auth/login");
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className="size-full bg-transparent p-0">
        <div className="size-full">
          <Card title="Logout" Icon={TbLogout2} path="" />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#28AFB0]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-black">
            Are you sure you want to log out? You will need to log in again to
            access your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-black dark:text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default Logout;
