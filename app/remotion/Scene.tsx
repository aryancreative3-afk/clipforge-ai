import { AbsoluteFill, Video, Img, interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion'

interface SceneProps {
  mediaUrl: string
  mediaType: 'video' | 'image'
  text: string
  type: 'hook' | 'story' | 'cta'
  startFrame: number
  durationFrames: number
  captionColor: string
  captionSize: 'small' | 'medium' | 'large'
  captionStyle: 'word-by-word' | 'full-line' | 'none'
  brandColor: string
  brandFont: string
}

export const Scene: React.FC<SceneProps> = ({
  mediaUrl,
  mediaType,
  text,
  type,
  startFrame,
  durationFrames,
  captionColor,
  captionSize,
  captionStyle,
  brandColor,
  brandFont,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const localFrame = frame - startFrame

  // Ken Burns zoom effect
  const zoom = interpolate(localFrame, [0, durationFrames], [1, 1.08], {
    extrapolateRight: 'clamp',
  })

  // Fade in/out
  const opacity = interpolate(
    localFrame,
    [0, fps * 0.3, durationFrames - fps * 0.3, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  // Caption animation
  const words = text.split(' ')
  const wordsPerSecond = 2.5
  const framesPerWord = fps / wordsPerSecond

  const fontSize = captionSize === 'large' ? 72 : captionSize === 'medium' ? 56 : 44

  const getVisibleText = () => {
    if (captionStyle === 'none') return ''
    if (captionStyle === 'full-line') return text
    const wordIndex = Math.floor(localFrame / framesPerWord)
    return words.slice(0, Math.min(wordIndex + 1, words.length)).join(' ')
  }

  const visibleText = getVisibleText()

  // Caption pop-in spring
  const captionScale = spring({
    frame: localFrame % framesPerWord,
    fps,
    config: { damping: 12, stiffness: 200 },
  })

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Media background */}
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}>
        {mediaType === 'video' ? (
          <Video
            src={mediaUrl}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            startFrom={0}
            muted={true}
          />
        ) : (
          <Img
            src={mediaUrl}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </AbsoluteFill>

      {/* Dark gradient overlay */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0.9) 100%)',
        }}
      />

      {/* Scene type badge */}
      <AbsoluteFill style={{ padding: '60px 40px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: type === 'hook' ? brandColor + '33' : type === 'cta' ? '#ff6b3533' : '#7b2fff33',
          border: '2px solid ' + (type === 'hook' ? brandColor : type === 'cta' ? '#ff6b35' : '#7b2fff'),
          borderRadius: '100px',
          padding: '8px 24px',
          fontSize: '28px',
          fontWeight: 900,
          color: type === 'hook' ? brandColor : type === 'cta' ? '#ff6b35' : '#7b2fff',
          fontFamily: brandFont,
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}>
          {type === 'hook' ? '🎬 HOOK' : type === 'cta' ? '🎯 CTA' : '📖 STORY'}
        </div>
      </AbsoluteFill>

      {/* Caption */}
      {captionStyle !== 'none' && visibleText && (
        <AbsoluteFill
          style={{
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '0 60px 160px',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              transform: captionStyle === 'word-by-word' ? `scale(${captionScale})` : 'scale(1)',
              transformOrigin: 'center bottom',
            }}
          >
            {visibleText.split(' ').map((word, i) => (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  fontSize,
                  fontWeight: 900,
                  fontFamily: brandFont + ', Impact, Arial Black, sans-serif',
                  color: captionColor,
                  textShadow: '3px 3px 0px rgba(0,0,0,0.9), -1px -1px 0 rgba(0,0,0,0.9)',
                  margin: '0 8px',
                  lineHeight: 1.2,
                }}
              >
                {word}
              </span>
            ))}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  )
}