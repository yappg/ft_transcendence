import { RatingElement } from './RatingElement';
import { Statistics } from '@/context/GlobalContext';
const Rating = ({ statistics }: { statistics: Statistics }) => {
  return (
    <div className="flex h-full w-1/2 flex-col items-center justify-center gap-16">
      <div className="flex size-fit items-center justify-center gap-16">
        <RatingElement color="#766153" title="Earth" value={statistics.earth_ratio} />
        <RatingElement color="#C1382C" title="Fire" value={statistics.fire_ratio} />
      </div>
      <div className="flex size-fit items-center justify-center gap-16">
        <RatingElement color="#00A6FF" title="Water" value={statistics.water_ratio} />
        <RatingElement color="#98CBD0" title="Air" value={statistics.air_ratio} />
      </div>
    </div>
  );
};
export default Rating;
