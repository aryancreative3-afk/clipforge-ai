import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 120

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { scenes, audioUrl, captionStyle, captionColor, captionSize, brandColor, brandFont, title } = body

    const awsAccessKey = process.env.AWS_ACCESS_KEY_ID
    const awsSecretKey = process.env.AWS_SECRET_ACCESS_KEY
    const awsRegion = process.env.AWS_REGION || 'us-east-1'
    const remotionFunctionName = process.env.REMOTION_FUNCTION_NAME
    const remotionBucket = process.env.REMOTION_BUCKET_NAME
    const remotionServeUrl = process.env.REMOTION_SERVE_URL

    // Check if Lambda is configured
    if (!awsAccessKey || !awsSecretKey || !remotionFunctionName || !remotionBucket || !remotionServeUrl) {
      // Return setup instructions
      return NextResponse.json({
        error: 'Remotion Lambda not configured',
        setupRequired: true,
        missingVars: [
          !awsAccessKey && 'AWS_ACCESS_KEY_ID',
          !awsSecretKey && 'AWS_SECRET_ACCESS_KEY',
          !remotionFunctionName && 'REMOTION_FUNCTION_NAME',
          !remotionBucket && 'REMOTION_BUCKET_NAME',
          !remotionServeUrl && 'REMOTION_SERVE_URL',
        ].filter(Boolean),
        instructions: 'See /setup-remotion page for step-by-step setup',
      }, { status: 503 })
    }

    // Dynamic import of @remotion/lambda to avoid build issues
    const { renderMediaOnLambda, getRenderProgress } = await import('@remotion/lambda/client')

    // Calculate total duration
    const totalSeconds = scenes.reduce((sum: number, s: any) => sum + (s.durationSeconds || 10), 0)
    const durationInFrames = Math.round(totalSeconds * 30)

    // Trigger Lambda render
    const { renderId, bucketName } = await renderMediaOnLambda({
      region: awsRegion as any,
      functionName: remotionFunctionName,
      serveUrl: remotionServeUrl,
      composition: 'ShortVideo',
      inputProps: {
        scenes: scenes.map((s: any) => ({
          ...s,
          mediaType: s.mediaType || 'video',
          durationSeconds: s.durationSeconds || 10,
        })),
        audioUrl: audioUrl || '',
        captionStyle: captionStyle || 'word-by-word',
        captionColor: captionColor || '#ffffff',
        captionSize: captionSize || 'large',
        brandColor: brandColor || '#00c8ff',
        brandFont: brandFont || 'Inter',
        title: title || '',
      },
      codec: 'h264',
      imageFormat: 'jpeg',
      maxRetries: 1,
      privacy: 'public',
      outName: `clipforge-${Date.now()}.mp4`,
      timeoutInMilliseconds: 90000,
      chromiumOptions: {},
      scale: 1,
      everyNthFrame: 1,
      numberOfGifLoops: 0,
      audioBitrate: '320k',
      muted: false,
      frameRange: [0, durationInFrames - 1],
    })

    return NextResponse.json({
      success: true,
      renderId,
      bucketName,
      region: awsRegion,
      message: 'Render started on Lambda',
    })

  } catch (err: any) {
    console.error('Render error:', err)
    return NextResponse.json({ 
      error: err.message || 'Render failed',
      details: err.toString(),
    }, { status: 500 })
  }
}

// Poll render progress
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const renderId = searchParams.get('renderId')
  const bucketName = searchParams.get('bucketName')
  const region = searchParams.get('region') || 'us-east-1'

  if (!renderId || !bucketName) {
    return NextResponse.json({ error: 'Missing renderId or bucketName' }, { status: 400 })
  }

  try {
    const { getRenderProgress } = await import('@remotion/lambda/client')
    
    const progress = await getRenderProgress({
      renderId,
      bucketName,
      functionName: process.env.REMOTION_FUNCTION_NAME!,
      region: region as any,
    })

    return NextResponse.json({
      done: progress.done,
      overallProgress: progress.overallProgress,
      outputFile: progress.outputFile,
      errors: progress.errors,
      fatalErrorEncountered: progress.fatalErrorEncountered,
      renderMetadata: progress.renderMetadata,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}