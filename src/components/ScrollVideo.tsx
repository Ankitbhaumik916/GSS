import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Hls from 'hls.js';

gsap.registerPlugin(ScrollTrigger);

type ScrollVideoProps = {
  src: string;
  className?: string;
};

export default function ScrollVideo({ src, className = '' }: ScrollVideoProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const video = videoRef.current;

    if (!wrapper || !video) {
      return;
    }

    let hls: Hls | null = null;
    let currentTarget = 0;
    let seekPending = false;
    let canSeek = false;
    let scrubTrigger: ScrollTrigger | null = null;

    const doSeek = () => {
      if (!video.duration || Number.isNaN(video.duration)) {
        return;
      }

      const nextTime = Math.min(Math.max(currentTarget, 0), video.duration || 0);

      if (Math.abs(video.currentTime - nextTime) < 0.12) {
        seekPending = false;
        return;
      }

      try {
        video.currentTime = nextTime;
      } catch {
        seekPending = true;
      }
    };

    const onSeeked = () => {
      if (seekPending) {
        seekPending = false;
        doSeek();
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      const bounds = wrapper.getBoundingClientRect();
      const moveX = (event.clientX - (bounds.left + bounds.width / 2)) / (bounds.width / 2);
      const moveY = (event.clientY - (bounds.top + bounds.height / 2)) / (bounds.height / 2);

      gsap.to(wrapper, {
        x: moveX * -30,
        y: moveY * -30,
        duration: 1.5,
        ease: 'power2.out',
      });
    };

    const onCanPlay = () => {
      setIsReady(true);
    };

    const onFragBuffered = () => {
      if (!video.duration || !Number.isFinite(video.duration)) {
        return;
      }

      const bufferedEnd = video.buffered.length ? video.buffered.end(video.buffered.length - 1) : 0;
      setProgress(Math.min(100, (bufferedEnd / video.duration) * 100));
    };

    wrapper.addEventListener('mousemove', onMouseMove);
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('canplay', onCanPlay, { once: true });

    if (Hls.isSupported()) {
      hls = new Hls({
        maxBufferLength: 120,
        maxMaxBufferLength: 600,
        maxBufferSize: 200 * 1024 * 1024,
        startPosition: 0,
        capLevelToPlayerSize: false,
        startLevel: -1,
        autoStartLoad: true,
      });

      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const maxLevel = hls?.levels.length ? hls.levels.length - 1 : -1;
        if (hls && maxLevel >= 0) {
          hls.currentLevel = maxLevel;
          hls.startLevel = maxLevel;
        }
      });
      hls.on(Hls.Events.FRAG_BUFFERED, onFragBuffered);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    }

    const activateScrub = () => {
      if (scrubTrigger) {
        return;
      }

      scrubTrigger = ScrollTrigger.create({
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate(self) {
          if (!video.duration || Number.isNaN(video.duration)) {
            return;
          }

          currentTarget = self.progress * video.duration;

          if (video.seeking) {
            seekPending = true;
            return;
          }

          if (!canSeek) {
            canSeek = true;
          }

          doSeek();
        },
      });
    };

    const onLoadedMetadata = () => {
      activateScrub();
      doSeek();
    };

    video.addEventListener('loadedmetadata', onLoadedMetadata, { once: true });

    return () => {
      wrapper.removeEventListener('mousemove', onMouseMove);
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      scrubTrigger?.kill();
      hls?.destroy();
    };
  }, [src]);

  return (
    <>
      {!isReady && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-2xl font-sans text-white">
          Loading... {Math.round(progress)}%
        </div>
      )}
      <div ref={wrapperRef} className={`fixed top-0 left-0 w-full h-full z-0 scale-[1.05] origin-center ${className}`}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover scale-[1.35]"
          muted
          playsInline
          crossOrigin="anonymous"
          preload="auto"
          style={{ willChange: 'transform, opacity' }}
        />
      </div>
    </>
  );
}
