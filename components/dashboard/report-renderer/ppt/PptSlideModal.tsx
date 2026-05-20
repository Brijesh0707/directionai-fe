import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { PptSlide } from './types';

export default function PptSlideModal({
  slide,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  slide: PptSlide;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[160] bg-black/70 p-4 flex items-center justify-center" onClick={onClose}>
      <div className="w-full max-w-5xl rounded-2xl border border-border bg-card overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">Slide {index + 1} of {total}</p>
          <button onClick={onClose} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center">
            <X size={15} />
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="p-5 border-b lg:border-b-0 lg:border-r border-border min-h-[260px]">
            {slide.illustration?.imageUrl ? (
              <img src={slide.illustration.imageUrl} alt={slide.illustration.alt || slide.heading} className="w-full h-full max-h-[360px] object-cover rounded-xl" />
            ) : (
              <div className="w-full h-full min-h-[220px] rounded-xl bg-background border border-border flex items-center justify-center text-sm text-muted-foreground">No visual available</div>
            )}
          </div>
          <div className="p-5">
            <h3 className="text-xl font-bold text-foreground">{slide.heading}</h3>
            {slide.subheading ? <p className="mt-2 text-sm text-muted-foreground">{slide.subheading}</p> : null}
            {slide.bullets.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {slide.bullets.map((bullet, idx) => (
                  <li key={idx} className="text-sm text-foreground">• {bullet}</li>
                ))}
              </ul>
            ) : null}
            {slide.highlightText ? <p className="mt-4 rounded-lg bg-primary/10 text-primary text-sm px-3 py-2">{slide.highlightText}</p> : null}
            {slide.speakerNotes ? (
              <div className="mt-5 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">Speaker Notes</p>
                <p className="mt-1 text-sm text-foreground/90">{slide.speakerNotes}</p>
              </div>
            ) : null}
          </div>
        </div>
        <div className="px-5 py-3 border-t border-border flex justify-center gap-2">
          <button onClick={onPrev} disabled={index === 0} className="h-9 px-3 rounded-lg border border-border disabled:opacity-40 inline-flex items-center gap-1">
            <ChevronLeft size={14} /> Prev
          </button>
          <button onClick={onNext} disabled={index === total - 1} className="h-9 px-3 rounded-lg border border-border disabled:opacity-40 inline-flex items-center gap-1">
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
