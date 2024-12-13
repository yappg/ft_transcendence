import UserInfo from '@/components/Profile/UserInfo';
import UserSummary from '@/components/Profile/UserSummary';
export default function page() {
  return (
    <div className="lg:col-span-10 lg:col-start-2 col-span-full col-start-1 row-span-8 row-start-2 grid grid-cols-[1fr] lg:py-4 lg:pl-6">
      <div className="costum-little-shadow size-full overflow-hidden lg:rounded-[50px] ">
        <div className="relative col-start-1 col- flex items-center justify-center w-full h-[45%]">
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
        <div className="flex items-center justify-center w-full h-[55%]">
          <UserSummary />
        </div>
      </div>
    </div>
  );
}
