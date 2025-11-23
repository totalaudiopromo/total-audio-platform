/**
 * CIS Video Types - Trailer assembly and export
 */

export type ClipType = 'text' | 'image' | 'color' | 'gradient';

export interface TimelineClip {
  id: string;
  type: ClipType;
  startTime: number; // seconds
  duration: number; // seconds
  content: TextClipContent | ImageClipContent | ColorClipContent | GradientClipContent;
  transitions?: {
    in?: 'fade' | 'cut';
    out?: 'fade' | 'cut';
  };
}

export interface TextClipContent {
  text: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
  position?: 'top' | 'center' | 'bottom';
  alignment?: 'left' | 'center' | 'right';
}

export interface ImageClipContent {
  url: string;
  fit?: 'cover' | 'contain' | 'fill';
  kenBurns?: {
    from: { scale: number; x: number; y: number };
    to: { scale: number; x: number; y: number };
  };
}

export interface ColorClipContent {
  color: string;
}

export interface GradientClipContent {
  colors: string[];
  direction?: 'horizontal' | 'vertical' | 'diagonal';
}

export interface CISTrailerTimeline {
  id: string;
  projectId: string;
  title: string;
  duration: number; // total duration in seconds
  format: '10s' | '15s' | '30s' | '60s';
  clips: TimelineClip[];
  musicCues?: Array<{
    time: number;
    description: string;
  }>;
  metadata?: Record<string, any>;
}

export interface RenderSpec {
  timeline: CISTrailerTimeline;
  output: {
    width: number;
    height: number;
    fps: number;
    format: 'mp4' | 'webm' | 'gif';
    quality: 'low' | 'medium' | 'high';
  };
}
