import Image from 'next/image';
import styles from './page.module.css';
import Circle from '@/components/Circle';
import Card from '@/components/Card';
import circleData from '@/constants/circleData';

export default function Home() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#13191D',
        zIndex: 1,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
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
        <div
          style={{
            height: '100vh',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2,
          }}
        >
          <Card />
        </div>
      </div>
    </div>
  );
}
