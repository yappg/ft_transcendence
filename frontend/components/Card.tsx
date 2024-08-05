import './components.css';
import Racket from '@/public/racket.svg';
import { MdOutlineLanguage } from 'react-icons/md';
import Logo from '@/public/landing-page-logo.svg';

const Card = () => {
  return (
    <div className="box">
      <div className="logo">
        <Logo />
      </div>
      <div className="all">
        <div className="card">
          <div className="left">
            <div className="lang-box">
              <div className="lang">
                <MdOutlineLanguage />
              </div>
            </div>
            <div className="title">
              <h2>Start your own halucinating ping pong journey</h2>
            </div>
            <div className="paragraph">
              <p>
                welcome to PiPo lorem ipsum ipsum lorem hehe makayn maytgal{' '}
              </p>
            </div>
            <button className="explore">
              <a href="/home">Explore</a>
            </button>
          </div>
          <div className="right">
            <Racket />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
