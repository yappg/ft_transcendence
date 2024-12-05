import UserInfo from '@/components/Profile/UserInfo';
import UserSummary from '@/components/Profile/UserSummary';
export default function page() {
  return (
    <div className="col-span-10 col-start-2 row-span-8 row-start-2 grid grid-cols-[1fr] grid-rows-[1fr] py-4 pl-6">
      <div className="costum-little-shadow size-full overflow-hidden rounded-[50px]">
        <div className="flex items-center justify-center w-full h-[45%] bg-[url('/Mode-bg.svg')] bg-cover ">
          <UserInfo />
        </div>
        <div className="flex items-center justify-center w-full h-[55%]">
          <UserSummary />
        </div>
      </div>
    </div>
  );
}
