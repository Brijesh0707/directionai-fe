import React from 'react';
import { Image as ImageIcon, ChartColumnIncreasing } from 'lucide-react';
import { PptSlide } from './types';

export default function PptSlideCard({
  slide,
  index,
  onClick,
}: {
  slide: PptSlide;
  index: number;
  onClick: (index: number) => void;
}) {
  return (
    <button
      onClick={() => onClick(index)}
      className="text-left rounded-2xl border border-border bg-card p-4 hover:border-primary/40 transition"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Slide {index + 1}</p>
        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{slide.type}</span>
      </div>
      <h4 className="mt-2 text-sm font-semibold text-foreground line-clamp-2">{slide.heading}</h4>
      {slide.subheading ? <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{slide.subheading}</p> : null}
      {slide.bullets.length > 0 ? (
        <ul className="mt-3 space-y-1">
          {slide.bullets.slice(0, 2).map((bullet, idx) => (
            <li key={idx} className="text-xs text-muted-foreground line-clamp-1">• {bullet}</li>
          ))}
        </ul>
      ) : null}
      <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <ImageIcon size={12} /> {slide.illustration?.imageUrl ? 'Image' : 'No image'}
        </span>
        <span className="inline-flex items-center gap-1">
          <ChartColumnIncreasing size={12} /> {slide.structuredData?.chartData ? 'Chart' : 'Content'}
        </span>
      </div>
    </button>
  );
}
