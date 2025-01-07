/* eslint-disable @next/next/no-img-element */
/* eslint-disable tailwindcss/no-custom-classname */
"use client";
import { SideBarContext } from "@/context/SideBarContext";
import { useContext, useEffect } from "react";
import { MapsCard, ModesCard } from "@/components/game/theme-card";
import { Swiper, SwiperSlide } from "swiper/react";
import { useRouter, useSearchParams } from "next/navigation";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

import {
  EffectCoverflow,
  Autoplay,
  Pagination,
  Navigation,
} from "swiper/modules";

const MapsSwiper = ({ mode }: { mode: string }) => {
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
      className="swiper-container flex h-[70%] w-full items-center justify-center py-4"
    >
      <SwiperSlide className="overflow-visible">
        <MapsCard
          height="100px"
          imageUrl="/earth.png"
          title="Earth"
          description="earth could shake or make or fake"
          url={`/Game-Arena?mode=${mode}&map=earth`}
        />
      </SwiperSlide>
      <SwiperSlide className="overflow-visible">
        <MapsCard
          height="100px"
          imageUrl="/air.png"
          title="Air"
          description="Air: The invisible killer we can not live without"
          url={`/Game-Arena?mode=${mode}&map=air`}
        />
      </SwiperSlide>
      <SwiperSlide className="overflow-visible">
        <MapsCard
          height="100px"
          imageUrl="/fire.png"
          title="Fire"
          description="Because sometimes, you just need to watch the world burn."
          url={`/Game-Arena?mode=${mode}&map=fire`}
        />
      </SwiperSlide>
      <SwiperSlide className="overflow-visible">
        <MapsCard
          height="100px"
          imageUrl="/water.png"
          title="Water"
          description="The slippery element that makes sure your Pong ball never stays on course."
          url={`/Game-Arena?mode=${mode}&map=water`}
        />
      </SwiperSlide>
    </Swiper>
  );
};

const GameModeSwiper = () => {
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
      className="swiper-container flex h-[70%] w-full items-center justify-center overflow-auto py-4"
    >
      <SwiperSlide className="overflow-visible">
        <ModesCard
          height="100px"
          title="toutnement"
          description=""
          url={`/games?mode=tournoment`}
        />
      </SwiperSlide>
      <SwiperSlide className="overflow-visible">
        <ModesCard
          height="100px"
          title="Local Tournement"
          description=""
          url={`/games?mode=tournoment-local`}
        />
      </SwiperSlide>
      <SwiperSlide className="overflow-visible">
        <ModesCard
          height="100px"
          title="One Vs One"
          description=""
          url={`/games?mode=one-vs-one`}
        />
      </SwiperSlide>
      <SwiperSlide className="overflow-visible">
        <ModesCard
          height="100px"
          title="Local One vs One"
          description="The slippery element that makes sure your Pong ball never stays on course."
          url={`/games?mode=one-vs-one-local`}
        />
      </SwiperSlide>
    </Swiper>
  );
};

const Game_modes = () => {
  const { setIsActivated } = useContext(SideBarContext);
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const game_id = searchParams.get("game_id");
  const router = useRouter();
  useEffect(() => {
    if (game_id) {
      router.push(`/Game-Arena?mode=one-vs-one&map=earth&game_id=${game_id}`);
    }
  }, [game_id]);

  useEffect(() => {
    setIsActivated(2);
  }, []);

  if (game_id) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex size-full flex-col px-3 py-2">
      <div className="z-10 mb-[-100px] flex h-[200px] items-center justify-center">
        <img src="/games-logo.svg" alt="" className="size-[300px]" />
      </div>
      <div className="custom-inner-shadow costum-little-shadow relative flex h-full items-center overflow-hidden rounded-[30px] bg-black-crd">
        <div className="flex size-full items-center">
          {mode ? <MapsSwiper mode={mode} /> : <GameModeSwiper />}
        </div>
      </div>
    </div>
  );
};

export default Game_modes;
