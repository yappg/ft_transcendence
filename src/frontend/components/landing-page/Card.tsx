import Logo from '@/public/landing-page-logo.svg';
import Button from '../Button';

const Card = () => {
  return (
    <div className="w-full h-full rounded-lg shadow-lg z-[2] flex flex-col justify-center items-center md:bg-white">
      <div className="w-[45%] h-[20vh] mb-[-20%] z-[3]">
        <Logo />
      </div>
      <div className="w-full h-full">
        <div className="w-full h-full bg-[rgb(88,88,84,0.6)] rounded-tl-[40px] rounded-tr-[40px] flex flex-col drop-shadow-custom">
          <div className="w-full h-[100%] flex flex-col gap-4">
            <div className="w-full h-[13%] flex">
              <div className="bg-[rgb(0,0,0,0.5)] h-[6vh] w-[6vh] rounded-lg absolute top-2 left-2"></div>
            </div>
            <div className="w-full h-[35%] px-12">
              <h1 className="text-[10vw] font-extrabold">
                Start your own hallucinating ping pong journey
              </h1>
            </div>
            <div className="w-full h-[25%] px-12">
              <p className="text-[6vw]">
                welcome to PiPo lorem ipsum ipsum lorem hehe makayn maytgal
              </p>
            </div>
            <div className="w-full flex-grow flex justify-center items-end py-9 text-[30px]">
              <Button>Explore</Button>
            </div>
          </div>
          <div className="w-[50%] hidden"></div>
        </div>
      </div>
    </div>
  );
};

export default Card;
