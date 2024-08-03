import Image from 'next/image';
import styles from './page.module.css';
import Circle from '@/components/Circle';
import Card from '@/components/Card';

export default function Home() {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#13191D',
      }}
    >
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
        <Circle
          title="circle1"
          top="-310px"
          left="-310px"
          transform={140}
          w="300px"
          h="300px"
        />
        <Circle
          title="circle2"
          top="-150px"
          left="460px"
          transform={170}
          w="90px"
          h="90px"
        />
        <Circle
          title="circle3"
          top="500px"
          left="-500px"
          transform={200}
          w="400px"
          h="400px"
        />
      </div>
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
  );
}
