'use client';
import { useState } from 'react';
export default function Home_TFA() {
  const [isActivated, setIsActivated] = useState(0);
  const [ShowRightBar, setShowRightBar] = useState(true);
  const [ShowsideBarIcons, setShowsideBarIcons] = useState(false);
  function handleRightClick(id: number) {
    console.log('id', id);
    if (id === 6 || id === 7) {
      setShowRightBar(false);
      setShowsideBarIcons(true);
    } else {
      setShowRightBar(true);
      setShowsideBarIcons(false);
    }
  }
  return <div></div>;
}
