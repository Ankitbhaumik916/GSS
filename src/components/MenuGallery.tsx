import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    image: '/1.png',
    title: 'South Meets North',
    description: 'Authentic Dosa & Dahi Bhalle.',
  },
  {
    image: '/2.png',
    title: 'Desi Comfort',
    description: 'Hearty Chole Bhature & Veg Pulao.',
  },
  {
    image: '/3.png',
    title: 'Street Style Chaat',
    description: 'Tangy, spicy, and 100% pure veg.',
  },
  {
    image: '/4.png',
    title: 'Cheese Ball Perfection',
    description: 'Crispy bites for the modern palate.',
  },
  {
    image: '/5.png',
    title: 'Momo Magic',
    description: 'Steamed to perfection with juicy veg goodness.',
  },
];

export default function MenuGallery() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;

    if (!section || !track) {
      return;
    }

    const tween = gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${Math.max(track.scrollWidth - window.innerWidth, 0)}`,
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative z-20 h-screen w-full overflow-hidden px-4 md:px-8">
      <div className="flex h-full items-center">
        <div ref={trackRef} className="flex gap-5 will-change-transform">
          {cards.map((card) => (
            <article
              key={card.title}
              className="group flex w-[70vw] max-w-[480px] shrink-0 flex-col overflow-hidden rounded-2xl bg-neutral-900 border border-white/10 md:w-[42vw] lg:w-[30vw]"
              style={{ willChange: 'transform, opacity' }}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
              </div>
              <div className="space-y-2 p-5 md:p-6">
                <h3 className="font-serif text-xl md:text-2xl text-white">{card.title}</h3>
                <p className="max-w-xl text-sm md:text-base text-white/70 font-sans">{card.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}