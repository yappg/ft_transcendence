/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable tailwindcss/classnames-order */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { SideBarContext } from "@/context/SideBarContext";
import { useContext } from "react";
import { DashboardCard } from "@/components/home/DashboardCard";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { MapsCard } from "@/components/game/theme-card";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Autoplay,
  Pagination,
  Navigation,
} from "swiper/modules";
import { Chart } from "@/components/Profile/Chart";
import Rating from "@/components/Profile/rating";
import { useUser } from "@/context/GlobalContext";
import { Achievement } from "@/constants/achivemement";
import { RiArrowRightSLine } from "react-icons/ri";
import HomeAchievement from "@/components/home/HomeAchievement";
import Link from "next/link";
import { HomeLeaderboard } from "@/components/home/HomeLeaderboard";
import { userService } from "@/services/userService";
import { useEffect } from "react";
import { ChartLine } from "@/components/Profile/ChartLine";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable react-hooks/exhaustive-deps */
const MapsSwiper = () => {
  return (
    <Swiper
      effect={"coverflow"}
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
      pagination={{ el: ".swiper-pagination", clickable: true }}
      modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
      className="swiper-container flex size-full items-center justify-center py-4 lg:h-[70%]"
    >
      <SwiperSlide className="lg: h-full w-1/3">
        <MapsCard
          height="100px"
          imageUrl="/earth.png"
          title="Earth"
          description="earth could shake or make or fake"
          url={`Game-Arena?mode=one-vs-one-local&map=earth`}
        />
      </SwiperSlide>
      <SwiperSlide className="lg: h-full w-1/3">
        <MapsCard
          height="100px"
          imageUrl="/air.png"
          title="Air"
          description="Air: The invisible killer we can not live without"
          url={`Game-Arena?mode=one-vs-one-local&map=air`}
        />
      </SwiperSlide>
      <SwiperSlide className="lg: h-full w-1/3">
        <MapsCard
          height="100px"
          imageUrl="/fire.png"
          title="Fire"
          description="Because sometimes, you just need to watch the world burn."
          url={`Game-Arena?mode=one-vs-one-local&map=fire`}
        />
      </SwiperSlide>
      <SwiperSlide className="lg: h-full w-1/3">
        <MapsCard
          height="100px"
          imageUrl="/water.png"
          title="Water"
          description="The slippery element that makes sure your Pong ball never stays on course."
          url={`Game-Arena?mode=one-vs-one-local&map=water`}
        />
      </SwiperSlide>
    </Swiper>
  );
};

const Home = () => {
  const {
    user,
    setAchievements,
    achievements,
    setIsLoading,
    isLoading,
    setPlayerLeaderBoard,
    PlayerLeaderBoard,
    setPlayerMatches,
    PlayerMatches,
  } = useUser();

  const fetchAchievements = async () => {
    setIsLoading(true);
    try {
      const fetchedAchievements = await userService.getAchievements();
      const mappedAchievements: Achievement[] = fetchedAchievements.map(
        (data: any) => ({
          player: data.player,
          achievement: {
            name: data.achievement.name,
            description: data.achievement.description,
            xp_gain: data.achievement.xp_gain,
            condition: data.achievement.condition,
          },
          date_earned: data.date_earned,
          image: data.image,
          xpReward: data.achievement.xp_gain,
          ratio: data.achievement.condition,
          progress: data.progress,
          iconUrl: data.image,
          gained: data.gained,
          dateEarned: data.date_earned,
        }),
      );
      setAchievements(mappedAchievements);
    } catch (err) {
      setAchievements([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const response = await userService.getPlayerLeaderBoard();
      setPlayerLeaderBoard(response);
    } catch (error) {
      console.log("Error fetching leaderboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPlayerMatches = async () => {
    setIsLoading(true);
    try {
      const response = await userService.getPlayerMatches();
      setPlayerMatches(response);
    } catch (error) {
      console.log("Error fetching player matches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayerMatches();
    fetchAchievements();
    fetchLeaderboard();
  }, []);
  let userAchievements: Achievement[] = achievements || [];
  if (!user || isLoading)
    return (
      <div className="size-full">
        <div className="size-fullitems-center hidden justify-center gap-3 lg:flex">
          <Skeleton className="h-full w-3/5 rounded-[30px] bg-black-crd" />
          <Skeleton className="h-full w-2/5 rounded-[30px] bg-black-crd" />
        </div>
        <Skeleton className="flex size-full bg-black-crd lg:hidden" />
      </div>
    );
  userAchievements = user?.achievements;
  return (
    <div className="custom-scrollbar-container flex size-full flex-col gap-4 lg:flex-row lg:gap-3">
      <div className="flex h-1/2 w-full flex-col justify-center lg:h-full lg:w-3/5">
        <div className="relative z-10 mb-[-100px] hidden h-[200px] items-center justify-center py-4 lg:flex">
          <Image
            src="/games-logo.svg"
            alt=""
            width={80}
            height={80}
            className="size-[300px]"
            unoptimized={true}
          />
        </div>
        <div className="custom-inner-shadow costum-little-shadow flex h-full items-center overflow-hidden rounded-[30px] bg-black-crd p-3 lg:h-3/4">
          <div className="flex size-full items-center">
            <MapsSwiper />
          </div>
        </div>
      </div>
      <div className="flex h-1/2 w-full flex-col justify-start gap-5 lg:h-full lg:w-2/5 lg:gap-9">
        <div className="h-[100px] min-h-[60px] w-full md:h-[100px] lg:h-[10%]">
          <DashboardCard playerMatches={PlayerMatches || []} />
        </div>
        <div className="realtive flex w-full items-center justify-between rounded-[30px] bg-black-crd py-2 md:h-[15%] lg:h-[15%]">
          {userAchievements && userAchievements.length > 0 ? (
            <HomeAchievement
              title={userAchievements[0].achievement.name}
              description={userAchievements[0].achievement.description}
              points={userAchievements[0].achievement.xp_gain}
              progress={userAchievements[0].progress}
              xpReward={userAchievements[0].achievement.xp_gain}
              ratio={userAchievements[0].achievement.condition}
              iconUrl={process.env.NEXT_PUBLIC_HOST + userAchievements[0].image}
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <p className="font-dayson font-bold text-white lg:text-[10px] 2xl:text-[20px]">
                No achievement yet
              </p>
            </div>
          )}
          <Link
            href={"/achievement"}
            className="flex size-[30px] items-center justify-center lg:size-[30px] 2xl:size-[50px]"
          >
            <RiArrowRightSLine className="font-dayson text-[20px] font-bold text-white lg:text-[80px] 2xl:text-[40px]" />
          </Link>
        </div>
        <div className="relative h-[300px] min-h-[300px] w-full md:h-fit lg:h-2/5">
          <HomeLeaderboard playerLeaderBoard={PlayerLeaderBoard || []} />
        </div>
        <div className="hidden h-fit w-full flex-col overflow-hidden rounded-[30px] bg-black-crd shadow-2xl sm:h-[300px] md:h-fit lg:flex lg:h-2/5">
          <div className="gap2 flex size-full h-[300px] min-h-[200px] flex-row items-center justify-center bg-black-crd lg:h-1/2 lg:flex-row xl:flex-row">
            <div className="h-4/5 w-1/2 items-start justify-start">
              <Chart total_games={user?.total_games} stats={user?.statistics} />
            </div>
            <div className="h-full w-1/2 pt-5">
              <Rating statistics={user?.statistics} />
            </div>
          </div>
          <div className="hidden h-[200px] w-full items-center justify-center bg-black-crd sm:flex lg:h-1/2">
            <ChartLine statistics={user?.statistics} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
