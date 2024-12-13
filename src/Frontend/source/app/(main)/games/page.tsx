'use client';
import { SideBarContext } from '@/context/SideBarContext';
import { useContext, useEffect } from 'react';
import { MapsCard } from '@/components/game/theme-card';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaArrowRight } from 'react-icons/fa6';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
// import { Pagination, Navigation, EffectCoverflow } from 'swiper/core';
import { EffectCoverflow, Autoplay, Pagination, Navigation } from 'swiper/modules';


const Game_modes = () => {
  const { setIsActivated } = useContext(SideBarContext);
  useEffect(() => {
    setIsActivated(2);
  }, [setIsActivated]);

  return (
    <div className="col-start-2 col-end-12 row-start-2 row-end-10 flex flex-col px-3 py-2">
      <div className="z-10 mb-[-100px] flex h-[200px] items-center justify-center">
        <img src="/games-logo.svg" alt="" className="size-[300px]" />
      </div>
      <div className="custom-inner-shadow costum-little-shadow relative flex h-full items-center overflow-hidden rounded-[30px] bg-black-crd">
        <div className="flex w-full overflow-hidden items-center h-full">
          <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            slidesPerView={3} // Show multiple slides
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
            className="h-[70%] py-4 swiper-container w-full flex items-center justify-center"
          >
            <SwiperSlide>
              <MapsCard
                height="100px"
                imageUrl="/earth.png"
                title="Earth"
                description="earth could shake or make or fake"
                url="earth"
              />
            </SwiperSlide>
            <SwiperSlide>
              <MapsCard
                height="100px"
                imageUrl="/air.png"
                title="Air"
                description="Air: The invisible killer we can not live without"
                url="/air"
              />
            </SwiperSlide>
            <SwiperSlide>
              <MapsCard
                height="100px"
                imageUrl="/fire.png"
                title="Fire"
                description="Because sometimes, you just need to watch the world burn."
                url="fire"
              />
            </SwiperSlide>
            <SwiperSlide>
              <MapsCard
                height="100px"
                imageUrl="/water.png"
                title="Water"
                description="The slippery element that makes sure your Pong ball never stays on course."
                url="water"
              />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Game_modes;