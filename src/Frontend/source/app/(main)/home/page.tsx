'use client';
import { SideBarContext } from '@/context/SideBarContext';
import { useContext } from 'react';
import { DashboardCard } from '@/components/home/DashboardCard';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { MapsCard } from '@/components/game/theme-card';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Chart } from '@/components/Profile/Chart';
import Rating from '@/components/Profile/rating';
import { useUser } from '@/context/GlobalContext';
import { RiArrowRightSLine } from 'react-icons/ri';
import HomeAchievement from '@/components/home/HomeAchievement';
import Link from 'next/link';
import { HomeLeaderboard } from '@/components/home/HomeLeaderboard';
const MapsSwiper = ({ mode }: { mode: string }) => {
  return (
    <Swiper
      effect={'coverflow'}
      grabCursor={true}
      centeredSlides={true}
      loop={true}
      slidesPerView={2}
      spaceBetween={60}
      coverflowEffect={{
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 2.5,
      }}
      autoplay={true}
      pagination={{ el: '.swiper-pagination', clickable: true }}
      modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
      className="swiper-container flex h-[70%] w-full items-center justify-center py-4"
    >
      <SwiperSlide className="overflow-visible">
        <MapsCard
          height="100px"
          imageUrl="/earth.png"
          title="Earth"
          description="earth could shake or make or fake"
          url={``}
        />
      </SwiperSlide>
      <SwiperSlide className="overflow-visible">
        <MapsCard
          height="100px"
          imageUrl="/air.png"
          title="Air"
          description="Air: The invisible killer we can not live without"
          url={``}
        />
      </SwiperSlide>
      <SwiperSlide className="overflow-visible">
        <MapsCard
          height="100px"
          imageUrl="/fire.png"
          title="Fire"
          description="Because sometimes, you just need to watch the world burn."
          url={``}
        />
      </SwiperSlide>
      <SwiperSlide className="overflow-visible">
        <MapsCard
          height="100px"
          imageUrl="/water.png"
          title="Water"
          description="The slippery element that makes sure your Pong ball never stays on course."
          url={``}
        />
      </SwiperSlide>
    </Swiper>
  );
};

const Home = () => {
  const { setIsActivated } = useContext(SideBarContext);
  const { user } = useUser();
  console.log('userrrrrrrrrrr',user?.achievements);
  if (!user) return <div>Loading...</div>;
  return (
    <div className="size-full overflow-y-scroll xl:gap-8 lg:gap-0 gap-[150px] lg:flex-row flex-col flex custom-scrollbar-container lg:overflow-hidden">
      <div className='lg:w-[60%] w-full lg:h-full h-[50%]'>
      <div className="z-10 mb-[-100px] flex h-[200px] items-center justify-center relative">
        <img src="/games-logo.svg" alt="" className="size-[300px]" />
      </div>
      <div className=" custom-inner-shadow costum-little-shadow relative flex h-full items-center overflow-hidden rounded-[30px] bg-black-crd">
          <div className="flex size-full items-center">
            <MapsSwiper mode="" />
          </div>
        </div>
      </div>
      <div className="lg:w-[40%] w-full lg:h-full justify-start lg:gap-10 gap-5 flex-col flex h-[50%] ">
        <div className="w-full h-[200px] lg:h-[10%]">
          <DashboardCard />
        </div>
        <div className="w-full h-[150px] md:h-[15%] lg:h-[10%] flex items-center justify-between bg-black-crd rounded-[30px] bg-black">
          {user?.achievement > 0 ?
          <HomeAchievement 
          title={user?.achievements[0].achievement.name}
          description={user?.achievements[0].achievement.description}
          points={user?.achievements[0].achievement.xp_gain}
          progress={user?.achievements[0].progress}
          xpReward={user?.achievements[0].achievement.xp_gain}
          ratio={user?.achievements[0].achievement.condition}
          iconUrl={"http://localhost:8080" + user?.achievements[0].image}
          />
          :
          <div className='w-full h-full flex items-center justify-center'>
            <p className='text-white text-[20px] font-dayson font-bold'>No achievement yet</p>
          </div>
          }
          <Link href={'/achievement'} className='lg:size-[80px] size-[50px] flex items-center justify-center'>
            <RiArrowRightSLine className='text-white lg:text-[80px] text-[40px] font-dayson font-bold' />
          </Link>
        </div>
        <div className=" w-full md:h-fit lg:h-[40%] h-[300px]">
          <HomeLeaderboard />
        </div>
        <div className=" w-full md:h-fit lg:h-[40%] h-[300px] bg-black-crd rounded-[30px] shadow-2xl">
        <div className="w-full h-full flex items-center justify-center bg-black-crd rounded-[30px] lg:flex-col flex-row xl:flex-row gap2">
          <div className="w-1/2  h-[80%] items-start justify-start">
            <Chart total_games={user?.total_games} stats={user?.statistics} />
          </div>
          <div className="w-1/2 h-full pt-5">
            <Rating statistics={user?.statistics} />
          </div>
        </div>
          
        </div>
      </div>
    </div>
  );
};

export default Home;
