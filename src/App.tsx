import { useRef } from 'react';
import GlassPanel from './components/GlassPanel';
import MenuGallery from './components/MenuGallery';
import PillNav from './components/PillNav';
import ScrollFloat from './components/ScrollFloat';
import ScrollVideo from './components/ScrollVideo';

export default function App() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <ScrollVideo src="https://stream.mux.com/43NlHXsaMrmyzWamMk87m01fNyxSTekAD669BBAPBNm00.m3u8" />
      <PillNav />
      <div ref={containerRef} style={{ position: 'relative', height: '800vh' }}>
        <ScrollFloat>{`Guru Sweets\n& Snacks`}</ScrollFloat>
        <GlassPanel containerRef={containerRef} />
        <div aria-hidden className="h-[110vh]" />
        <MenuGallery />
      </div>
    </>
  );
}
