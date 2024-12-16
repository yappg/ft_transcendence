import UserInfo from '@/components/Profile/UserInfo';
import UserSummary from '@/components/Profile/UserSummary';
export default function page() {
  return (
    <div className="size-full md:py-4 md:pl-6 overflow-auto ">
      <div className="costum-little-shadow size-full overflow-hidden md:rounded-[50px] gap-8">
        <div className="relative col-start-1 col- flex items-center justify-center w-full h-[40%] md:h-[50%] min-h-[500px]">
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
          <UserInfo />
        </div>
        <div className="flex items-center justify-center w-full h-[60%] md:h-[50%]">
          <UserSummary />
        </div>
      </div>
    </div>
  );
}
