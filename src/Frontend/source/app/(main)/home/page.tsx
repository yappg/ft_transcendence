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
import { Achievement } from '@/constants/achivemement';
import { RiArrowRightSLine } from 'react-icons/ri';
import HomeAchievement from '@/components/home/HomeAchievement';
import Link from 'next/link';
import { HomeLeaderboard } from '@/components/home/HomeLeaderboard';
import { ChartLine } from '@/components/Profile/ChartLine';

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
  const { user, setAchievements } = useUser();

  let userAchievements: Achievement[] = [];
  if (!user) return <div>Loading...</div>;
  userAchievements = user?.achievements;
  return (
    <div className="custom-scrollbar-container flex size-full flex-col gap-[150px] overflow-y-scroll lg:flex-row lg:gap-0 lg:overflow-hidden xl:gap-8">
      <div className="h-[50%] w-full lg:h-full lg:w-3/5">
        <div className="relative z-10 mb-[-100px] flex h-[200px] items-center justify-center">
          <img src="/games-logo.svg" alt="" className="size-[300px]" />
        </div>
        <div className=" custom-inner-shadow costum-little-shadow bg-black-crd relative flex h-full items-center overflow-hidden rounded-[30px]">
          <div className="flex size-full items-center">
            <MapsSwiper mode="" />
          </div>
        </div>
      </div>
      <div className="flex h-[50%] w-full flex-col justify-start gap-5 lg:h-full lg:w-2/5 lg:gap-10 ">
        <div className="md:h-[100px] h-[200px] w-full lg:h-[10%]">
          <DashboardCard />
        </div>
        <div className="bg-black-crd flex h-[150px] w-full items-center justify-between rounded-[30px] bg-black md:h-[15%] lg:h-[15%] realtive">
          {userAchievements && userAchievements.length > 0 ? (
            <HomeAchievement
              title={userAchievements[0].achievement.name}
              description={userAchievements[0].achievement.description}
              points={userAchievements[0].achievement.xp_gain}
              progress={userAchievements[0].progress}
              xpReward={userAchievements[0].achievement.xp_gain}
              ratio={userAchievements[0].achievement.condition}
              iconUrl={'http://localhost:8080' + userAchievements[0].image}
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <p className="font-dayson 2xl:text-[20px] lg:text-[10px] font-bold text-white">No achievement yet</p>
            </div>
          )}
          <Link
            href={'/achievement'}
            className="flex 2xl:size-[50px] size-[30px] items-center justify-center lg:size-[30px]"
          >
            <RiArrowRightSLine className="font-dayson 2xl:text-[40px] text-[20px] font-bold text-white lg:text-[80px]" />
          </Link>
        </div>
        <div className=" h-[300px] w-full md:h-fit lg:h-2/5">
          <HomeLeaderboard />
        </div>
        <div className=" bg-black-crd h-[300px] md:h-fit w-full rounded-[30px] shadow-2xl md:h-fit lg:h-2/5 lg:overflow-hidden overflow-y-scroll custom-scrollbar-container">
          <div className="bg-black-crd gap2 flex size-full flex-row items-center justify-center lg:flex-row xl:flex-row lg:h-1/2 h-[300px] ">
            <div className="h-4/5  w-1/2 items-start justify-start">
              <Chart total_games={user?.total_games} stats={user?.statistics} />
            </div>
            <div className="h-full w-1/2 pt-5">
              <Rating statistics={user?.statistics} />
            </div>
          </div>
          <div className="w-full lg:h-1/2 flex items-center justify-center bg-black-crd h-[300px]">
          <ChartLine statistics={user?.statistics} />
        </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
