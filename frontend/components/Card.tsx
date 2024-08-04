import './components.css';
import Racket from '@/public/racket.svg';

const Card = () => {
  return (
    <div className="card">
      <div className="left">
        <div className="lang">O</div>
        <h2>Start your own halucinating ping pong journey</h2>
        <p>welcome to PiPo lorem ipsum ipsum lorem hehe makayn maytgal </p>
        <button className="explore">explore</button>
      </div>
      <div className="right">
        <Racket />
      </div>
    </div>
  );
};

export default Card;
