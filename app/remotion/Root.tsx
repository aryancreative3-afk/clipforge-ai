'use client'
import { Composition } from 'remotion'
import { ShortVideo, ShortVideoSchema } from './ShortVideo'

export const RemotionRoot = () => {
  return (
    <Composition
      id="ShortVideo"
      component={ShortVideo}
      durationInFrames={1740} // 58 seconds at 30fps
      fps={30}
      width={1080}
      height={1920}
      schema={ShortVideoSchema}
      defaultProps={{
        scenes: [],
        audioUrl: '',
        captionStyle: 'word-by-word',
        captionColor: '#ffffff',
        captionSize: 'large',
        brandColor: '#00c8ff',
        brandFont: 'Inter',
        title: '',
      }}
    />
  )
}