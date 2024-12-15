/* eslint-disable @next/next/no-img-element */
/* eslint-disable tailwindcss/no-custom-classname */
'use client';
import { SideBarContext } from '@/context/SideBarContext';
import { useContext, useEffect } from 'react';
import { MapsCard, ModesCard } from '@/components/game/theme-card';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useRouter, useSearchParams } from 'next/navigation';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { EffectCoverflow, Autoplay, Pagination, Navigation } from 'swiper/modules';

const MapsSwiper = ({ mode }: { mode: string }) => {
  // const getrout = (mode: string) => {
  //   const newSearchParams = new URLSearchParams(searchParams.toString());
  //   newSearchParams.set('mode', mode);
  //   router.push(`/games?${searchParams.toString()}`);
  // };

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
      <SwiperSlide>
        <MapsCard
          height="100px"
          imageUrl="/earth.png"
          title="Earth"
          description="earth could shake or make or fake"
          url={`/Game-Arena?mode=${mode}&map=earth`}
        />
      </SwiperSlide>
      <SwiperSlide>
        <MapsCard
          height="100px"
          imageUrl="/air.png"
          title="Air"
          description="Air: The invisible killer we can not live without"
          url={`/Game-Arena?mode=${mode}&map=air`}
        />
      </SwiperSlide>
      <SwiperSlide>
        <MapsCard
          height="100px"
          imageUrl="/fire.png"
          title="Fire"
          description="Because sometimes, you just need to watch the world burn."
          url={`/Game-Arena?mode=${mode}&map=fire`}
        />
      </SwiperSlide>
      <SwiperSlide>
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
  const searchParams = useSearchParams();
  const router = useRouter();

  return (
    <Swiper
      effect={'coverflow'}
      grabCursor={true}
      centeredSlides={true}
      loop={true}
      slidesPerView={2} // Show multiple slides
      spaceBetween={60} // Add space between slides
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
      <SwiperSlide>
        <ModesCard
          height="100px"
          title="Play costum toutnement"
          description="Air: The invisible killer we can not live without"
          url={`/games?mode=tournoment`}
        />
      </SwiperSlide>
      <SwiperSlide>
        <ModesCard
          height="100px"
          title="simple match One Vs One"
          description="Because sometimes, you just need to watch the world burn."
          url={`/games?mode=one-vson`}
        />
      </SwiperSlide>
      <SwiperSlide>
        <ModesCard
          height="100px"
          title="play vs our ai"
          description="The slippery element that makes sure your Pong ball never stays on course."
          url={`/games?mode=ai`}
        />
      </SwiperSlide>
    </Swiper>
  );
};

const Game_modes = () => {
  const { setIsActivated } = useContext(SideBarContext);
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  console.log(`mode`, mode);
  useEffect(() => {
    setIsActivated(2);
  }, [setIsActivated]);

  return (
    <div className="col-start-2 col-end-12 row-start-2 row-end-10 flex flex-col px-3 py-2">
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
