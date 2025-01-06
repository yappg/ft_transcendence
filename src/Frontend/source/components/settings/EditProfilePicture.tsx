import { IconEdit } from "@tabler/icons-react";
import Image from "next/image";
const EditProfilePicture = () => {
  const user = {
    username: "Johndoe",
    email: "xaxaxaxa@gmail.com",
    backgroundImage: "/bg-profile.svg",
  };
  return (
    <div className="relative flex h-[500px] w-full flex-row items-center justify-start">
      <div
        className="absolute -z-0 size-full"
        style={{
          backgroundImage: "url('/bg-profile.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "blur(10px)",
        }}
      ></div>
      <div className="absolute z-50 flex size-full flex-row items-center justify-start gap-24">
        <div className="mt-[-50px] flex size-[500px] rounded-full">
          <Image
            src="/ProfilePhoto.svg"
            alt="profile"
            className="size-full rounded-full"
            width={10}
            height={10}
            unoptimized
          />
        </div>
        <div className="h-full w-[300px] gap-8">
          <div className="border-2 font-poppins text-[30px] font-light text-white">
            {user.username}
          </div>
          <div className="border-2 font-poppins text-[30px] font-light text-white">
            {user.email}
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditProfilePicture;
