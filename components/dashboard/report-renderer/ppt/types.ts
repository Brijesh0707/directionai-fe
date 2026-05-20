import { asArray, asRecord, pretty } from '../utils';

export type PptTheme = {
  backgroundColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  accentColor?: string;
};

export type PptSlide = {
  id: number;
  type: string;
  title: string;
  goal: string;
  heading: string;
  subheading?: string;
  bullets: string[];
  highlightText?: string;
  speakerNotes?: string;
  layoutType?: string;
  visual: string;
  illustration?: {
    imageUrl?: string;
    alt?: string;
  };
  structuredData?: {
    chartData?: {
      type?: string;
      title?: string;
      categories?: string[];
      values?: number[];
    };
    timelineData?: { steps?: string[] };
    processData?: { steps?: string[] };
  };
};

export type PptPayload = {
  version?: string;
  title?: string;
  theme?: PptTheme;
  summary?: {
    totalSlides?: number;
    objective?: string;
    audience?: string;
    keyPoints?: string[];
    slideTypes?: Record<string, number>;
  };
  slides?: PptSlide[];
};

export function parsePptPayload(payload: unknown): PptPayload | null {
  const root = asRecord(payload);
  if (!root) return null;

  const slides = asArray(root.slides).map((item) => {
    const row = asRecord(item);
    return {
      id: Number(row?.id ?? 0),
      type: pretty(row?.type || 'content') || 'content',
      title: pretty(row?.title),
      goal: pretty(row?.goal),
      heading: pretty(row?.heading || row?.title),
      subheading: pretty(row?.subheading) || undefined,
      bullets: asArray(row?.bullets).map((b) => pretty(b)).filter(Boolean),
      highlightText: pretty(row?.highlightText) || undefined,
      speakerNotes: pretty(row?.speakerNotes) || undefined,
      layoutType: pretty(row?.layoutType) || undefined,
      visual: pretty(row?.visual),
      illustration: asRecord(row?.illustration)
        ? {
            imageUrl: pretty(asRecord(row?.illustration)?.imageUrl),
            alt: pretty(asRecord(row?.illustration)?.alt),
          }
        : undefined,
      structuredData: asRecord(row?.structuredData)
        ? {
            chartData: asRecord(asRecord(row?.structuredData)?.chartData)
              ? {
                  type: pretty(asRecord(asRecord(row?.structuredData)?.chartData)?.type),
                  title: pretty(asRecord(asRecord(row?.structuredData)?.chartData)?.title),
                  categories: asArray(asRecord(asRecord(row?.structuredData)?.chartData)?.categories).map((c) => pretty(c)).filter(Boolean),
                  values: asArray(asRecord(asRecord(row?.structuredData)?.chartData)?.values)
                    .map((v) => Number(v))
                    .filter((v) => Number.isFinite(v)),
                }
              : undefined,
            timelineData: asRecord(asRecord(row?.structuredData)?.timelineData)
              ? {
                  steps: asArray(asRecord(asRecord(row?.structuredData)?.timelineData)?.steps).map((s) => pretty(s)).filter(Boolean),
                }
              : undefined,
            processData: asRecord(asRecord(row?.structuredData)?.processData)
              ? {
                  steps: asArray(asRecord(asRecord(row?.structuredData)?.processData)?.steps).map((s) => pretty(s)).filter(Boolean),
                }
              : undefined,
          }
        : undefined,
    } as PptSlide;
  });

  return {
    version: pretty(root.version) || undefined,
    title: pretty(root.title) || 'Presentation',
    theme: asRecord(root.theme) as PptTheme,
    summary: asRecord(root.summary)
      ? {
          totalSlides: Number(asRecord(root.summary)?.totalSlides ?? slides.length),
          objective: pretty(asRecord(root.summary)?.objective) || undefined,
          audience: pretty(asRecord(root.summary)?.audience) || undefined,
          keyPoints: asArray(asRecord(root.summary)?.keyPoints).map((k) => pretty(k)).filter(Boolean),
          slideTypes: (asRecord(root.summary)?.slideTypes as Record<string, number>) || undefined,
        }
      : undefined,
    slides,
  };
}
