import { IconEdit } from '@tabler/icons-react';
const EditProfilePicture = () => {
  const user = {
    username: 'Johndoe',
    email: 'xaxaxaxa@gmail.com',
    backgroundImage: '/bg-profile.svg',
  };
  return (
    <div className="w-full h-[500px] flex flex-row items-center justify-start relative">
      <div
        className="absolute h-full w-full -z-0"
        style={{
          backgroundImage: "url('/bg-profile.svg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(10px)',
        }}
      ></div>
      <div className="size-full items-center justify-start flex flex-row absolute z-99 gap-24">
        <div className="h-[500px] w-[500px] rounded-full flex  mt-[-50px]">
          <img src="/ProfilePhoto.svg" alt="profile" className="size-full rounded-full" />
        </div>
        <div className="w-[300px] h-full gap-8">
          <div className="text-white text-[30px] font-coustard font-light border-2">
            {user.username}
          </div>
          <div className="text-white text-[30px] font-coustard font-light border-2">
            {user.email}
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditProfilePicture;
