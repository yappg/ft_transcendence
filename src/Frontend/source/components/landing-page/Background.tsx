import Circle from "@/components/landing-page/Circle";
import circleData from "@/constants/circleData";
import LandingCard from "./LandingCard";

const Background = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {circleData.map((circle, index) => (
        <Circle
          key={index}
          w={circle.w}
          h={circle.h}
          top={circle.top}
          left={circle.left}
          etop={circle.etop}
          eleft={circle.eleft}
          transform={circle.transform}
          title={circle.title}
        />
      ))}
      <div className="z-[2] flex h-screen w-full items-center justify-center">
        <LandingCard />
      </div>
    </div>
  );
};

export default Background;
