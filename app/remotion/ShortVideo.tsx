import { AbsoluteFill, Audio, Sequence, useVideoConfig, interpolate, useCurrentFrame } from 'remotion'
import { z } from 'zod'
import { Scene } from './Scene'

export const ShortVideoSchema = z.object({
  scenes: z.array(z.object({
    id: z.number(),
    text: z.string(),
    mediaUrl: z.string(),
    mediaType: z.enum(['video', 'image']).default('video'),
    type: z.enum(['hook', 'story', 'cta']),
    durationSeconds: z.number().default(10),
    searchQuery: z.string().default(''),
  })),
  audioUrl: z.string().default(''),
  captionStyle: z.enum(['word-by-word', 'full-line', 'none']).default('word-by-word'),
  captionColor: z.string().default('#ffffff'),
  captionSize: z.enum(['small', 'medium', 'large']).default('large'),
  brandColor: z.string().default('#00c8ff'),
  brandFont: z.string().default('Inter'),
  title: z.string().default(''),
})

type ShortVideoProps = z.infer<typeof ShortVideoSchema>

export const ShortVideo: React.FC<ShortVideoProps> = ({
  scenes,
  audioUrl,
  captionStyle,
  captionColor,
  captionSize,
  brandColor,
  brandFont,
  title,
}) => {
  const { fps } = useVideoConfig()
  const frame = useCurrentFrame()

  // Calculate scene start frames
  let currentFrame = 0
  const scenesWithFrames = scenes.map(scene => {
    const startFrame = currentFrame
    const durationFrames = Math.round(scene.durationSeconds * fps)
    currentFrame += durationFrames
    return { ...scene, startFrame, durationFrames }
  })

  // Outro fade
  const totalFrames = currentFrame
  const outroOpacity = interpolate(frame, [totalFrames - fps, totalFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Scenes */}
      {scenesWithFrames.map((scene) => (
        <Sequence
          key={scene.id}
          from={scene.startFrame}
          durationInFrames={scene.durationFrames}
        >
          <Scene
            mediaUrl={scene.mediaUrl}
            mediaType={scene.mediaType || 'video'}
            text={scene.text}
            type={scene.type}
            startFrame={scene.startFrame}
            durationFrames={scene.durationFrames}
            captionColor={captionColor}
            captionSize={captionSize}
            captionStyle={captionStyle}
            brandColor={brandColor}
            brandFont={brandFont}
          />
        </Sequence>
      ))}

      {/* AI Voice Audio */}
      {audioUrl && (
        <Audio src={audioUrl} />
      )}

      {/* Title overlay at start */}
      {title && (
        <Sequence from={0} durationInFrames={fps * 3}>
          <AbsoluteFill style={{
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgba(0,0,0,0.5)',
          }}>
            <div style={{
              fontSize: 64,
              fontWeight: 900,
              color: brandColor,
              textAlign: 'center',
              padding: '0 60px',
              fontFamily: brandFont + ', Impact, sans-serif',
              textShadow: '0 0 40px ' + brandColor + '80',
            }}>
              {title}
            </div>
          </AbsoluteFill>
        </Sequence>
      )}

      {/* Watermark */}
      <AbsoluteFill style={{ padding: '40px', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
        <div style={{
          fontSize: 28,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.4)',
          fontFamily: 'Inter, sans-serif',
          opacity: outroOpacity,
        }}>
          Made with ClipForge ⚡
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}