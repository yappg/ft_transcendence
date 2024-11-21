'use client';
import { SideBarContext } from '@/context/SideBarContext';
import { useContext } from 'react';
import { useEffect } from 'react';
export default function Home_TFA() {
  const { setIsActivated } = useContext(SideBarContext);
  useEffect(() => {
    setIsActivated(2);
  }, [setIsActivated]);
  return <div></div>;
}