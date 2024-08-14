import Logo from '@/public/landing-page-logo.svg';
import Button from '../Button';

const Card = () => {
  return (
    <div className="z-[2] flex size-full flex-col items-center justify-center rounded-lg shadow-lg lg:bg-slate-600">
      <div className="z-[3] mb-[-20%] h-1/4 w-[45%] md:mb-[-25%] lg:mb-0">
        <Logo />
      </div>
      <div className="flex size-full items-center justify-center">
        <div className="flex size-full flex-col rounded-t-[40px] bg-[rgb(88,88,84,0.6)] md:size-5/6 md:rounded-[40px]">
          <div className="flex size-full flex-col gap-4">
            <div className="flex h-[13%] w-full md:h-1/5 lg:h-[1%]">
              <div className="absolute left-2 top-2 size-[6vh] rounded-lg bg-[rgb(0,0,0,0.5)] drop-shadow-custom md:relative md:left-6 md:top-4 md:size-[75px]"></div>
            </div>
            <div className="h-[35%] w-full px-12">
              <h1 className="text-[9vw] font-extrabold drop-shadow-custom md:text-[7.5vw]">
                Start your own hallucinating ping pong journey
              </h1>
            </div>
            <div className="h-1/4 w-full px-12">
              <p className="text-[6vw] drop-shadow-custom md:text-[4vw]">
                welcome to PiPo lorem ipsum ipsum lorem hehe makayn maytgal
              </p>
            </div>
            <div className="flex w-full grow items-end justify-center py-9 text-[25px] md:text-[40px]">
              <Button>Explore</Button>
            </div>
          </div>
          <div className="hidden w-1/2 lg:block"></div>
        </div>
      </div>
    </div>
  );
};

export default Card;
