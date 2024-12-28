import { RatingElement } from "./RatingElement";

const Rating = () => {
    return(
        <div className="w-1/2 h-full flex flex-col items-center gap-6 justify-center">
            <div className="w-fit h-fit flex items-center justify-center gap-6">
                <RatingElement color="#FFB400" title="Earth" value={80} />
                <RatingElement color="#FFB400" title="Fire" value={80} />
            </div>
            <div className="w-fit h-fit flex items-center justify-center gap-6">
                <RatingElement color="#FFB400" title="Earth" value={80} />
                <RatingElement color="#FFB400" title="Fire" value={80} />
            </div>

        </div>
    )
};
export default Rating;