import { ImageResponse } from 'next/og';

export const size = {
  width: 64,
  height: 64,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 30% 25%, #00f0ff 0%, #090d1c 55%, #ff2a85 135%)',
          borderRadius: '16px',
          border: '2px solid rgba(0, 240, 255, 0.65)',
          color: '#f8fafc',
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: '-0.05em',
          fontFamily: 'sans-serif',
        }}
      >
        ST
      </div>
    ),
    { ...size }
  );
}