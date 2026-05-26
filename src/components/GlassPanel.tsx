import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type GlassPanelProps = {
  containerRef: React.RefObject<HTMLDivElement | null>;
};

const values = [
  '100% PURE VEGETARIAN',
  'NO ONION & NO GARLIC',
  'TRADITIONAL SWEETS',
  'PREMIUM FLAVORS',
  'ORDER LIVE ON ZOMATO',
];

export default function GlassPanel({ containerRef }: GlassPanelProps) {
  const panelWrapperRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const repeatValues = useMemo(() => Array.from({ length: 4 }, () => values).flat(), []);

  useEffect(() => {
    const container = containerRef.current;
    const wrapper = panelWrapperRef.current;
    const panel = panelRef.current;

    if (!container || !wrapper || !panel) {
      return;
    }

    const slideTrigger = ScrollTrigger.create({
      trigger: container,
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: 0.5,
      animation: gsap.fromTo(wrapper, { y: '100%' }, { y: '0%', ease: 'none' }),
    });

    const onMouseMove = (event: MouseEvent) => {
      const bounds = panel.getBoundingClientRect();
      const moveX = (event.clientX - (bounds.left + bounds.width / 2)) / (bounds.width / 2);
      const moveY = (event.clientY - (bounds.top + bounds.height / 2)) / (bounds.height / 2);

      gsap.to(panel, {
        x: moveX * 20,
        y: moveY * 20,
        rotationY: moveX * 4,
        rotationX: -moveY * 4,
        ease: 'power3.out',
        duration: 1,
      });
    };

    panel.addEventListener('mousemove', onMouseMove);

    return () => {
      panel.removeEventListener('mousemove', onMouseMove);
      slideTrigger.kill();
    };
  }, [containerRef]);

  return (
    <div ref={panelWrapperRef} className="absolute bottom-0 left-0 w-full h-screen flex items-end justify-center px-4 md:px-8">
      <div ref={panelRef} className="w-full max-w-[1250px] h-[900px] max-h-[85vh] pointer-events-auto" style={{ perspective: '1000px' }}>
        <div
          className="w-full h-full flex flex-col justify-between rounded-3xl relative overflow-hidden"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transformStyle: 'preserve-3d',
            willChange: 'transform, opacity',
          }}
        >
          <div className="flex flex-col items-center justify-center px-6 md:px-12 text-center flex-1 py-16 md:py-24" style={{ willChange: 'transform, opacity' }}>
            <p className="font-serif italic text-white/70 text-base md:text-lg mb-4 md:mb-6">Only at Guru Express</p>
            <h2 className="font-serif text-white text-3xl md:text-5xl lg:text-[76px] leading-[1.1] lg:leading-[82px] tracking-tight w-full max-w-[1050px] mx-auto">
              We craft <span className="italic">street food</span>, hearty traditional meals, and <span className="italic">savory</span> snacks completely free of onion and garlic. Experience the ultimate <span className="italic">pure veg</span> feast.
            </h2>
          </div>
          <div className="border-t border-white/10 py-6 overflow-hidden">
            <div className="flex w-max animate-marquee gap-6">
              {repeatValues.map((value, index) => (
                <span key={`${value}-${index}`} className="whitespace-nowrap uppercase font-sans font-semibold text-sm tracking-widest text-white/40 hover:text-white transition-opacity duration-300">
                  {value}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
