'use client';

import React, { useEffect, useRef } from 'react';
import { Application, Graphics, Sprite, Assets } from 'pixi.js';
import { GlowFilter } from 'pixi-filters';

const GameArena = () => {
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const initPixi = async () => {
      const app = new Application();

      await app.init({
        background: '#000000',
        resizeTo: document.getElementById('table') as HTMLElement | Window | undefined,
      });

      if (canvasContainerRef.current) {
        canvasContainerRef.current.appendChild(app.view);
      }

      const backgroundTexture = await Assets.load('/earth.png');
      const background = new Sprite(backgroundTexture);
      background.width = app.screen.width;
      background.height = app.screen.height;

      background.alpha = 0.3;

      app.stage.addChild(background);

      const createRacket = (
        x: number,
        y: number,
        width: number,
        height: number,
        color: number,
        glowColor: number
      ) => {
        const racket = new Graphics();

        racket.beginFill(color);
        racket.drawRoundedRect(0, 0, width, height, 10);
        racket.endFill();

        racket.position.set(x, y);

        const glowFilter = new GlowFilter({
          distance: 15,
          outerStrength: 3,
          innerStrength: 3,
          color: glowColor,
          quality: 1,
        });
        racket.filters = [glowFilter];

        return racket;
      };

      const topRacket = createRacket(
        app.screen.width / 2 - 75,
        20,
        170,
        25,
        0xff0000,
        0x000000
      );
      app.stage.addChild(topRacket);

      const bottomRacket = createRacket(
        app.screen.width / 2 - 75,
        app.screen.height - 55,
        170,
        25,
        0x00ffff,
        0x000000
      );
      app.stage.addChild(bottomRacket);

      return () => {
        app.destroy(true, true);
      };
    };

    initPixi();

    return () => {
      if (canvasContainerRef.current) {
        canvasContainerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="w-full h-screen bg-linear-gradient p-8 dark:bg-linear-gradient-dark grid grid-cols-7 gap-4">
      <div className="col-start-1 col-end-4 bg-slate-400"></div>
      <div className="col-start-4 col-end-7 bg-slate-400 rounded-lg overflow-hidden border-[10px] border-black" id="table">
        <div
          ref={canvasContainerRef}
          style={{ width: 'full', height: 'full', overflow: 'hidden' }}
        />
      </div>
      <div className="col-start-7 col-end-8 bg-slate-400"></div>
    </div>
  );
};

export default GameArena;
