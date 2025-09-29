"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { FiPause, FiPlay } from "react-icons/fi";
import { RiResetRightFill } from "react-icons/ri";

type GameOverlayProps = {
  containerRef?: React.RefObject<HTMLElement | null>;
  duration?: number;
  imageSrc?: string | string[]; // a single image path or array of image paths
};

export default function GameOverlay({
  containerRef,
  duration = 30,
  imageSrc,
}: GameOverlayProps) {
  // constants
  const MIN_SIZE = 48;
  const MAX_SIZE = 80;
  const FADE_MS = 300;
  const AUTO_LIFE_MS = 1250;
  const DESTROY_MS = 500; // fire stays before removal

  // default inline SVG
  const defaultSvg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
       <rect width="100" height="100" fill="transparent"/>
       <circle cx='50' cy='50' r='50' fill='#ff5f6d'/>
       <circle cx='50' cy='50' r='30' fill='#ffffff'/>
       <circle cx='50' cy='50' r='15' fill='#ff5f6d'/>
     </svg>`
  );
  const defaultDataUrl = `data:image/svg+xml;utf8,${defaultSvg}`;

  // state
  const [score, setScore] = useState(0);
  const [hiscore, setHiscore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [running, setRunning] = useState(false);
  const [target, setTarget] = useState<{
    x: number;
    y: number;
    size: number;
    img: string;
  } | null>(null);
  const [visible, setVisible] = useState(false);
  const [destroyedTargets, setDestroyedTargets] = useState<
    { id: number; x: number; y: number; size: number }[]
  >([]);

  // refs
  const spawnTimeoutRef = useRef<number | null>(null);
  const fadeTimeoutRef = useRef<number | null>(null);
  const removeTimeoutRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const explosionIdRef = useRef(0);

  const scoreRef = useRef(score);
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // 🔑 running ref to avoid stale closure
  const runningRef = useRef(running);
  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  // load hiscore on mount
  useEffect(() => {
    const saved = localStorage.getItem("hiscore");
    if (saved) setHiscore(parseInt(saved, 10));
  }, []);

  useEffect(() => {
    return () => {
      clearAll();
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, []);

  const clearAll = useCallback(() => {
    if (spawnTimeoutRef.current) {
      clearTimeout(spawnTimeoutRef.current);
      spawnTimeoutRef.current = null;
    }
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }
    if (removeTimeoutRef.current) {
      clearTimeout(removeTimeoutRef.current);
      removeTimeoutRef.current = null;
    }
  }, []);

  const getBounds = useCallback(() => {
    if (containerRef?.current) {
      const r = containerRef.current.getBoundingClientRect();
      return { left: r.left, top: r.top, width: r.width, height: r.height };
    }
    return {
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }, [containerRef]);

  const chooseImage = useCallback((): string => {
    if (!imageSrc) return defaultDataUrl;
    if (Array.isArray(imageSrc)) {
      const i = Math.floor(Math.random() * imageSrc.length);
      return imageSrc[i];
    }
    return imageSrc;
  }, [imageSrc]);

  const spawnTarget = useCallback(
    (delay = 0) => {
      clearAll();
      spawnTimeoutRef.current = window.setTimeout(() => {
        const { left, top, width, height } = getBounds();
        const size =
          MIN_SIZE + Math.floor(Math.random() * (MAX_SIZE - MIN_SIZE + 1));
        const maxX = Math.max(0, width - size);
        const maxY = Math.max(0, height - size);
        const x = left + Math.random() * maxX;
        const y = top + Math.random() * maxY;
        const img = chooseImage();

        setTarget({ x, y, size, img });
        setVisible(true);

        // auto miss after AUTO_LIFE_MS
        fadeTimeoutRef.current = window.setTimeout(() => {
          setVisible(false);
          setMisses((m) => m + 1);
          removeTimeoutRef.current = window.setTimeout(() => {
            setTarget(null);
            if (runningRef.current) spawnTarget(300 + Math.random() * 700);
          }, FADE_MS);
        }, AUTO_LIFE_MS);
      }, delay);
    },
    [clearAll, getBounds, chooseImage]
  );

  const handleClickTarget = useCallback(() => {
    if (!target || !visible || !runningRef.current) return;
    setHits((h) => h + 1);
    setScore((s) => s + 1);

    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }

    // 🔥 Add explosion
    explosionIdRef.current += 1;
    const id = explosionIdRef.current;
    setDestroyedTargets((prev) => [
      ...prev,
      { id, x: target.x + 5, y: target.y, size: target.size - 20 },
    ]);
    setTimeout(() => {
      setDestroyedTargets((prev) => prev.filter((e) => e.id !== id));
    }, DESTROY_MS);

    setVisible(false);
    removeTimeoutRef.current = window.setTimeout(() => {
      setTarget(null);
      if (runningRef.current) spawnTarget(300 + Math.random() * 700);
    }, FADE_MS);
  }, [target, visible, spawnTarget]);

  const startGame = useCallback(() => {
    setScore(0);
    setHits(0);
    setMisses(0);
    setTimeLeft(duration);
    setRunning(true);
    spawnTarget(200);

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
          }
          setRunning(false);
          clearAll();

          // smooth fade out
          if (target) {
            setVisible(false);
            setTimeout(() => setTarget(null), FADE_MS);
          } else {
            setTarget(null);
          }

          // ✅ update hiscore at end of game
          setHiscore((prev) => {
            const newHigh = Math.max(prev, scoreRef.current);
            if (newHigh > prev) {
              localStorage.setItem("hiscore", newHigh.toString());
            }
            return newHigh;
          });

          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [duration, spawnTarget, clearAll, target]);

  const pauseGame = useCallback(() => {
    setRunning(false);
    clearAll();
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setTarget(null);
  }, [clearAll]);

  const resetGame = useCallback(() => {
    pauseGame();
    setScore(0);
    setHits(0);
    setMisses(0);
    setTimeLeft(duration);
  }, [pauseGame, duration]);

  return (
    <>
      {/* local keyframes for float */}
      <style>{`
        @keyframes floaty {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
      `}</style>

      {/* Controls */}
      <div className="absolute bottom-6 right-6 z-60 flex items-center gap-3  font-pressstart2p text-sm opacity-30">
        {!running ? (
          <button
            onClick={startGame}
            className="px-3 py-1 rounded text-white cursor-target"
            title="Start game"
            type="button"
          >
            <FiPlay className="w-6 h-6" />
          </button>
        ) : (
          <button
            onClick={pauseGame}
            className="px-3 py-1 rounded text-white cursor-target"
            title="Pause game"
            type="button"
          >
            <FiPause className="w-6 h-6" />
          </button>
        )}
        <button
          onClick={resetGame}
          className="px-3 py-1 rounded text-white cursor-target"
          title="Reset game"
          type="button"
        >
          <RiResetRightFill className="w-6 h-6" />
        </button>
        <div className="ml-4 text-white ">Time: {timeLeft}s</div>
      </div>

      {/* Score */}
      <div className="absolute top-6 left-6 z-60 text-white font-pressstart2p text-sm opacity-30">
        HISCORE: {hiscore}{" "}
        <span className="ml-3 ">
          Hits: {hits} Misses: {misses}
        </span>
      </div>

      {/* Image target */}
      {target && (
        <Image
          src={target.img}
          alt="target"
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          onClick={handleClickTarget}
          className="cursor-target"
          width={target.size}
          height={target.size}
          style={{
            position: "absolute",
            left: target.x,
            top: target.y,
            width: target.size,
            height: target.size,
            zIndex: 55,
            opacity: visible ? 1 : 0,
            transition: `opacity ${FADE_MS}ms ease, transform 180ms ease`,
            transform: visible
              ? "scale(1) translateZ(0)"
              : "scale(0.9) translateZ(0)",
            display: "block",
            objectFit: "contain",
            cursor: "pointer",
            boxShadow: "0 6px 18px rgba(0,0,0,0.6)",
            animation: "floaty 2.2s ease-in-out infinite",
            userSelect: "none",
            pointerEvents: visible ? "auto" : "none", // Prevent clicks on invisible/fading targets
          }}
        />
      )}

      {/* 🔥 Explosions */}
      {destroyedTargets.map((ex) => (
        <div
          key={ex.id}
          className="animate-explode"
          style={{
            position: "absolute",
            left: ex.x,
            top: ex.y,
            width: ex.size,
            height: ex.size,
            zIndex: 56,
            borderRadius: "50%", // circular mask
            overflow: "hidden", // clip fire inside circle
            pointerEvents: "none",
          }}
        >
          <Image
            src="/fire.png" // put fire.png inside /public
            alt="explosion"
            width={ex.size}
            height={ex.size}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      ))}
    </>
  );
}
