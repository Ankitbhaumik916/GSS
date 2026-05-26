import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import './PillNav.css';

gsap.registerPlugin(ScrollToPlugin);

type NavItem = {
  label: string;
  onClick: () => void;
};

const navItems: NavItem[] = [
  {
    label: 'HOME',
    onClick: () => {
      gsap.to(window, { duration: 3, scrollTo: 0, ease: 'power3.inOut' });
    },
  },
  {
    label: 'ABOUT',
    onClick: () => {
      gsap.to(window, { duration: 3, scrollTo: document.body.scrollHeight, ease: 'power3.inOut' });
    },
  },
  {
    label: 'ORDER ONLINE',
    onClick: () => {
      window.open('https://www.zomato.com/raiganj/gurus-sweets-and-snacks-raiganj-locality/order', '_blank');
    },
  },
];

export default function PillNav() {
  const [isOpen, setIsOpen] = useState(false);
  const logoRef = useRef<HTMLButtonElement | null>(null);
  const navContainerRef = useRef<HTMLDivElement | null>(null);
  const mobileToggleRef = useRef<HTMLButtonElement | null>(null);
  const logoTweenRef = useRef<gsap.core.Tween | null>(null);
  const hoverTimelines = useRef<Array<gsap.core.Timeline | null>>([]);

  const logoPath = useMemo(
    () => (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
        <path d="M12 2c2.9 2.3 4.8 4.7 5.7 7.3.9 2.5.6 4.8-.8 6.9-1.6 2.3-3.8 3.7-6.9 4-3.1-.3-5.3-1.7-6.9-4-1.4-2.1-1.7-4.4-.8-6.9C7.2 6.7 9.1 4.3 12 2Zm0 4.2c-1.8 1.7-3 3.3-3.6 4.9-.5 1.4-.4 2.7.3 3.8.8 1.3 1.9 2 3.3 2.2 1.4-.2 2.5-.9 3.3-2.2.7-1.1.8-2.4.3-3.8-.6-1.6-1.8-3.2-3.6-4.9Z" />
      </svg>
    ),
    [],
  );

  useEffect(() => {
    const logo = logoRef.current;
    const navContainer = navContainerRef.current;

    if (logo) {
      gsap.fromTo(logo, { scale: 0 }, { scale: 1, duration: 0.6, ease: 'back.out(2)' });
    }

    if (navContainer) {
      gsap.fromTo(navContainer, { width: 0, overflow: 'hidden' }, { width: 'auto', duration: 0.6, ease: 'power2.out' });
    }
  }, []);

  const handleLogoHover = () => {
    const logo = logoRef.current;

    if (!logo) {
      return;
    }

    logoTweenRef.current?.kill();
    logoTweenRef.current = gsap.to(logo.querySelector('svg'), { rotation: 360, duration: 0.3, ease: 'power2.out' });
  };

  const createHoverTimeline = (element: HTMLButtonElement, index: number) => {
    const hoverCircle = element.querySelector<HTMLElement>('.hover-circle');
    const label = element.querySelector<HTMLElement>('.pill-label');
    const labelHover = element.querySelector<HTMLElement>('.pill-label-hover');

    if (!hoverCircle || !label || !labelHover) {
      return null;
    }

    const width = element.offsetWidth;
    const height = element.offsetHeight;
    const radius = (width * width / 4 + height * height) / (2 * height);
    const delta = radius - Math.sqrt(Math.max(radius * radius - width * width / 4, 0)) + 1;
    const diameter = 2 * radius + 2;

    gsap.set(hoverCircle, {
      width: diameter,
      height: diameter,
      xPercent: -50,
      y: -delta,
      transformOrigin: `50% ${diameter - delta}px`,
    });

    const timeline = gsap.timeline({ paused: true });
    timeline.to(hoverCircle, { scale: 3, duration: 0.3, ease: 'power2.out' }, 0);
    timeline.to(label, { yPercent: -100, duration: 0.3, ease: 'power2.out' }, 0);
    timeline.fromTo(labelHover, { yPercent: 100 }, { yPercent: 0, duration: 0.3, ease: 'power2.out' }, 0);

    hoverTimelines.current[index] = timeline;
    return timeline;
  };

  return (
    <div className="pill-nav-shell">
      <div className="pill-nav-row relative">
        <button ref={logoRef} className="pill-logo-button" onMouseEnter={handleLogoHover} aria-label="Guru's Sweets & Snacks home">
          {logoPath}
        </button>

        <div ref={navContainerRef} className="pill-nav-desktop">
          <ul className="pill-nav-list">
            {navItems.map((item, index) => (
              <li key={item.label} className="pill-nav-item">
                <button
                  className="pill-nav-button"
                  onClick={item.onClick}
                  onMouseEnter={(event) => {
                    const target = event.currentTarget;
                    const timeline = hoverTimelines.current[index] ?? createHoverTimeline(target, index);
                    timeline?.play();
                  }}
                  onMouseLeave={() => {
                    hoverTimelines.current[index]?.reverse();
                  }}
                >
                  <span className="hover-circle" />
                  <span className="label-stack">
                    <span className="pill-label">{item.label}</span>
                    <span className="pill-label-hover">{item.label}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          ref={mobileToggleRef}
          className={`mobile-nav-toggle ${isOpen ? 'is-open' : ''}`}
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className="mobile-nav-line" />
          <span className="mobile-nav-line" />
        </button>

        <div className={`mobile-popover ${isOpen ? 'is-open' : ''}`}>
          <ul className="mobile-popover-list">
            {navItems.map((item) => (
              <li key={item.label}>
                <button
                  className="mobile-popover-button"
                  onClick={() => {
                    item.onClick();
                    setIsOpen(false);
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
