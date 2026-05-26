import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type ScrollFloatProps = {
  children: string;
};

export default function ScrollFloat({ children }: ScrollFloatProps) {
  const scopeRef = useRef<HTMLDivElement | null>(null);

  const lines = useMemo(() => children.split('\n'), [children]);

  useEffect(() => {
    const scope = scopeRef.current;

    if (!scope) {
      return;
    }

    const chars = scope.querySelectorAll('.char');

    const tween = gsap.fromTo(
      chars,
      {
        opacity: 1,
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        transformOrigin: '50% 0%',
      },
      {
        opacity: 0,
        yPercent: 250,
        scaleY: 1.2,
        scaleX: 0.9,
        ease: 'power2.inOut',
        duration: 1,
        stagger: 0.05,
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: '+=1000',
          scrub: 0.5,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [children]);

  return (
    <div ref={scopeRef} className="fixed inset-0 z-10 flex flex-col justify-end p-4 pointer-events-none md:p-8" style={{ willChange: 'transform, opacity' }}>
      <div className="w-full max-w-[1600px] mx-auto" style={{ willChange: 'transform, opacity' }}>
        {lines.map((line, lineIndex) => (
          <span key={`${line}-${lineIndex}`} style={{ display: 'block' }} className="font-dirtyline text-white leading-[0.85] tracking-[0em] text-[clamp(3rem,12vw,250px)]">
            {line.split(' ').map((word, wordIndex) => (
              <span key={`${word}-${wordIndex}`} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                {Array.from(word).map((char, charIndex) => (
                  <span key={`${char}-${charIndex}`} className="char inline-block">
                    {char}
                  </span>
                ))}
                {wordIndex < line.split(' ').length - 1 ? '\u00a0' : null}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
