'use client'
import { useState, useRef, useEffect } from 'react'

interface Scene { id:number; text:string; searchQuery:string; type:'hook'|'story'|'cta'; durationSeconds:number; mediaUrl?:string; mediaType:'video'|'image'; pexelsResults?:PV[] }
interface PV { id:number; thumbnail:string; bestUrl:string; duration:number; photographer:string; type:'video'|'image' }
interface Voice { id:string; name:string; gender:string; accent:string; style:string; emoji:string; color:string; sample:string }

const VOICES:Voice[]=[
  {id:'EXAVITQu4vr4xnSDxMaL',name:'Sarah',   gender:'female',accent:'American',  style:'Conversational',emoji:'👩',   color:'#00c8ff',sample:'Hi, I am Sarah, warm and natural, perfect for storytelling shorts.'},
  {id:'TX3LPaxmHKxFdv7VOQHJ',name:'Liam',    gender:'male',  accent:'American',  style:'Conversational',emoji:'👨',   color:'#7b2fff',sample:'Hey, I am Liam, friendly and engaging, great for trending content.'},
  {id:'XB0fDUnXU5powFXDhCwa',name:'Charlotte',gender:'female',accent:'British',  style:'Elegant',       emoji:'👩‍🦱',color:'#ff6b35',sample:'Hello, I am Charlotte, elegant British accent, sophisticated.'},
  {id:'nPczCjzI2devNBz1zQrb',name:'Brian',   gender:'male',  accent:'American',  style:'Deep',          emoji:'🧔',   color:'#00ff88',sample:'I am Brian, deep powerful voice for dramatic cinematic shorts.'},
  {id:'pFZP5JQG7iQjIQuC4Bku',name:'Lily',    gender:'female',accent:'British',   style:'Warm',          emoji:'👩‍🦰',color:'#ff4488',sample:'Hi, I am Lily, warm British tone, perfect for emotional storytelling.'},
  {id:'bIHbv24MWmeRgasZH58o',name:'Will',    gender:'male',  accent:'American',  style:'Friendly',      emoji:'😊',   color:'#ffaa00',sample:'Hey, I am Will, super friendly and upbeat, ideal for motivational content.'},
  {id:'cgSgspJ2msm6clMCkdW9',name:'Jessica', gender:'female',accent:'American',  style:'Expressive',    emoji:'🎭',   color:'#aa44ff',sample:'I am Jessica, expressive and dynamic, I bring energy to every word.'},
  {id:'IKne3meq5aSn9XLyUdCD',name:'Charlie', gender:'male',  accent:'Australian',style:'Casual',        emoji:'🤙',   color:'#00ddaa',sample:'Hey mate, I am Charlie, casual Australian accent, very engaging.'},
]
const STYLES=[
  {id:'viral',label:'Viral Hook',icon:'🔥',desc:'Bold, scroll-stopping'},
  {id:'educational',label:'Educational',icon:'🎓',desc:'Clear, trust-building'},
  {id:'storytelling',label:'Storytelling',icon:'📖',desc:'Emotional, narrative'},
  {id:'motivational',label:'Motivational',icon:'⚡',desc:'Energetic, inspiring'},
  {id:'documentary',label:'Documentary',icon:'🎬',desc:'Cinematic, factual'},
  {id:'trending',label:'Trending',icon:'📈',desc:'Algorithm-optimised'},
]
const STEPS=['Topic','Style & Voice','Script','Export']
const EXAMPLES=['Why the moon turns red in a lunar eclipse','The truth about why we dream','How black holes actually work','Why Japan has almost zero crime','What happens 1 second after you die','The secret life of trees']

async function post(url:string,body:object){
  const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
  const d=await r.json().catch(()=>({}))
  if(!r.ok) throw new Error((d as any).error||r.statusText)
  return d
}

export default function Dashboard(){
  const [step,setStep]=useState(0)
  const [topic,setTopic]=useState('')
  const [dur,setDur]=useState<'30'|'45'|'60'>('60')
  const [style,setStyle]=useState('viral')
  const [voice,setVoice]=useState<Voice>(VOICES[0])
  const [prevId,setPrevId]=useState<string|null>(null)
  const [script,setScript]=useState('')
  const [scenes,setScenes]=useState<Scene[]>([])
  const [vscore,setVscore]=useState(0)
  const [gen,setGen]=useState(false)
  const [genErr,setGenErr]=useState('')
  const [tab,setTab]=useState<'script'|'scenes'|'captions'|'music'>('script')
  const [cStyle,setCStyle]=useState<'word-by-word'|'full-line'|'none'>('word-by-word')
  const [cColor,setCColor]=useState('#ffffff')
  const [cSize,setCSize]=useState<'small'|'medium'|'large'>('large')
  const [bColor,setBColor]=useState('#00c8ff')
  const [showB,setShowB]=useState(false)
  const [magic,setMagic]=useState(false)
  const [mText,setMText]=useState('')
  const [mLoad,setMLoad]=useState(false)
  const [stab,setStab]=useState(0.5)
  const [sim,setSim]=useState(0.75)
  const [spd,setSpd]=useState(1.0)
  const [aUrl,setAUrl]=useState<string|null>(null)
  const [aLoad,setALoad]=useState(false)
  const [aErr,setAErr]=useState('')
  const [rLoad,setRLoad]=useState(false)
  const [rPct,setRPct]=useState(0)
  const [rStat,setRStat]=useState('')
  const [rUrl,setRUrl]=useState<string|null>(null)
  const [rErr,setRErr]=useState('')
  const [lSetup,setLSetup]=useState(false)
  const [lVars,setLVars]=useState<string[]>([])
  const [hov,setHov]=useState<string|null>(null)
  const [musicOn,setMusicOn]=useState(true)
  const [musicVol,setMusicVol]=useState(0.18)
  const [musicGenre,setMusicGenre]=useState('auto')
  const [musicTracks,setMusicTracks]=useState<any[]>([])
  const [musicTrack,setMusicTrack]=useState<any|null>(null)
  const [musicLoad,setMusicLoad]=useState(false)
  const [musicOffset,setMusicOffset]=useState(0)
  const [musicPlaying,setMusicPlaying]=useState(false)
  const [musicSearch,setMusicSearch]=useState('')
  const musicRef=useRef<HTMLAudioElement|null>(null)
  const tRef=useRef<HTMLTextAreaElement>(null)

  useEffect(()=>{if(step===0)tRef.current?.focus()},[step])
  useEffect(()=>{if(step===2)fetchMusic(musicGenre,0)},[step])

  function startPrev(v:Voice){
    if(prevId===v.id){stopPrev();return}
    stopPrev()
    setPrevId(v.id)
    if(typeof window==='undefined')return
    if(window.speechSynthesis){
      window.speechSynthesis.cancel()
      const u=new SpeechSynthesisUtterance(v.sample)
      u.lang=v.accent==='British'?'en-GB':v.accent==='Australian'?'en-AU':'en-US'
      u.pitch=v.gender==='female'?1.1:v.style==='Deep'?0.7:0.85
      u.rate=v.style==='Deep'?0.9:1.0
      u.volume=1.0
      u.onend=()=>setPrevId(null)
      u.onerror=()=>setPrevId(null)
      window.speechSynthesis.speak(u)
    }
  }

  function stopPrev(){
    if(typeof window!=='undefined'&&window.speechSynthesis)window.speechSynthesis.cancel()
    setPrevId(null)
  }

  async function generate(){
    if(!topic.trim())return
    setGen(true);setGenErr('');setScript('');setScenes([]);setVscore(0)
    try{
      const d=await post('/api/generate-script',{idea:topic,style,duration:parseInt(dur),voice:voice.name})
      setScript(d.script||'');setVscore(d.viralScore||0)
      const raw:any[]=d.scenes||[]
      const base:Scene[]=raw.length?raw.map((s:any)=>({...s,mediaType:'video' as const,durationSeconds:s.durationSeconds||10})):[
        {id:1,text:topic,searchQuery:topic.split(' ').slice(0,3).join(' '),type:'hook' as const,mediaType:'video' as const,durationSeconds:5},
        {id:2,text:'The story begins',searchQuery:topic.split(' ').slice(0,2).join(' ')+' dramatic',type:'story' as const,mediaType:'video' as const,durationSeconds:20},
        {id:3,text:'The truth revealed',searchQuery:topic.split(' ').slice(0,2).join(' ')+' reveal',type:'story' as const,mediaType:'video' as const,durationSeconds:20},
        {id:4,text:'Follow for more',searchQuery:'subscribe social media',type:'cta' as const,mediaType:'video' as const,durationSeconds:15},
      ]
      const enriched=await Promise.all(base.map(async s=>{
        try{
          const r=await fetch('/api/pexels-video?query='+encodeURIComponent(s.searchQuery)+'&per_page=6')
          const j=await r.json();const v=j.videos||[]
          return{...s,mediaUrl:v[0]?.bestUrl||v[0]?.thumbnail||'',pexelsResults:v}
        }catch{return s}
      }))
      setScenes(enriched);setStep(2)
    }catch(e:any){setGenErr(e.message||'Generation failed — check ANTHROPIC_API_KEY in Vercel.')}
    setGen(false)
  }

  function useSampleScript(){
    setScript(`HOOK: Did you know that ${topic}?\n\nSTORY: Here is what experts discovered about this fascinating topic. The research shows surprising results that most people have never heard about.\n\nThis changes everything we thought we knew.\n\nCTA: Follow for more mind-blowing facts every day!`)
    setScenes([
      {id:1,text:`Did you know that ${topic}?`,searchQuery:topic.split(' ').slice(0,3).join(' '),type:'hook' as const,mediaType:'video' as const,durationSeconds:8},
      {id:2,text:'Here is what experts discovered...',searchQuery:topic.split(' ').slice(0,2).join(' ')+' discovery',type:'story' as const,mediaType:'video' as const,durationSeconds:20},
      {id:3,text:'This changes everything we knew',searchQuery:'mind blown revelation cinematic',type:'story' as const,mediaType:'video' as const,durationSeconds:15},
      {id:4,text:'Follow for more!',searchQuery:'subscribe social media',type:'cta' as const,mediaType:'video' as const,durationSeconds:7},
    ])
    setVscore(72)
    setStep(2)
  }

  async function doMagic(){
    if(!mText.trim()||!script)return;setMLoad(true)
    try{const d=await post('/api/magic',{script,instruction:mText});if(d.rewrittenScript)setScript(d.rewrittenScript);setMText('');setMagic(false)}catch{}
    setMLoad(false)
  }

  async function fetchMusic(genre='auto',offset=0){
    setMusicLoad(true)
    try{
      const r=await fetch(`/api/background-music?genre=${genre}&style=${style}&offset=${offset}`)
      const d=await r.json()
      if(offset===0)setMusicTracks(d.tracks||[])
      else setMusicTracks(p=>[...p,...(d.tracks||[])])
      if(offset===0&&d.tracks?.[0]&&!musicTrack)setMusicTrack(d.tracks[0])
    }catch{}
    setMusicLoad(false)
  }

  async function fetchMusicBySearch(query:string){
    setMusicLoad(true)
    try{
      const r=await fetch(`/api/background-music?search=${encodeURIComponent(query)}&offset=0`)
      const d=await r.json()
      setMusicTracks(d.tracks||[])
      if(d.tracks?.[0])setMusicTrack(d.tracks[0])
    }catch{}
    setMusicLoad(false)
  }

  async function genVoice(){
    if(!script)return;setALoad(true);setAErr('')
    try{
      const clean=script.replace(/[^\x00-\x7F\s]/g,'').replace(/HOOK.*|STORY.*|CTA.*/g,'').replace(/\s+/g,' ').trim()
      const d=await post('/api/generate-voice',{text:clean,voiceId:voice.id,settings:{stability:stab,similarityBoost:sim,speed:spd}})
      setAUrl(d.audioUrl)
    }catch(e:any){setAErr(e.message||'Voice failed — check ELEVENLABS_API_KEY.')}
    setALoad(false)
  }

  async function render(){
    setRLoad(true);setRErr('');setRUrl(null);setRPct(5);setRStat('Starting...');setLSetup(false)
    try{
      const r=await fetch('/api/render',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
        scenes:scenes.map(s=>({id:s.id,text:s.text,mediaUrl:s.mediaUrl||'',mediaType:s.mediaType,type:s.type,durationSeconds:s.durationSeconds})),
        audioUrl:aUrl||'',captionStyle:cStyle,captionColor:cColor,captionSize:cSize,brandColor:bColor,title:topic,
        musicUrl:musicOn&&musicTrack?musicTrack.audio:'',
        musicVolume:musicVol,
      })})
      const d=await r.json()
      if(d.setupRequired){setLSetup(true);setLVars(d.missingVars||[]);setRLoad(false);return}
      if(!r.ok)throw new Error(d.error||'Render failed')
      const{renderId,bucketName,region}=d;setRPct(10);setRStat('Queued on Lambda...')
      for(let i=0;i<120;i++){
        await new Promise(x=>setTimeout(x,2000))
        const p=await fetch(`/api/render?renderId=${renderId}&bucketName=${bucketName}&region=${region}`).then(x=>x.json())
        if(p.fatalErrorEncountered)throw new Error(p.errors?.[0]?.message||'Lambda error')
        const pct=Math.min(Math.round((p.overallProgress||0)*85)+10,98);setRPct(pct)
        setRStat(pct<35?'Compositing..':pct<65?'Encoding..':pct<90?'Adding audio..':'Finalising..')
        if(p.done&&p.outputFile){setRUrl(p.outputFile);setRPct(100);setRStat('Done!');break}
      }
    }catch(e:any){setRErr(e.message||'Render failed.')}
    setRLoad(false)
  }

  const B=(on:boolean,c='#00c8ff')=>({
    borderColor:on?c:'rgba(255,255,255,0.07)',
    background:on?c+'12':'rgba(255,255,255,0.02)',
    color:on?c:'rgba(255,255,255,0.42)',
  })
  const sc=vscore>=80?'#00ff88':vscore>=60?'#ffaa00':'#ff4444'

  return(
    <div className="min-h-screen bg-[#0d0d0f] text-white" style={{fontFamily:'"Inter",system-ui,sans-serif'}}>

      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0d0d0f]/90 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black text-black" style={{background:'linear-gradient(135deg,#00c8ff,#7b2fff)'}}>C</div>
            <span className="text-sm font-semibold text-white/55">ClipForge</span>
          </div>
          <nav className="flex items-center gap-0.5">
            {STEPS.map((s,i)=>(
              <button key={s} onClick={()=>i<=step&&setStep(i)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
                style={{color:i===step?'white':i<step?'#00c8ff':'rgba(255,255,255,0.22)',background:i===step?'rgba(255,255,255,0.08)':'transparent',cursor:i<=step?'pointer':'default'}}>
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                  style={{background:i<step?'#00c8ff':i===step?'rgba(255,255,255,0.12)':'rgba(255,255,255,0.05)',color:i<step?'black':'inherit'}}>
                  {i<step?'✓':i+1}
                </span>
                <span className="hidden sm:inline">{s}</span>
                {i<STEPS.length-1&&<span className="text-white/10 ml-0.5 hidden sm:inline">›</span>}
              </button>
            ))}
          </nav>
          <div className="w-24 shrink-0"/>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-14">

        {/* STEP 0 — TOPIC */}
        {step===0&&(
          <div className="space-y-9">
            <div>
              <h1 className="text-[2rem] font-bold tracking-tight leading-snug">What's your video about?</h1>
              <p className="text-white/32 text-sm mt-2">One sentence is enough — AI handles the rest.</p>
            </div>
            <textarea ref={tRef} value={topic} onChange={e=>setTopic(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey&&topic.trim().length>5){e.preventDefault();setStep(1)}}}
              placeholder="e.g. Why the moon turns red during a lunar eclipse"
              rows={3} className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3.5 text-base text-white placeholder-white/18 resize-none focus:outline-none focus:border-white/22 transition-colors leading-relaxed"/>
            <div>
              <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest mb-3">Video length</p>
              <div className="flex gap-2">
                {(['30','45','60'] as const).map(d=>(
                  <button key={d} onClick={()=>setDur(d)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all border" style={B(dur===d)}>{d}s</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest mb-3">Try an example</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map(t=>(
                  <button key={t} onClick={()=>{setTopic(t);setStep(1)}}
                    className="px-3 py-1.5 rounded-lg text-xs text-white/35 border border-white/[0.07] hover:border-white/15 hover:text-white/55 transition-all">{t}</button>
                ))}
              </div>
            </div>
            <button onClick={()=>setStep(1)} disabled={topic.trim().length<5}
              className="w-full py-3.5 rounded-xl font-semibold text-sm text-black transition-all disabled:opacity-20 disabled:cursor-not-allowed"
              style={{background:'linear-gradient(135deg,#00c8ff,#7b2fff)'}}>
              Continue →
            </button>
          </div>
        )}

        {/* STEP 1 — STYLE & VOICE */}
        {step===1&&(
          <div className="space-y-9">
            <div>
              <h1 className="text-[2rem] font-bold tracking-tight">Style & Voice</h1>
              <p className="text-white/32 text-sm mt-2">Pick the feel and narrator of your short.</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest mb-3">Content style</p>
              <div className="grid grid-cols-3 gap-2">
                {STYLES.map(s=>(
                  <button key={s.id} onClick={()=>setStyle(s.id)} className="p-4 rounded-xl text-left transition-all border" style={B(style===s.id)}>
                    <div className="text-2xl mb-2">{s.icon}</div>
                    <div className="text-xs font-semibold text-white/80">{s.label}</div>
                    <div className="text-[10px] text-white/28 mt-1 leading-tight">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest mb-3">AI voice — tap or click to preview</p>
              <div className="grid grid-cols-2 gap-2">
                {VOICES.map(v=>{
                  const sel=voice.id===v.id,prev=prevId===v.id
                  return(
                    <div key={v.id} onClick={()=>setVoice(v)}
                      onTouchStart={(e)=>{e.preventDefault();if(prevId===v.id){stopPrev()}else{startPrev(v)}}}
                      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150 border select-none"
                      style={{borderColor:sel?v.color:prev?v.color+'55':'rgba(255,255,255,0.07)',background:sel?v.color+'13':prev?v.color+'08':'rgba(255,255,255,0.02)',transform:prev?'translateY(-1px)':'none',boxShadow:sel?'0 0 20px '+v.color+'28':'none'}}>
                      <div className="relative shrink-0">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg" style={{background:v.color+'14',border:'1.5px solid '+v.color+'28'}}>{v.emoji}</div>
                        {prev&&(
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{background:v.color}}>
                            <div className="flex gap-px items-end" style={{height:8}}>
                              {[1,2,3,2,1].map((h,i)=><div key={i} className="w-px rounded-full bg-black animate-bounce" style={{height:h*2,animationDelay:i*80+'ms'}}/>)}
                            </div>
                          </div>
                        )}
                        {sel&&!prev&&<div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-black text-black" style={{background:v.color}}>✓</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white/85">{v.name}</p>
                        <button onClick={e=>{e.stopPropagation();if(prevId===v.id){stopPrev()}else{startPrev(v)}}} className="text-[9px] px-1.5 py-0.5 rounded-md mt-0.5 transition-all" style={{background:prevId===v.id?v.color+'30':'rgba(255,255,255,0.07)',color:prevId===v.id?v.color:'rgba(255,255,255,0.4)',border:'1px solid '+(prevId===v.id?v.color+'50':'rgba(255,255,255,0.1)')}}>{prevId===v.id?'■ stop':'▶ play'}</button>
                        <p className="text-[10px] text-white/30 mt-0.5">{v.accent} · {v.style}</p>
                      </div>
                      <div className="flex items-center gap-px shrink-0" style={{height:14}}>
                        {[3,5,7,4,6,5,7].map((h,i)=><div key={i} className="w-0.5 rounded-full transition-all duration-100" style={{height:prev?h:2,background:sel||prev?v.color:'rgba(255,255,255,0.12)'}}/>)}
                      </div>
                    </div>
                  )
                })}
              </div>
              <p className="text-[10px] text-white/18 mt-2 text-center">Tap or click to preview · Tap again to stop</p>
            </div>
            <div className="flex gap-3">
              <button onClick={()=>setStep(0)} className="px-5 py-3 rounded-xl text-sm text-white/32 border border-white/[0.07] hover:text-white/52 transition-all">← Back</button>
              <button onClick={generate} disabled={gen}
                className="flex-1 py-3 rounded-xl font-semibold text-sm text-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                style={{background:'linear-gradient(135deg,#00c8ff,#7b2fff)'}}>
                {gen?(<><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Generating…</>):'Generate Script →'}
              </button>
            </div>
            <button onClick={useSampleScript} disabled={topic.trim().length<3}
              className="w-full py-2 rounded-xl text-xs text-white/25 border border-white/[0.06] hover:text-white/45 hover:border-white/12 transition-all disabled:opacity-20">
              ⚡ Skip — use sample script (no credits needed)
            </button>
            {genErr&&<p className="text-xs text-red-400 text-center">{genErr}</p>}
          </div>
        )}

        {/* STEP 2 — SCRIPT */}
        {step===2&&(
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-[2rem] font-bold tracking-tight">Your Script</h1>
                <p className="text-white/32 text-sm mt-1">Edit freely, then export.</p>
              </div>
              {vscore>0&&(
                <div className="text-right shrink-0 ml-4">
                  <div className="text-[2.2rem] font-black leading-none" style={{color:sc}}>{vscore}</div>
                  <div className="text-[9px] text-white/25 mt-0.5 uppercase tracking-wider">Viral Score</div>
                </div>
              )}
            </div>
            <div className="flex gap-0.5 p-1 bg-white/[0.04] border border-white/[0.05] rounded-xl w-fit">
              {(['script','scenes','captions','music'] as const).map(t=>(
                <button key={t} onClick={()=>setTab(t)} className="px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
                  style={{background:tab===t?'rgba(255,255,255,0.09)':'transparent',color:tab===t?'white':'rgba(255,255,255,0.32)'}}>
                  {t==='script'?'📝 Script':t==='scenes'?'🎬 Scenes':t==='captions'?'💬 Captions':'🎵 Music'}
                </button>
              ))}
            </div>

            {tab==='script'&&(
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <button onClick={()=>setMagic(o=>!o)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-white/[0.08] text-white/35 hover:text-white/60 hover:border-white/14 transition-all">✨ AI Edit</button>
                  {magic&&(<>
                    <input value={mText} onChange={e=>setMText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doMagic()} placeholder="e.g. Make the hook more dramatic…" autoFocus
                      className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/18 focus:outline-none focus:border-white/22 transition-colors"/>
                    <button onClick={doMagic} disabled={mLoad||!mText.trim()} className="px-3 py-1.5 rounded-xl text-xs font-medium disabled:opacity-40" style={{background:'#7b2fff',color:'white'}}>{mLoad?'…':'Apply'}</button>
                  </>)}
                </div>
                <textarea value={script} onChange={e=>setScript(e.target.value)} rows={18}
                  className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3.5 text-sm text-white/72 leading-7 resize-none focus:outline-none focus:border-white/16 transition-colors"/>
              </div>
            )}

            {tab==='scenes'&&(
              <div className="space-y-3">
                {scenes.length===0&&<div className="text-center py-16 text-white/20 text-sm">Generate a script first.</div>}
                {scenes.map((sc2,idx)=>(
                  <div key={sc2.id} className="bg-white/[0.025] border border-white/[0.07] rounded-xl overflow-hidden">
                    <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-white/[0.05]">
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full"
                        style={{background:sc2.type==='hook'?'rgba(0,200,255,0.12)':sc2.type==='cta'?'rgba(255,107,53,0.12)':'rgba(123,47,255,0.12)',color:sc2.type==='hook'?'#00c8ff':sc2.type==='cta'?'#ff6b35':'#7b2fff'}}>
                        {sc2.type.toUpperCase()}
                      </span>
                      <span className="text-xs text-white/25 flex-1">Scene {idx+1}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-white/20">⏱</span>
                        <input type="number" min={2} max={30} value={sc2.durationSeconds}
                          onChange={e=>setScenes(p=>p.map((s,i)=>i===idx?{...s,durationSeconds:Math.max(2,Math.min(30,+e.target.value))}:s))}
                          className="w-10 bg-white/[0.07] border border-white/10 rounded-lg px-1.5 py-0.5 text-[10px] text-white text-center focus:outline-none"/>
                        <span className="text-[10px] text-white/20">s</span>
                      </div>
                      <button onClick={()=>setScenes(p=>p.filter((_,i)=>i!==idx))} className="text-white/18 hover:text-red-400 text-xs transition-colors">✕</button>
                    </div>
                    <div className="flex gap-1.5 px-4 py-3 overflow-x-auto">
                      {(sc2.pexelsResults||[]).map((v,vi)=>{
                        const vk=idx+'-'+vi,act=sc2.mediaUrl===(v.bestUrl||v.thumbnail)
                        return(
                          <div key={v.id+'-'+vi}
                            onClick={()=>setScenes(p=>p.map((s,i)=>i===idx?{...s,mediaUrl:v.bestUrl||v.thumbnail,mediaType:v.type as 'video'|'image'}:s))}
                            onMouseEnter={()=>setHov(vk)} onMouseLeave={()=>setHov(null)}
                            className="relative shrink-0 cursor-pointer rounded-lg overflow-hidden transition-all duration-150"
                            style={{width:'54px',aspectRatio:'9/16',border:act?'2px solid #00c8ff':'2px solid rgba(255,255,255,0.07)',boxShadow:act?'0 0 10px rgba(0,200,255,0.25)':'none',transform:hov===vk?'scale(1.07)':'none'}}>
                            <img src={v.thumbnail} alt="" className="w-full h-full object-cover"/>
                            {hov===vk&&v.bestUrl&&<video src={v.bestUrl} className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline/>}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"/>
                            {act&&<div className="absolute top-1 left-1/2 -translate-x-1/2 bg-[#00c8ff] text-black text-[7px] font-black px-1 py-px rounded-full">✓</div>}
                            <div className="absolute bottom-1 left-0 right-0 text-center text-[7px] text-white/45">{v.duration}s</div>
                          </div>
                        )
                      })}
                      <button onClick={async()=>{const r=await fetch('/api/pexels-video?query='+encodeURIComponent(sc2.searchQuery)+'&per_page=9');const j=await r.json();const v=j.videos||[];setScenes(p=>p.map((s,i)=>i===idx?{...s,pexelsResults:v,mediaUrl:v[0]?.bestUrl||s.mediaUrl}:s))}}
                        className="shrink-0 rounded-lg border border-dashed border-white/12 flex flex-col items-center justify-center hover:border-[#00c8ff]/35 transition-all" style={{width:'54px',aspectRatio:'9/16'}}>
                        <span className="text-sm">🔄</span><span className="text-[7px] text-white/25 mt-0.5">More</span>
                      </button>
                    </div>
                    <div className="px-4 pb-3 space-y-2">
                      <input value={sc2.searchQuery} onChange={e=>setScenes(p=>p.map((s,i)=>i===idx?{...s,searchQuery:e.target.value}:s))}
                        onKeyDown={async e=>{if(e.key!=='Enter')return;const r=await fetch('/api/pexels-video?query='+encodeURIComponent(sc2.searchQuery)+'&per_page=9');const j=await r.json();const v=j.videos||[];setScenes(p=>p.map((s,i)=>i===idx?{...s,pexelsResults:v,mediaUrl:v[0]?.bestUrl||s.mediaUrl}:s))}}
                        placeholder="Search footage… (Enter)" className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-1.5 text-[10px] text-white/52 placeholder-white/18 focus:outline-none focus:border-white/16 transition-colors"/>
                      <input value={sc2.text} onChange={e=>setScenes(p=>p.map((s,i)=>i===idx?{...s,text:e.target.value}:s))}
                        placeholder="Caption for this scene…" className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-1.5 text-xs text-white/58 placeholder-white/18 focus:outline-none focus:border-white/16 transition-colors"/>
                    </div>
                  </div>
                ))}
                <button onClick={()=>setScenes(p=>[...p,{id:Date.now(),text:'New scene',searchQuery:topic.split(' ').slice(0,2).join(' '),type:'story' as const,mediaType:'video' as const,durationSeconds:10}])}
                  className="w-full py-2.5 rounded-xl border border-dashed border-white/08 text-xs text-white/25 hover:text-white/42 hover:border-white/14 transition-all">+ Add scene</button>
              </div>
            )}

            {tab==='captions'&&(
              <div className="space-y-7">
                <div>
                  <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest mb-3">Caption style</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[{id:'word-by-word',label:'Word by Word',icon:'💥',desc:'TikTok style'},{id:'full-line',label:'Full Line',icon:'📜',desc:'Subtitle style'},{id:'none',label:'None',icon:'🚫',desc:'No captions'}].map(s=>(
                      <button key={s.id} onClick={()=>setCStyle(s.id as any)} className="p-3 rounded-xl text-left border transition-all" style={B(cStyle===s.id)}>
                        <div className="text-lg mb-1.5">{s.icon}</div>
                        <div className="text-xs font-semibold text-white/75">{s.label}</div>
                        <div className="text-[10px] text-white/28 mt-0.5">{s.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest mb-3">Caption size</p>
                  <div className="flex gap-2">{(['small','medium','large'] as const).map(s=><button key={s} onClick={()=>setCSize(s)} className="flex-1 py-2.5 rounded-xl text-sm capitalize font-semibold border transition-all" style={B(cSize===s)}>{s}</button>)}</div>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest mb-3">Caption color</p>
                  <div className="flex items-center gap-2.5">
                    {['#ffffff','#ffff00','#00c8ff','#ff4488','#00ff88','#ff6b35'].map(c=>(
                      <button key={c} onClick={()=>setCColor(c)} className="w-7 h-7 rounded-full transition-all"
                        style={{background:c,border:cColor===c?'2.5px solid white':'2.5px solid transparent',boxShadow:cColor===c?'0 0 0 1.5px rgba(255,255,255,0.25)':'none'}}/>
                    ))}
                    <input type="color" value={cColor} onChange={e=>setCColor(e.target.value)} className="w-7 h-7 rounded-full cursor-pointer bg-transparent border border-white/15"/>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest">Brand color</p>
                    <button onClick={()=>setShowB(o=>!o)} className="text-[10px] text-white/25 hover:text-white/45 transition-colors">{showB?'Hide':'Show'}</button>
                  </div>
                  {showB&&<div className="flex items-center gap-2.5">
                    {['#00c8ff','#7b2fff','#ff6b35','#00ff88','#ff4488','#ffaa00'].map(c=>(
                      <button key={c} onClick={()=>setBColor(c)} className="w-7 h-7 rounded-full transition-all" style={{background:c,border:bColor===c?'2.5px solid white':'2.5px solid transparent'}}/>
                    ))}
                    <input type="color" value={bColor} onChange={e=>setBColor(e.target.value)} className="w-7 h-7 rounded-full cursor-pointer bg-transparent border border-white/15"/>
                  </div>}
                </div>
              </div>
            )}

            {tab==='music'&&(
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/[0.07] rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                      style={{background:'rgba(0,200,255,0.07)',border:'1px solid rgba(0,200,255,0.14)'}}>🎵</div>
                    <div>
                      <p className="text-sm font-semibold">Background Music</p>
                      <p className="text-[10px] text-white/28 mt-0.5">Jamendo · royalty-free · loops to video length</p>
                    </div>
                  </div>
                  <button onClick={()=>setMusicOn(o=>!o)}
                    className="w-11 h-6 rounded-full transition-all relative shrink-0"
                    style={{background:musicOn?'#00c8ff':'rgba(255,255,255,0.1)'}}>
                    <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-200"
                      style={{left:musicOn?'calc(100% - 22px)':'2px'}}/>
                  </button>
                </div>

                {musicOn&&(
                  <div className="space-y-6">

                    {/* Volume */}
                    <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl space-y-3">
                      <div className="flex justify-between items-center">
                        <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest">Volume</p>
                        <span className="text-xs font-bold" style={{color:'#00c8ff'}}>{Math.round(musicVol*100)}%</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-base">🔈</span>
                        <input type="range" min={0} max={0.6} step={0.01} value={musicVol}
                          onChange={e=>{const v=+e.target.value;setMusicVol(v);if(musicRef.current)musicRef.current.volume=v}}
                          className="flex-1" style={{accentColor:'#00c8ff'}}/>
                        <span className="text-base">🔊</span>
                      </div>
                      <p className="text-[10px] text-white/18">Keep at 15–25% so voiceover stays clear</p>
                    </div>

                    {/* Search */}
                    <div className="flex gap-2">
                      <input
                        value={musicSearch}
                        onChange={e=>setMusicSearch(e.target.value)}
                        onKeyDown={e=>{if(e.key==='Enter'&&musicSearch.trim()){setMusicOffset(0);setMusicTracks([]);fetchMusicBySearch(musicSearch)}}}
                        placeholder="Search music… e.g. calm piano, epic drums"
                        className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/18 focus:outline-none focus:border-white/22 transition-colors"/>
                      <button
                        onClick={()=>{if(musicSearch.trim()){setMusicOffset(0);setMusicTracks([]);fetchMusicBySearch(musicSearch)}}}
                        className="px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0"
                        style={{background:'rgba(0,200,255,0.1)',border:'1px solid rgba(0,200,255,0.2)',color:'#00c8ff'}}>
                        Search
                      </button>
                    </div>

                    {/* Genre */}
                    <div>
                      <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest mb-3">Genre</p>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          {id:'auto',label:'Auto',icon:'✨'},
                          {id:'cinematic',label:'Cinematic',icon:'🎬'},
                          {id:'upbeat',label:'Upbeat',icon:'⚡'},
                          {id:'lofi',label:'Lo-Fi',icon:'☕'},
                          {id:'dramatic',label:'Dramatic',icon:'🌩️'},
                          {id:'inspirational',label:'Inspire',icon:'🌅'},
                          {id:'dark',label:'Dark',icon:'🌑'},
                          {id:'happy',label:'Happy',icon:'😊'},
                        ].map(g=>{
                          const active=musicGenre===g.id
                          return(
                            <button key={g.id}
                              onClick={()=>{setMusicGenre(g.id);setMusicOffset(0);setMusicTracks([]);setMusicSearch('');fetchMusic(g.id,0)}}
                              className="p-2.5 rounded-xl border transition-all text-center"
                              style={{borderColor:active?'#00c8ff':'rgba(255,255,255,0.07)',background:active?'rgba(0,200,255,0.1)':'rgba(255,255,255,0.02)',color:active?'#00c8ff':'rgba(255,255,255,0.42)'}}>
                              <div className="text-base mb-1">{g.icon}</div>
                              <div className="text-[9px] font-semibold leading-tight">{g.label}</div>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Tracks */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest">Tracks</p>
                        {musicLoad&&<span className="text-[10px] text-white/20 animate-pulse">Loading…</span>}
                      </div>
                      {musicTracks.length===0&&!musicLoad&&(
                        <div className="text-center py-8 text-white/20 text-xs">No tracks found — try another genre or search</div>
                      )}
                      <div className="space-y-2">
                        {musicTracks.map(t=>{
                          const active=musicTrack?.id===t.id
                          const mins=Math.floor(t.duration/60)
                          const secs=String(t.duration%60).padStart(2,'0')
                          return(
                            <div key={t.id}
                              onClick={()=>{
                                setMusicTrack(t)
                                if(musicRef.current){musicRef.current.src=t.audio;musicRef.current.volume=musicVol;musicRef.current.play().then(()=>setMusicPlaying(true)).catch(()=>{})}
                              }}
                              className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-150"
                              style={{borderColor:active?'#00c8ff':'rgba(255,255,255,0.07)',background:active?'rgba(0,200,255,0.08)':'rgba(255,255,255,0.02)',transform:active?'translateY(-1px)':'none',boxShadow:active?'0 4px 16px rgba(0,200,255,0.12)':'none'}}>
                              <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-white/[0.05] flex items-center justify-center" style={{border:'1px solid rgba(255,255,255,0.07)'}}>
                                {t.image?<img src={t.image} alt="" className="w-full h-full object-cover"/>:<span className="text-base">🎵</span>}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-white/80 truncate">{t.title}</p>
                                <p className="text-[10px] text-white/28 truncate">{t.artist} · {mins}:{secs}</p>
                              </div>
                              {active&&musicPlaying
                                ?<div className="flex gap-px items-end shrink-0" style={{height:14}}>
                                  {[3,5,7,4,6,5,3].map((h,i)=><div key={i} className="w-0.5 rounded-full animate-bounce" style={{height:h*1.8,background:'#00c8ff',animationDelay:i*80+'ms'}}/>)}
                                </div>
                                :active
                                  ?<span className="text-[10px] font-bold shrink-0" style={{color:'#00c8ff'}}>✓</span>
                                  :<span className="text-[10px] text-white/18 shrink-0">▶</span>
                              }
                            </div>
                          )
                        })}
                      </div>
                      {musicTracks.length>0&&(
                        <button onClick={()=>{const next=musicOffset+10;setMusicOffset(next);fetchMusic(musicGenre,next)}} disabled={musicLoad}
                          className="w-full mt-3 py-2.5 rounded-xl border border-dashed border-white/08 text-xs text-white/25 hover:text-white/42 hover:border-white/14 transition-all disabled:opacity-30">
                          {musicLoad?'Loading…':'Load more tracks'}
                        </button>
                      )}
                    </div>

                    {musicPlaying&&(
                      <button onClick={()=>{musicRef.current?.pause();setMusicPlaying(false)}}
                        className="w-full py-2 rounded-xl border border-white/[0.07] text-xs text-white/35 hover:text-white/55 transition-all">
                        ⏹ Stop preview
                      </button>
                    )}

                    <audio ref={musicRef} loop preload="none"
                      onPlay={()=>setMusicPlaying(true)}
                      onPause={()=>setMusicPlaying(false)}
                      onEnded={()=>setMusicPlaying(false)}/>

                    {musicTrack&&(
                      <div className="flex items-center gap-2.5 p-3 rounded-xl border"
                        style={{background:'rgba(0,200,255,0.05)',borderColor:'rgba(0,200,255,0.18)'}}>
                        <span className="text-base">✅</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white/55 truncate">
                            <span className="text-white/80 font-semibold">{musicTrack.title}</span> by {musicTrack.artist}
                          </p>
                          <p className="text-[10px] text-white/28 mt-0.5">Mixed at {Math.round(musicVol*100)}% · loops to fill {dur}s</p>
                          <p className="text-[10px] mt-1" style={{color:'#00c8ff88'}}>⚠️ Required for YouTube → <a href={musicTrack.license} target="_blank" rel="noopener" className="underline ml-1" style={{color:'#00c8ff'}}>CC License</a></p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={()=>setStep(1)} className="px-5 py-3 rounded-xl text-sm text-white/30 border border-white/[0.07] hover:text-white/50 transition-all">← Back</button>
              <button onClick={()=>setStep(3)} className="flex-1 py-3 rounded-xl font-semibold text-sm text-black transition-all" style={{background:'linear-gradient(135deg,#00c8ff,#7b2fff)'}}>Continue to Export →</button>
            </div>
          </div>
        )}

        {/* STEP 3 — EXPORT */}
        {step===3&&(
          <div className="space-y-5">
            <div>
              <h1 className="text-[2rem] font-bold tracking-tight">Export</h1>
              <p className="text-white/32 text-sm mt-1">Generate voice, then render your final MP4.</p>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/[0.07] rounded-xl">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0" style={{background:'rgba(0,200,255,0.07)',border:'1px solid rgba(0,200,255,0.14)'}}>🎬</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white/80 truncate">{topic}</p>
                <p className="text-[10px] text-white/28 mt-0.5">{scenes.length} scenes · {dur}s · {voice.name} · {STYLES.find(s=>s.id===style)?.label}</p>
              </div>
              <button onClick={()=>setStep(2)} className="text-[10px] text-white/25 hover:text-white/45 transition-colors shrink-0">Edit</button>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div><p className="text-sm font-semibold">1 — Generate Voice</p><p className="text-[10px] text-white/28 mt-0.5">{voice.name} · ElevenLabs AI</p></div>
                {aUrl&&<span className="text-[10px] text-green-400 font-semibold">✓ Ready</span>}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[{label:'Stability',v:stab,set:setStab,c:'#00c8ff',min:0,max:1},{label:'Similarity',v:sim,set:setSim,c:'#7b2fff',min:0,max:1},{label:'Speed',v:spd,set:setSpd,c:'#00ff88',min:0.7,max:1.3}].map(x=>(
                  <div key={x.label}>
                    <div className="flex justify-between text-[10px] mb-1.5"><span className="text-white/28">{x.label}</span><span className="text-white/42">{x.v.toFixed(2)}</span></div>
                    <input type="range" min={x.min} max={x.max} step={0.05} value={x.v} onChange={e=>x.set(+e.target.value)} className="w-full" style={{accentColor:x.c}}/>
                  </div>
                ))}
              </div>
              {aUrl&&<audio src={aUrl} controls className="w-full h-8 rounded-lg"/>}
              {aErr&&<p className="text-xs text-red-400">{aErr}</p>}
              <button onClick={genVoice} disabled={aLoad||!script}
                className="w-full py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-35 border"
                style={{borderColor:aUrl?'rgba(0,255,136,0.22)':'rgba(255,255,255,0.09)',color:aUrl?'#00ff88':'rgba(255,255,255,0.55)'}}>
                {aLoad?'⏳ Generating…':aUrl?'🔄 Regenerate Voice':'🎙️ Generate Voice'}
              </button>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div><p className="text-sm font-semibold">2 — Render Video</p><p className="text-[10px] text-white/28 mt-0.5">1080×1920 · H.264 MP4 · AWS Lambda</p></div>
                {rUrl&&<span className="text-[10px] text-green-400 font-semibold">✓ Done</span>}
              </div>
              {lSetup&&(
                <div className="bg-amber-500/[0.07] border border-amber-500/18 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-semibold text-amber-400">⚙️ AWS Lambda setup needed</p>
                  <div className="space-y-1.5">{lVars.map(v=><div key={v} className="flex items-center gap-2"><span className="text-red-400 text-xs">✗</span><code className="text-[10px] text-red-300 font-mono">{v}</code></div>)}</div>
                  <a href="https://www.remotion.dev/docs/lambda/setup" target="_blank" rel="noopener" className="text-[10px] text-[#00c8ff] hover:underline block">View setup guide →</a>
                </div>
              )}
              {rLoad&&(
                <div className="space-y-2">
                  <div className="flex justify-between text-xs"><span className="text-white/38">{rStat}</span><span className="text-white font-semibold">{rPct}%</span></div>
                  <div className="w-full bg-white/[0.07] rounded-full h-1 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{width:rPct+'%',background:'linear-gradient(90deg,#00c8ff,#7b2fff)'}}/>
                  </div>
                </div>
              )}
              {rErr&&!lSetup&&<p className="text-xs text-red-400">{rErr}</p>}
              {rUrl&&(
                <div className="space-y-2.5">
                  <video src={rUrl} controls className="w-full rounded-xl" style={{maxHeight:260}}/>
                  <a href={rUrl} download="clipforge-short.mp4"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold"
                    style={{background:'rgba(0,255,136,0.07)',border:'1px solid rgba(0,255,136,0.18)',color:'#00ff88'}}>
                    ⬇️ Download MP4
                  </a>
                  {musicTrack&&(
                    <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl space-y-2">
                      <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest">📋 YouTube Attribution — copy this</p>
                      <div className="bg-black/30 rounded-lg p-3">
                        <p className="text-[11px] text-white/55 leading-5 whitespace-pre-line select-all">{`🎵 Music: ${musicTrack.title} by ${musicTrack.artist}\nLicensed under Creative Commons\n${musicTrack.license}`}</p>
                      </div>
                      <button onClick={()=>navigator.clipboard.writeText(`🎵 Music: ${musicTrack.title} by ${musicTrack.artist}\nLicensed under Creative Commons\n${musicTrack.license}`)}
                        className="w-full py-2 rounded-lg text-xs border border-white/[0.07] text-white/35 hover:text-white/55 transition-all">
                        📋 Copy attribution text
                      </button>
                    </div>
                  )}
                </div>
              )}
              {!rLoad&&!lSetup&&(
                <button onClick={render} className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all" style={{background:'linear-gradient(135deg,#7b2fff,#ff6b35)'}}>
                  🚀 {rUrl?'Re-render':'Render Video'}
                </button>
              )}
            </div>
            <button onClick={()=>setStep(2)} className="text-[10px] text-white/20 hover:text-white/38 transition-colors">← Back to script</button>
          </div>
        )}
      </main>
    </div>
  )
}