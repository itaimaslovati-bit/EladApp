/** Unified item for display in grid/lightbox: cloud image or local video */
export type DisplayMediaItem =
  | { type: 'image'; id: string; thumbnail: string; fullUrl: string; timestamp: number; uploadedBy?: string; source: 'cloud' }
  | { type: 'video'; id: string; thumbnail: string; fullUrl: string; timestamp: number; source: 'local' };
