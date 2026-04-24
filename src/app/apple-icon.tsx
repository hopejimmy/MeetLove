import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          background: '#F27A5A',
          border: '7px solid #2A1F1A',
        }}
      >
        <div
          style={{
            width: 128,
            height: 128,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: '#FFF8EC',
            border: '5px solid #2A1F1A',
          }}
        >
          <span
            style={{
              fontStyle: 'italic',
              fontWeight: 700,
              fontSize: 76,
              color: '#C7482A',
              lineHeight: 1,
              marginTop: 10,
            }}
          >
            R
          </span>
        </div>
      </div>
    ),
    { width: 180, height: 180 }
  )
}
