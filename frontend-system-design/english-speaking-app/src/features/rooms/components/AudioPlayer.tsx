'use client';

import { useEffect, useRef } from 'react';

interface AudioPlayerProps {
  stream: MediaStream;
  participantId: string;
}

export function AudioPlayer({ stream, participantId }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current && stream) {
      audioRef.current.srcObject = stream;
      audioRef.current.play().catch(console.error);
    }
  }, [stream]);

  return (
    <audio
      ref={audioRef}
      autoPlay
      playsInline
      data-participant={participantId}
      style={{ display: 'none' }}
    />
  );
}
