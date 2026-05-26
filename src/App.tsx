import { useState, useEffect } from 'react';
import { 
  Radio, 
  Calendar, 
  User, 
  Image as ImageIcon, 
  MapPin, 
  Clock, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Quote, 
  Play, 
  Square, 
  Volume2, 
  VolumeX, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  BookOpen, 
  Award,
  BookMarked,
  RotateCcw,
  Music
} from 'lucide-react';
import { timelineEvents, captainsData, testimoniesData, photoGalleryData, IMAGES } from './data';
import { TimelineEvent, Captain, Testimony, PhotoItem } from './types';
import { playMelody, stopProceduralAudio, GRANDOLA_MELODY, ADEUS_MELODY, playHistoricBleep } from './utils/audio';

export default function App() {
  // Navigation & tabs
  const [activeTab, setActiveTab] = useState<'inicio' | 'cronograma' | 'capitaes' | 'testemunhas' | 'galeria' | 'quiz'>('inicio');

  // Timeline states
  const [timelineSearch, setTimelineSearch] = useState('');
  const [importanceFilter, setImportanceFilter] = useState<'all' | 'critical' | 'alert' | 'normal'>('all');
  const [expandedTimelineEvents, setExpandedTimelineEvents] = useState<Record<string, boolean>>({
    'signal-1': true,
    'signal-2': true,
  });

  // Captain selector
  const [selectedCaptainId, setSelectedCaptainId] = useState('salgueiro-maia');
  
  // Testimony states
  const [selectedTestimonyId, setSelectedTestimonyId] = useState('celeste-caeiro');
  const [isTapePlaying, setIsTapePlaying] = useState(false);
  const [tapeTranscriptionProgress, setTapeTranscriptionProgress] = useState(100); // 0 to 100 percentage
  const [typedNarrative, setTypedNarrative] = useState('');

  // Audio Radio states
  const [playingRadioTrack, setPlayingRadioTrack] = useState<'none' | 'adeus' | 'grandola'>('none');
  const [activeLyricIndex, setActiveLyricIndex] = useState<number>(-1);

  // Gallery states
  const [activeGalleryTag, setActiveGalleryTag] = useState<'all' | 'ruas' | 'militar' | 'simbolos' | 'celebracoes'>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  // Trivia states
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Dictatorship vs Democracy comparison
  const [showComparisonInfo, setShowComparisonInfo] = useState(false);

  // Simulated audio level meter for visualizer
  const [audioMeterLevels, setAudioMeterLevels] = useState<number[]>([10, 10, 10, 10, 10, 10, 10, 10, 10, 10]);

  // Handle typing effect for testimony when selected or played
  useEffect(() => {
    const testimony = testimoniesData.find(t => t.id === selectedTestimonyId);
    if (!testimony) return;

    if (isTapePlaying) {
      setTypedNarrative('');
      let fullText = testimony.narrative;
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setTypedNarrative(prev => prev + fullText.charAt(currentIndex));
          currentIndex += 4; // Type faster to match reasonable reading speed
          if (Math.random() > 0.6) {
            playHistoricBleep(); // soft synth click
          }
        } else {
          clearInterval(interval);
          setIsTapePlaying(false);
        }
      }, 30);
      return () => clearInterval(interval);
    } else {
      setTypedNarrative(testimony.narrative);
    }
  }, [selectedTestimonyId, isTapePlaying]);

  // Handle tape audio level animations
  useEffect(() => {
    let animId: any;
    if (isTapePlaying || playingRadioTrack !== 'none') {
      const updateLevels = () => {
        setAudioMeterLevels(
          Array.from({ length: 12 }, () => Math.floor(Math.random() * 85) + 15)
        );
        animId = setTimeout(updateLevels, 100);
      };
      updateLevels();
    } else {
      setAudioMeterLevels([10, 15, 8, 12, 10, 15, 8, 12, 10, 15, 8, 10]);
    }
    return () => clearTimeout(animId);
  }, [isTapePlaying, playingRadioTrack]);

  // Audio track trigger
  const handlePlayRadio = (track: 'adeus' | 'grandola') => {
    if (playingRadioTrack === track) {
      stopProceduralAudio();
      setPlayingRadioTrack('none');
      setActiveLyricIndex(-1);
    } else {
      stopProceduralAudio();
      setPlayingRadioTrack(track);
      
      const melody = track === 'adeus' ? ADEUS_MELODY : GRANDOLA_MELODY;
      
      playMelody(
        melody,
        (noteIndex) => {
          // Highlight lyrics over time based on notes progression
          setActiveLyricIndex(noteIndex % 4);
        },
        () => {
          setPlayingRadioTrack('none');
          setActiveLyricIndex(-1);
        }
      );
    }
  };

  const handleStopAllRadio = () => {
    stopProceduralAudio();
    setPlayingRadioTrack('none');
    setActiveLyricIndex(-1);
  };

  // Toggle single timeline event
  const toggleTimelineEvent = (id: string) => {
    setExpandedTimelineEvents(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Toggle all timeline events
  const toggleAllTimelineEvents = (expand: boolean) => {
    const fresh: Record<string, boolean> = {};
    timelineEvents.forEach(e => {
      fresh[e.id] = expand;
    });
    setExpandedTimelineEvents(fresh);
  };

  // Timeline search and filter combined
  const filteredTimeline = timelineEvents.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(timelineSearch.toLowerCase()) || 
                          e.description.toLowerCase().includes(timelineSearch.toLowerCase()) ||
                          e.detailedText.toLowerCase().includes(timelineSearch.toLowerCase()) ||
                          e.location.toLowerCase().includes(timelineSearch.toLowerCase());
    
    if (importanceFilter === 'all') return matchesSearch;
    return matchesSearch && e.importance === importanceFilter;
  });

  const selectedCaptain = captainsData.find(c => c.id === selectedCaptainId) || captainsData[0];
  const selectedTestimony = testimoniesData.find(t => t.id === selectedTestimonyId) || testimoniesData[0];

  // Gallery filter
  const filteredPhotos = photoGalleryData.filter(p => {
    if (activeGalleryTag === 'all') return true;
    return p.category === activeGalleryTag;
  });

  // Handle Photo Indexing for Lightbox Navigation
  const handleNavigatePhoto = (direction: 'next' | 'prev') => {
    if (!selectedPhoto) return;
    const currentIndex = filteredPhotos.findIndex(item => item.id === selectedPhoto.id);
    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    if (nextIndex >= filteredPhotos.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = filteredPhotos.length - 1;
    
    setSelectedPhoto(filteredPhotos[nextIndex]);
  };

  // Short Quiz Questions Setup
  const quizQuestions = [
    {
      q: "Quem comandou a icónica coluna blindada de Santarém que sitiou as forças do governo no Quartel do Carmo?",
      options: [
        "Capitão Otelo Saraiva de Carvalho",
        "Capitão Fernando Salgueiro Maia",
        "General António de Spínola",
        "Professor Marcello Caetano"
      ],
      correct: 1,
      explanation: "Fernando Salgueiro Maia comandou a coluna militar de cavalaria proveniente de Santarém e geriu com absoluta coragem e pacificismo o cerco do Terreiro do Paço e do Largo do Carmo."
    },
    {
      q: "Qual foi a primeira música transmitida na rádio (pelas 22h55 de 24 de Abril) como sinal inicial de pré-alerta?",
      options: [
        "\"Grândola, Vila Morena\" de José Afonso",
        "\"Pedra Filosofal\" de Manuel Freire",
        "\"E Depois do Adeus\" de Paulo de Carvalho",
        "\"Fado do Alentejo\""
      ],
      correct: 2,
      explanation: "A primeira rádio-senha foi \"E Depois do Adeus\", cantada por Paulo de Carvalho. Era uma música romântica despolitizada e que por isso não levantou suspeitas na PIDE e na censura."
    },
    {
      q: "De onde partiu a histórica coluna blindada liderada por Salgueiro Maia na madrugada do 25 de Abril?",
      options: [
        "Escola Prática de Cavalaria de Santarém",
        "Regimento de Infantaria do Porto",
        "Quartel de Elvas",
        "Batalhão de Caçadores de Coimbra"
      ],
      correct: 0,
      explanation: "A mítica coluna militar de Salgueiro Maia partiu da Escola Prática de Cavalaria de Santarém à meia-noite, marchando cerca de 80km até chegar a Lisboa de madrugada."
    },
    {
      q: "Quem foi a heroína popular que ofereceu os primeiros cravos vermelhos aos soldados na manhã do 25 de Abril de 1974?",
      options: [
        "Maria Alzira, estudante de letras",
        "Maria de Lourdes Pintasilgo",
        "Celeste Caeiro, funcionária de restaurante",
        "Carolina Beatriz Ângelo"
      ],
      correct: 2,
      explanation: "Celeste Caeiro transportava um braçado de cravos que restara de uma celebração num restaurante. Ao deparar-se com os tanques, ofereceu-os aos soldados, que enfiaram as flores nos canos dos fuzis."
    },
    {
      q: "Onde estava situado o Posto de Comando secreto do MFA, gerido por Otelo, de onde foram coordenadas as ações táticas?",
      options: [
        "Fortaleza de Peniche",
        "Posto de Controle da Pontinha (Lisboa)",
        "Quartel-General de Mafra",
        "Assembleia da República"
      ],
      correct: 1,
      explanation: "O cérebro tático do MFA funcionou no Regimento de Engenharia n.º 1, na Pontinha. Aí, Otelo Saraiva de Carvalho e a sua equipa vigiavam as transmissões de rádio e controlavam o mapa nacional."
    }
  ];

  const handleQuizOption = (questIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({
      ...prev,
      [questIdx]: optIdx
    }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) {
        score++;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  // Preload and clear audio context on unmount
  useEffect(() => {
    return () => stopProceduralAudio();
  }, []);

  return (
    <div id="revolucao_app" className="min-h-screen font-sans flex flex-col selection:bg-carnation-red selection:text-white pb-10">
      
      {/* Top Banner Archive Header */}
      <header id="main_header" className="bg-[#1A1A1A] text-[#F9F7F2] py-5 px-6 sticky top-0 z-40 border-b-4 border-[#BC0000] shadow-[0_4px_0_0_#1A1A1A]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative group p-1 bg-white border-2 border-black rounded-sm shadow-[2px_2px_0_0_#BC0000]">
              <span className="text-3xl filter select-none">🌺</span>
              <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-700"></span>
              </span>
            </div>
            <div>
              <h1 className="font-display text-2xl md:text-3xl tracking-widest font-black flex items-center gap-2 text-white">
                25 DE ABRIL <span className="text-white text-xs font-mono font-bold tracking-normal px-2 py-0.5 bg-[#BC0000] ml-1">1974</span>
              </h1>
              <p className="text-xs text-[#BC0000] uppercase tracking-widest font-mono font-bold">Arquivo Histórico / Memória de Portugal</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-wrap justify-center gap-1.5 p-1 bg-black/40 border border-white/20">
            <button 
              id="tab_btn_inicio" 
              onClick={() => { setActiveTab('inicio'); handleStopAllRadio(); }}
              className={`px-3 py-1.5 text-xs md:text-sm font-sans font-bold uppercase tracking-wider transition-all duration-150 ${
                activeTab === 'inicio' 
                  ? 'bg-[#BC0000] text-white border border-black shadow-[2px_2px_0_0_#000000] font-black' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Início
            </button>
            <button 
              id="tab_btn_cronograma" 
              onClick={() => { setActiveTab('cronograma'); handleStopAllRadio(); }}
              className={`px-3 py-1.5 text-xs md:text-sm font-sans font-bold uppercase tracking-wider transition-all duration-150 ${
                activeTab === 'cronograma' 
                  ? 'bg-[#BC0000] text-white border border-black shadow-[2px_2px_0_0_#000000] font-black' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Cronograma do Dia
            </button>
            <button 
              id="tab_btn_capitaes" 
              onClick={() => { setActiveTab('capitaes'); handleStopAllRadio(); }}
              className={`px-3 py-1.5 text-xs md:text-sm font-sans font-bold uppercase tracking-wider transition-all duration-150 ${
                activeTab === 'capitaes' 
                  ? 'bg-[#BC0000] text-white border border-black shadow-[2px_2px_0_0_#000000] font-black' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Os Capitães
            </button>
            <button 
              id="tab_btn_testemunhas" 
              onClick={() => { setActiveTab('testemunhas'); handleStopAllRadio(); }}
              className={`px-3 py-1.5 text-xs md:text-sm font-sans font-bold uppercase tracking-wider transition-all duration-150 ${
                activeTab === 'testemunhas' 
                  ? 'bg-[#BC0000] text-white border border-black shadow-[2px_2px_0_0_#000000] font-black' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Sons da Memória
            </button>
            <button 
              id="tab_btn_galeria" 
              onClick={() => { setActiveTab('galeria'); handleStopAllRadio(); }}
              className={`px-3 py-1.5 text-xs md:text-sm font-sans font-bold uppercase tracking-wider transition-all duration-150 ${
                activeTab === 'galeria' 
                  ? 'bg-[#BC0000] text-white border border-black shadow-[2px_2px_0_0_#000000] font-black' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Fotos Históricas
            </button>
            <button 
              id="tab_btn_quiz" 
              onClick={() => { setActiveTab('quiz'); handleStopAllRadio(); }}
              className={`px-3 py-1.5 text-xs md:text-sm font-sans font-bold uppercase tracking-wider transition-all duration-150 ${
                activeTab === 'quiz' 
                  ? 'bg-[#BC0000] text-white border border-black shadow-[2px_2px_0_0_#000000] font-black' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Quiz de Abril
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-6 pt-6">
        
        {/* ================= SECTION: INÍCIO ================= */}
        {activeTab === 'inicio' && (
          <div id="section_inicio" className="space-y-8 animate-fade-in">
            
            {/* Hero Card */}
            <div className="brutalist-card-red overflow-hidden grid grid-cols-1 lg:grid-cols-12">
              <div className="p-6 md:p-10 lg:col-span-7 flex flex-col justify-between bg-white">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[#BC0000] bg-red-50 border border-[#BC0000] font-bold px-3 py-0.5 text-xs uppercase tracking-wider font-mono">
                      Revolução Democrática
                    </span>
                    <span className="text-gray-600 text-xs font-mono font-bold bg-[#F9F7F2] border border-gray-300 px-2.5 py-0.5">25 DE ABRIL DE 1974</span>
                  </div>
                  <h2 className="font-display text-3xl md:text-5xl text-[#1A1A1A] tracking-tight font-black mb-5 leading-tight">
                    A Revolução <br className="hidden md:inline" />
                    que Devolveu o Futuro <span className="underline decoration-[#BC0000] decoration-4 underline-offset-4">a Portugal</span>
                  </h2>
                  <p className="font-serif text-gray-800 leading-relaxed md:text-lg mb-6">
                    Após 48 anos de um regime autoritário asfixiante e repressivo (o Estado Novo), um movimento corajoso de oficiais idealistas depôs pacificamente a ditadura. Guiados por ondas de rádio secretas e abraçados pelo povo português vitorioso nas ruas de Lisboa, ergueram cravos de paz em vez de sangue.
                  </p>
                </div>

                <div className="border-t-2 border-dashed border-[#1A1A1A] pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 bg-[#F9F7F2] p-3 border border-gray-300">
                    <span className="text-[10px] text-gray-500 uppercase font-mono block font-bold">O Lema de Abril</span>
                    <span className="font-black text-[#1a1a1a] text-xs md:text-sm block">"Descolonizar, Democratizar, Desenvolver"</span>
                  </div>
                  <div className="space-y-1 bg-[#F9F7F2] p-3 border border-gray-300">
                    <span className="text-[10px] text-gray-500 uppercase font-mono block font-bold">Símbolo Pacífico</span>
                    <span className="font-black text-[#BC0000] text-xs md:text-sm block flex items-center gap-1">
                      🌺 O Cravo Vermelho de Celeste
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#1a1a1a] min-h-[300px] lg:col-span-5 relative group border-t-4 lg:border-t-0 lg:border-l-4 border-[#1A1A1A]">
                <img 
                  src={IMAGES.heroBanner} 
                  alt="Ilustração da Revolução dos Cravos" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 hover:brightness-100 transition-all duration-700" 
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 text-white">
                  <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest font-bold">Ilustração Histórica Memorial</p>
                  <p className="font-serif italic text-sm text-[#F9F7F2] font-semibold">"O Cravo na Espingarda — A consagração da Paz."</p>
                </div>
              </div>
            </div>

            {/* Radio Broadcaster Signal Panel - MELODY GENERATOR */}
            <div className="bg-[#1A1A1A] border-4 border-black p-6 md:p-8 text-white relative shadow-[8px_8px_0px_0px_rgba(188,0,0,1)] rounded-sm overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none">
                <Radio className="w-64 h-64 text-white" />
              </div>

              {/* Dial Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b-2 border-dashed border-gray-700 pb-5 mb-6 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-950/60 border-2 border-[#BC0000] animate-pulse">
                    <Radio className="w-6 h-6 text-[#BC0000]" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-xl tracking-wider text-[#F9F7F2]">
                      SIMULADOR DE RÁDIO-SINAL (1974)
                    </h3>
                    <p className="text-xs font-mono text-gray-300 uppercase tracking-widest">
                      Sintoniza as senhas militares secretas daquela madrugada histórica
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-[#111] px-4 py-2 border-2 border-gray-750 font-mono text-xs">
                  <span className="text-green-400 inline-block h-2 w-2 rounded-full animate-ping"></span>
                  <span className="text-gray-400">SINTONIA AM:</span>
                  <span className="text-amber-400 font-extrabold text-[#BC0000]">1035 kHz AM</span>
                </div>
              </div>

              {/* Instructions and Radio Play Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-[#111] p-4 border border-gray-800 space-y-3">
                    <p className="text-xs text-[#BC0000] font-mono uppercase tracking-wider font-extrabold">Como funciona:</p>
                    <p className="text-xs text-[#F9F7F2] leading-relaxed font-serif">
                      Clica num dos botões das rádios de senha abaixo. O sintetizador interno do seu browser irá recriar a sonoridade análoga original das canções com um filtro rádio AM vintage.
                    </p>
                    {playingRadioTrack !== 'none' && (
                      <button 
                        onClick={handleStopAllRadio}
                        className="w-full flex items-center justify-center gap-2 bg-[#BC0000] hover:bg-red-700 text-white py-2 px-3 text-xs font-mono font-bold uppercase tracking-wider border border-black"
                      >
                        <Square className="w-3.5 h-3.5 fill-current" /> Interromper Rádio
                      </button>
                    )}
                  </div>

                  {/* Frequency dial graphic */}
                  <div className="bg-[#222] p-3 border-2 border-black shadow-[3px_3px_0_0_black]">
                    <div className="flex justify-between font-mono text-[9px] text-gray-400 mb-1 px-1 font-bold">
                      <span>900k</span><span>950k</span><span>1000k</span><span>1050k</span><span>1100k</span>
                    </div>
                    <div className="h-6 bg-black rounded-none relative overflow-hidden border border-gray-750">
                      <div className="absolute inset-y-0 left-1/3 w-0.5 bg-gray-800"></div>
                      <div className="absolute inset-y-0 left-2/3 w-0.5 bg-gray-800"></div>
                      <div 
                        className={`absolute inset-y-0 w-0.5 transition-all duration-1000 ${
                          playingRadioTrack === 'adeus' ? 'left-[46%] bg-[#BC0000] shadow-[0_0_8px_red]' : 
                          playingRadioTrack === 'grandola' ? 'left-[71%] bg-green-500 shadow-[0_0_8px_#10b981]' : 'left-10 bg-gray-650'
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* The Two Historic Tracks */}
                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* TRACK A: E DEPOIS DO ADEUS */}
                  <div className={`p-5 rounded-none border-2 transition-all duration-300 flex flex-col justify-between ${
                    playingRadioTrack === 'adeus' 
                      ? 'bg-[#2D0F0F] border-[#BC0000] shadow-[4px_4px_0px_0px_#BC0000]' 
                      : 'bg-[#222] border-black hover:border-gray-700 shadow-[3px_3px_0_0_rgba(0,0,0,1)]'
                  }`}>
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-mono text-gray-300 bg-black/60 border border-gray-800 px-2 py-0.5 uppercase tracking-wide">Senha Alerta 22h55</span>
                        {playingRadioTrack === 'adeus' && (
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-550"></span>
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg font-display font-black text-white">E Depois do Adeus</h4>
                      <p className="text-xs text-gray-400 font-serif italic mb-3">Paulo de Carvalho</p>
                      
                      <div className="text-[11px] font-mono text-gray-300 text-left bg-black/40 p-3 rounded-none border border-gray-800 min-h-[110px] flex flex-col justify-center">
                        <p className="font-bold text-[#BC0000] text-[10px] uppercase mb-1 tracking-wider">Letra da Transmissão:</p>
                        {playingRadioTrack === 'adeus' ? (
                          <div className="space-y-0.5 font-sans">
                            {['Quis saber quem sou...', 'o que faço aqui...', 'Quem me abandonou,', 'de quem me esqueci...'].map((line, i) => (
                              <p key={i} className={activeLyricIndex === i ? 'text-[#BC0000] font-black text-xs transition-all duration-300' : 'text-gray-500'}>
                                {line}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p className="italic text-gray-500 font-serif">Sinaliza preparação aos capitães das guarnições para ajustarem os recetores de rádio.</p>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={() => handlePlayRadio('adeus')}
                      className={`mt-4 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-none font-mono font-bold text-xs uppercase transition-all duration-150 border-2 ${
                        playingRadioTrack === 'adeus' 
                          ? 'bg-transparent text-white border-white' 
                          : 'bg-[#BC0000] hover:bg-red-700 text-white border-black shadow-[2px_2px_0px_0px_black]'
                      }`}
                    >
                      {playingRadioTrack === 'adeus' ? (
                        <>
                          <Square className="w-3.5 h-3.5 fill-current" /> Interromper
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" /> Ouvir Senha 1
                        </>
                      )}
                    </button>
                  </div>

                  {/* TRACK B: GRÂNDOLA VILA MORENA */}
                  <div className={`p-5 rounded-none border-2 transition-all duration-300 flex flex-col justify-between ${
                    playingRadioTrack === 'grandola' 
                      ? 'bg-[#112411] border-[#006633] shadow-[4px_4px_0px_0px_#006633]' 
                      : 'bg-[#222] border-black hover:border-gray-700 shadow-[3px_3px_0_0_rgba(0,0,0,1)]'
                  }`}>
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-mono text-gray-300 bg-black/60 border border-gray-800 px-2 py-0.5 uppercase tracking-wide">CONFIRMAÇÃO 00h20</span>
                        {playingRadioTrack === 'grandola' && (
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg font-display font-black text-white">Grândola, Vila Morena</h4>
                      <p className="text-xs text-gray-400 font-serif italic mb-3">José Afonso (Zeca Afonso)</p>
                      
                      <div className="text-[11px] font-mono text-gray-300 text-left bg-black/40 p-3 rounded-none border border-gray-800 min-h-[110px] flex flex-col justify-center">
                        <p className="font-bold text-[#006633] text-[10px] uppercase mb-1 tracking-wider">Letra da Transmissão:</p>
                        {playingRadioTrack === 'grandola' ? (
                          <div className="space-y-0.5 font-sans">
                            {['Grândola, vila morena...', 'Terra da fraternidade...', 'O povo é quem mais ordena...', 'Dentro de ti, ó cidade...'].map((line, i) => (
                              <p key={i} className={activeLyricIndex === i ? 'text-green-400 font-black text-xs transition-all duration-300' : 'text-gray-500'}>
                                {line}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p className="italic text-gray-500 font-serif">Sinal de avanço irreversível para a saída das guarnições rebeldes em todo o país.</p>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={() => handlePlayRadio('grandola')}
                      className={`mt-4 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-none font-mono font-bold text-xs uppercase transition-all duration-150 border-2 ${
                        playingRadioTrack === 'grandola' 
                          ? 'bg-transparent text-white border-white' 
                          : 'bg-[#006633] hover:bg-green-800 text-white border-black shadow-[2px_2px_0px_0px_black]'
                      }`}
                    >
                      {playingRadioTrack === 'grandola' ? (
                        <>
                          <Square className="w-3.5 h-3.5 fill-current" /> Interromper
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" /> Ouvir Senha 2
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </div>

              {/* Oscilloscope meter display */}
              {(playingRadioTrack !== 'none') && (
                <div className="mt-5 bg-black p-4 border-2 border-dashed border-gray-700">
                  <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1.5 mb-2 font-bold uppercase tracking-widest">
                    <span className="w-2 h-2 bg-[#BC0000] animate-pulse"></span>
                    Sinal Óptico em Transmissão (AM Synthesizer Oscillator)
                  </span>
                  <div className="flex items-end justify-between h-12 gap-[3px]">
                    {audioMeterLevels.map((lvl, i) => (
                      <div 
                        key={i} 
                        style={{ height: `${lvl}%` }} 
                        className={`w-full transition-all duration-105 ${
                          playingRadioTrack === 'adeus' ? 'bg-[#BC0000]' : 'bg-[#006633]'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Education: Dictatorship vs Democracy Interactivity */}
            <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] rounded-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2 bg-[#F9F7F2] border-2 border-black">⏳</span>
                  <div>
                    <h3 className="font-display font-black text-xl text-[#1A1A1A] uppercase tracking-wider">
                      Antes vs Depois: O Que Mudou com o 25 de Abril?
                    </h3>
                    <p className="text-xs text-gray-600 font-mono font-bold uppercase tracking-wide">Quadro comparativo de direitos civis básicos</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowComparisonInfo(!showComparisonInfo)}
                  className="brutalist-button text-xs px-4 py-2 font-mono flex items-center gap-1.5"
                >
                  <Info className="w-3.5 h-3.5 text-[#BC0000]" /> {showComparisonInfo ? 'Ocultar Contexto' : 'Saber Mais'}
                </button>
              </div>

              {showComparisonInfo && (
                <p className="mb-6 text-sm font-serif text-gray-800 bg-[#F9F7F2] p-4 border-2 border-dashed border-[#1A1A1A] leading-relaxed">
                  A ditadura do Estado Novo asfixiava as liberdades básicas através da terrível Censura Prévia (chamada "Exame Prévio", onde os jornais tinham de enviar todas as provas antecipadamente) e da PIDE/DGS, a polícia secreta militarizada que prendia e torturava sem mandado quem manifestasse opiniões de protesto contra o regime ou a Guerra Colonial, que consumia mais de 40% do orçamento público.
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* DITADURA */}
                <div className="bg-[#FFFDFB] border-2 border-black p-5 space-y-3 relative overflow-hidden shadow-[4px_4px_0px_0px_#BC0000] rounded-sm">
                  <div className="absolute top-0 right-0 w-24 h-24 -mr-5 -mt-5 bg-red-100/60 rounded-full pointer-events-none flex items-center justify-center font-mono text-[10px] text-[#BC0000] font-black rotate-12 uppercase border border-[#BC0000]/10">
                    Ditadura
                  </div>
                  <h4 className="font-sans font-black text-[#BC0000] text-sm uppercase tracking-wider flex items-center gap-2">
                    <span>🛑</span> Estado Novo (Até 24 de Abril)
                  </h4>
                  <ul className="space-y-3.5 text-xs text-gray-800 font-serif">
                    <li className="flex items-start gap-1.5">
                      <span className="text-red-600 font-black">•</span>
                      <span><strong>Censura Completa ("Lápis Azul"):</strong> Jornais, rádios, peças de teatro e livros cortados arbitrariamente por inspetores políticos.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-red-600 font-black">•</span>
                      <span><strong>Proibição de Partidos:</strong> Um único partido oficial (a União Nacional). Oposição considerada um ato de alta traição.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-red-600 font-black">•</span>
                      <span><strong>Guerra Colonial Sangrenta:</strong> Jovens enviados obrigatoriamente para combater em Angola, Moçambique e Guiné.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-red-600 font-black">•</span>
                      <span><strong>PIDE e Tortura:</strong> Prisão sem culpa formada e interrogatórios cruéis para dissidentes civis rurais e urbanos.</span>
                    </li>
                  </ul>
                </div>

                {/* DEMOCRACIA */}
                <div className="bg-[#FBFFFB] border-2 border-black p-5 space-y-3 relative overflow-hidden shadow-[4px_4px_0px_0px_#006633] rounded-sm">
                  <div className="absolute top-0 right-0 w-24 h-24 -mr-5 -mt-5 bg-emerald-100/60 rounded-full pointer-events-none flex items-center justify-center font-mono text-[10px] text-[#006633] font-black -rotate-12 uppercase border border-[#006633]/10">
                    Democracia
                  </div>
                  <h4 className="font-sans font-black text-[#006633] text-sm uppercase tracking-wider flex items-center gap-2">
                    <span>🌟</span> Portugal de Abril (Pós Revolução)
                  </h4>
                  <ul className="space-y-3.5 text-xs text-gray-800 font-serif">
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#006633] font-black">•</span>
                      <span><strong>Liberdade de Expressão Absoluta:</strong> Abolição ríspida do lápis azul; nascimento imediato de imprensa livre e plural.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#006633] font-black">•</span>
                      <span><strong>Sufrágio e Pluripartidarismo:</strong> Eleição por voto secreto no Parlamento e Presidência com partidos variados.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#006633] font-black">•</span>
                      <span><strong>Fim de Guerra e Descolonização:</strong> Cessação da guerra colonial em África e consequente autodeterminação dos povos dantes dominados.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#006633] font-black">•</span>
                      <span><strong>Direitos e Libertação:</strong> Amnistia total de opositores políticos e encerramento dos presídios de Peniche e Caxias.</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>

            {/* Quick stats grid related to the day */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="brutalist-card bg-white p-5 leading-tight select-none">
                <span className="text-3xl block mb-1">🕊️</span>
                <span className="text-3xl font-black font-mono text-[#BC0000] block">0</span>
                <span className="text-[10px] text-gray-600 uppercase tracking-wider font-mono font-bold block mt-1">Batalhas Armadas</span>
              </div>
              <div className="brutalist-card bg-white p-5 leading-tight select-none">
                <span className="text-3xl block mb-1">🏢</span>
                <span className="text-3xl font-black font-mono text-[#006633] block">17</span>
                <span className="text-[10px] text-gray-600 uppercase tracking-wider font-mono font-bold block mt-1">Alvos tomados</span>
              </div>
              <div className="brutalist-card bg-white p-5 leading-tight select-none">
                <span className="text-3xl block mb-1">🌸</span>
                <span className="text-3xl font-black font-mono text-[#BC0000] block">50k+</span>
                <span className="text-[10px] text-gray-600 uppercase tracking-wider font-mono font-bold block mt-1">Cravos Oferecidos</span>
              </div>
              <div className="brutalist-card bg-white p-5 leading-tight select-none">
                <span className="text-3xl block mb-1">🔗</span>
                <span className="text-3xl font-black font-mono text-gray-900 block">48</span>
                <span className="text-[10px] text-gray-600 uppercase tracking-wider font-mono font-bold block mt-1">Anos de Ditadura</span>
              </div>
            </div>

          </div>
        )}

        {/* ================= SECTION: CRONOGRAMA INTERATIVO ================= */}
        {activeTab === 'cronograma' && (
          <div id="section_cronograma" className="space-y-6 animate-fade-in">
            
            {/* Control Panel */}
            <div className="bg-white p-5 rounded-none border-4 border-black shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
              <div className="space-y-1">
                <h3 className="font-display font-black text-xl text-[#1A1A1A] uppercase">
                  Os Passos da Madrugada de Prata
                </h3>
                <p className="text-xs text-gray-600 font-mono font-bold uppercase tracking-wide">
                  Acompanha em pormenor a sequência cronológica dos eventos daquele 25 de Abril de 1974.
                </p>
              </div>

              {/* Filtering & Search inputs */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Pesquisar evento..." 
                    value={timelineSearch}
                    onChange={(e) => setTimelineSearch(e.target.value)}
                    className="pl-9 pr-4 py-1.5 rounded-none border-2 border-black text-xs w-full sm:w-48 bg-[#fafafa] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#BC0000] font-mono font-bold"
                  />
                </div>

                <div className="flex items-center gap-1 border-2 border-black p-1 bg-[#fafafa] rounded-none">
                  <button 
                    onClick={() => setImportanceFilter('all')}
                    className={`px-2 py-1 text-[10px] font-mono font-bold uppercase ${importanceFilter === 'all' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'}`}
                  >
                    Todos
                  </button>
                  <button 
                    onClick={() => setImportanceFilter('critical')}
                    className={`px-2 py-1 text-[10px] font-mono font-bold uppercase flex items-center gap-1 ${importanceFilter === 'critical' ? 'bg-[#BC0000] text-white' : 'text-gray-500 hover:text-black'}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-none bg-[#BC0000]"></span> Críticos
                  </button>
                  <button 
                    onClick={() => setImportanceFilter('alert')}
                    className={`px-2 py-1 text-[10px] font-mono font-bold uppercase flex items-center gap-1 ${importanceFilter === 'alert' ? 'bg-amber-500 text-white animate-pulse' : 'text-gray-500 hover:text-black'}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-none bg-amber-500"></span> Alertas
                  </button>
                </div>

                {/* Expand / Collapse all */}
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => toggleAllTimelineEvents(true)}
                    className="p-1.5 bg-[#F9F7F2] hover:bg-[#eadecc] text-[#1A1A1A] text-[10px] font-mono font-bold border-2 border-black uppercase"
                    title="Expandir todos"
                  >
                    Expandir
                  </button>
                  <button 
                    onClick={() => toggleAllTimelineEvents(false)}
                    className="p-1.5 bg-[#F9F7F2] hover:bg-[#eadecc] text-[#1A1A1A] text-[10px] font-mono font-bold border-2 border-black uppercase"
                    title="Recolher todos"
                  >
                    Recolher
                  </button>
                </div>
              </div>
            </div>

            {/* Main Interactive Vertical Timeline structure */}
            <div className="relative border-l-4 border-black ml-4 md:ml-36 pl-6 md:pl-10 space-y-8 py-4">
              
              {filteredTimeline.length === 0 ? (
                <div className="bg-white p-10 text-center border-4 border-black text-gray-500 space-y-3 shadow-[5px_5px_0_0_black]">
                  <span className="text-3xl block">🔍</span>
                  <p className="font-bold text-sm text-[#1A1A1A] uppercase font-mono">Nenhum evento do cronograma corresponde à pesquisa.</p>
                  <button 
                    onClick={() => { setTimelineSearch(''); setImportanceFilter('all'); }}
                    className="text-xs text-[#BC0000] font-black underline hover:text-red-700"
                  >
                    Limpar filtros
                  </button>
                </div>
              ) : (
                filteredTimeline.map((evt) => {
                  const isExpanded = !!expandedTimelineEvents[evt.id];
                  
                  return (
                    <div key={evt.id} id={`timeline_node_${evt.id}`} className="relative group">
                      
                      {/* Left timeline side time-indicator */}
                      <span className="hidden md:flex absolute -left-[185px] top-1.5 w-32 justify-end text-right font-mono text-xs font-bold text-[#1a1a1a] gap-1.5 items-center">
                        <Clock className="w-3.5 h-3.5 text-[#BC0000]" />
                        <span className="bg-[#F9F7F2] text-black font-black px-2 py-0.5 border-2 border-black">
                          {evt.time.split(' ')[2] || evt.time}
                        </span>
                      </span>

                      {/* Timeline point bullet */}
                      <span className={`absolute -left-[32px] md:-left-[48px] top-1.5 h-6 w-6 border-2 border-black bg-white flex items-center justify-center transition-all duration-300 shadow-[2px_2px_0_0_black]`}>
                        <span className={`h-2.5 w-2.5 ${
                          evt.importance === 'critical' ? 'bg-[#BC0000]' : evt.importance === 'alert' ? 'bg-amber-500 animate-pulse' : 'bg-green-600'
                        }`}></span>
                      </span>

                      {/* Main card */}
                      <div className="bg-white border-2 border-black hover:shadow-[4px_4px_0px_0px_black] transition-all duration-150 overflow-hidden rounded-sm">
                        
                        {/* Summary Header */}
                        <div 
                          onClick={() => toggleTimelineEvent(evt.id)}
                          className="p-4 md:p-5 flex justify-between items-start gap-3 cursor-pointer select-none hover:bg-[#F9F7F2] active:bg-[#edece5] transition"
                        >
                          <div className="space-y-1">
                            {/* Mobile time display (only shown when screen is small) */}
                            <span className="md:hidden inline-flex items-center gap-1 bg-[#F9F7F2] text-black px-2 py-0.5 border border-black text-[10px] font-mono font-bold mb-1">
                              {evt.time}
                            </span>

                            <h4 className="font-display font-black text-[#1A1A1A] text-base md:text-xl flex flex-wrap items-center gap-2">
                              {evt.title}
                              {evt.importance === 'critical' && (
                                <span className="text-[9px] bg-red-50 text-[#BC0000] border border-[#BC0000] px-2 py-0.5 font-mono uppercase font-bold tracking-wider">Crítico</span>
                              )}
                            </h4>
                            
                            <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium font-serif">
                              <MapPin className="w-3.5 h-3.5 text-[#BC0000] flex-shrink-0" />
                              <span>{evt.location}</span>
                            </div>
                          </div>

                          <button className="p-1 text-gray-600 hover:text-black">
                            {isExpanded ? <ChevronUp className="w-5 h-5 stroke-[2.5]" /> : <ChevronDown className="w-5 h-5 stroke-[2.5]" />}
                          </button>
                        </div>

                        {/* Expandable detailed content wrapper */}
                        {isExpanded && (
                          <div className="px-4 md:px-5 pb-5 pt-2 border-t-2 border-dashed border-black bg-[#faf9f5] text-gray-800 space-y-4 animate-fade-in">
                            
                            {/* Brief summary */}
                            <p className="font-serif italic text-gray-800 bg-white p-4 border-l-4 border-[#BC0000] border border-gray-300 text-sm leading-relaxed shadow-sm">
                              {evt.description}
                            </p>

                            {/* Detailed Historical Narrative */}
                            <div className="text-sm font-serif leading-relaxed text-gray-700 space-y-3 px-1">
                              {evt.detailedText.split('\n\n').map((para, i) => (
                                <p key={i}>{para}</p>
                              ))}
                            </div>

                            {/* Signal Song lyrics info if attached */}
                            {evt.audioTrack && (
                              <div className="bg-[#1A1A1A] text-[#F9F7F2] border-2 border-black shadow-[4px_4px_0_0_black] p-5 space-y-3 rounded-none">
                                <div className="flex items-center justify-between text-xs border-b border-gray-700 pb-2.5">
                                  <span className="font-mono text-[10px] text-gray-300 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                                    <Music className="w-3.5 h-3.5 text-[#BC0000]" /> Rádio-Senha Detalhada
                                  </span>
                                  <span className="px-2.5 py-0.5 bg-[#BC0000] text-white border border-black font-mono text-[9px] font-black uppercase tracking-widest">
                                    AM TRANSMISSÃO
                                  </span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <h5 className="font-display font-black text-base text-white">{evt.audioTrack.songTitle}</h5>
                                    <p className="text-xs text-gray-400 font-serif italic">Autor/Intérprete: {evt.audioTrack.artist}</p>
                                    <p className="text-xs text-gray-300 leading-relaxed font-serif pt-1">{evt.audioTrack.description}</p>
                                  </div>
                                  <div className="bg-black/35 p-3 border border-gray-800 font-mono text-[11px] text-gray-300 space-y-1">
                                    <p className="text-xs font-bold text-gray-400 uppercase pb-1 border-b border-gray-800/60 tracking-wider">Excertos de Letra:</p>
                                    {evt.audioTrack.lyricsKeySelection.map((line, idx) => (
                                      <p key={idx} className="italic text-amber-100">"{line}"</p>
                                    ))}
                                  </div>
                                </div>

                                <div className="text-xs bg-[#111] p-2.5 border border-gray-850 text-gray-300 leading-relaxed font-sans">
                                  <strong className="text-[#BC0000] font-bold">Impacto Militar:</strong> {evt.audioTrack.importance}
                                </div>
                              </div>
                            )}

                          </div>
                        )}

                      </div>
                    </div>
                  );
                })
              )}

            </div>

          </div>
        )}

        {/* ================= SECTION: CRONISTAS / CAPITÃES ================= */}
        {activeTab === 'capitaes' && (
          <div id="section_capitaes" className="space-y-6 animate-fade-in">
            
            {/* Introductory text */}
            <div className="bg-white p-6 rounded-none border-4 border-black shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] mb-6 flex flex-col md:flex-row items-center gap-6">
              <div className="p-4 bg-red-50 border-2 border-black text-[#BC0000] text-center">
                <UsersIcon className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-black text-2xl text-[#1A1A1A] uppercase tracking-wider">
                  Mesa de Honra do Movimento dos Capitães
                </h3>
                <p className="font-serif text-sm text-gray-800 leading-relaxed">
                  Conhece os operacionais e estrategistas do MFA (Movimento das Forças Armadas) que arriscaram as suas vidas e as suas patentes militares para depor a estrutura armada do regime de Salazar e Caetano. Sob a sua asa e através de comunicados ponderados, asseguraram o pacífico curso da redemocratização de Portugal.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Capitães List Directory Panel (Left Side Column) */}
              <div className="lg:col-span-4 space-y-4">
                <span className="text-xs text-gray-600 uppercase tracking-widest font-mono font-bold block mb-1">Escolhe um Capitão:</span>
                
                <div className="space-y-3">
                  {captainsData.map((captain) => (
                    <button
                      key={captain.id}
                      onClick={() => setSelectedCaptainId(captain.id)}
                      className={`w-full text-left p-4 border-2 transition-all duration-150 flex items-center justify-between group rounded-none select-none ${
                        selectedCaptainId === captain.id
                          ? 'bg-[#1A1A1A] text-white border-black shadow-[4px_4px_0px_0px_rgba(188,0,0,1)]'
                          : 'bg-white text-gray-800 border-black hover:bg-[#F9F7F2] shadow-[2px_2px_0px_0px_black]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 flex-shrink-0 flex items-center justify-center font-display font-black border-2 ${
                          selectedCaptainId === captain.id 
                            ? 'bg-[#BC0000] border-white text-white' 
                            : 'bg-gray-100 border-black text-gray-800'
                        }`}>
                          {captain.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs md:text-sm font-black font-sans uppercase tracking-tight">{captain.name}</h4>
                          <span className={`text-[10px] font-mono block uppercase tracking-wider font-bold ${selectedCaptainId === captain.id ? 'text-gray-300' : 'text-gray-500'}`}>
                            {captain.nickname || 'Capitão do MFA'}
                          </span>
                        </div>
                      </div>
                      
                      <span className={`text-xs font-black ${selectedCaptainId === captain.id ? 'text-[#BC0000]' : 'text-gray-500 group-hover:translate-x-1.5'} transition-transform`}>
                        ➔
                      </span>
                    </button>
                  ))}
                </div>

                <div className="bg-[#F9F7F2] p-4 border-2 border-black text-xs text-gray-800 space-y-2 rounded-none shadow-[2px_2px_0px_0px_black]">
                  <span className="font-extrabold block text-gray-900 font-mono uppercase tracking-widest flex items-center gap-1">
                    <BookMarked className="w-4 h-4 text-[#BC0000]" /> Sabias Que?
                  </span>
                  <p className="leading-relaxed font-serif">
                    O Movimento das Forças Armadas (MFA) surgiu inicialmente em 1973 por descontentamento de capitães de carreira em relação a decretos de incorporação corporativa militar. Mas Melo Antunes, Salgueiro Maia e Vasco Lourenço elevaram rapidamente as exigências da união para que o intuito das forças armadas passasse pela restauração da democracia e descolonização.
                  </p>
                </div>
              </div>

              {/* Selected Captain Profile Details Display (Right Column) */}
              <div className="lg:col-span-8 bg-white border-4 border-black shadow-[8px_8px_0px_0px_black] overflow-hidden min-h-[500px] flex flex-col justify-between rounded-none">
                
                {/* Visual Top Block */}
                <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x-2 divide-black">
                  
                  {/* Portrait photo spacer */}
                  <div className="md:col-span-5 bg-gray-50 flex items-center justify-center relative p-4 max-h-[360px] md:max-h-none overflow-hidden">
                    <img 
                      src={selectedCaptain.imageUrl} 
                      alt={selectedCaptain.name}
                      referrerPolicy="no-referrer"
                      className="w-full max-w-[280px] md:max-w-none h-full object-cover border-2 border-black bg-white aspect-square md:aspect-[3/4]" 
                    />
                    <div className="absolute top-6 left-6 bg-black text-[#F9F7F2] border border-black px-2.5 py-1 text-[10px] font-mono font-bold tracking-widest uppercase shadow-sm">
                      {selectedCaptain.birthDeath}
                    </div>
                  </div>

                  {/* Facts list */}
                  <div className="p-6 md:p-8 md:col-span-7 space-y-5">
                    <div className="space-y-1">
                      <span className="text-[10px] text-[#BC0000] uppercase font-mono tracking-widest block font-black">Protagonista de Abril</span>
                      <h3 className="font-display font-black text-2xl text-gray-900 leading-tight uppercase">
                        {selectedCaptain.name}
                      </h3>
                      <p className="text-xs text-gray-600 font-mono font-bold uppercase tracking-wide">
                        {selectedCaptain.role}
                      </p>
                    </div>

                    {/* Historical Quote card */}
                    <div className="bg-[#F9F7F2] border-l-4 border-[#BC0000] border border-gray-400 p-4 relative rounded-none">
                      <Quote className="w-8 h-8 text-black/[0.04] absolute -top-1 -left-1" />
                      <p className="font-serif italic text-xs md:text-sm text-gray-800 leading-relaxed relative z-10 font-medium">
                        "{selectedCaptain.quote}"
                      </p>
                    </div>

                    <div className="space-y-1.5 text-xs text-gray-600">
                      <span className="font-mono font-bold text-gray-800 uppercase tracking-widest block">Resumo de Atuação:</span>
                      <p className="font-serif text-sm leading-relaxed text-gray-800">
                        {selectedCaptain.biography}
                      </p>
                    </div>
                  </div>

                </div>

                {/* Lower Action highlights */}
                <div className="bg-[#FFFDF6] px-6 md:px-8 py-5 border-t-2 border-black">
                  <span className="text-xs text-gray-600 font-mono uppercase tracking-widest block mb-4 font-black">Grandes Feitos na Revolução:</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedCaptain.accomplishments.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 bg-white p-3 border-2 border-black shadow-[3px_3px_0px_0px_black] rounded-none">
                        <CheckCircle2 className="w-5 h-5 text-[#006633] flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-800 font-serif leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ================= SECTION: DEPOIMENTOS ================= */}
        {activeTab === 'testemunhas' && (
          <div id="section_testemunhas" className="space-y-6 animate-fade-in">
            
            <div className="bg-white p-5 border-4 border-black shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-none">
              <div className="space-y-1">
                <h3 className="font-display font-black text-2xl text-[#1A1A1A] uppercase tracking-wider">
                  Sons da Memória: Depoimentos de Quem Viveu
                </h3>
                <p className="text-xs text-gray-600 font-mono font-black uppercase tracking-wide">
                  Testemunhos sinceros, reais e reconstruídos de populares, militares e presos políticos no dia da Revolução de Abril.
                </p>
              </div>

              {/* Selector scroll */}
              <div className="flex flex-wrap gap-2">
                {testimoniesData.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTestimonyId(t.id);
                      setIsTapePlaying(false); // reset typing to default complete text
                    }}
                    className={`px-3 py-1.5 border-2 text-xs font-mono font-bold uppercase transition select-none rounded-none ${
                      selectedTestimonyId === t.id
                        ? 'bg-[#BC0000] text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-white text-gray-700 border-black hover:bg-[#F9F7F2] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                  >
                    {t.name.split(' ')[0]} ({t.occupation.split(' ')[0]})
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Vintage Cassette Deck interface */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Visual Tape Player */}
              <div className="lg:col-span-5 bg-[#1F1F1F] p-6 text-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(188,0,0,1)] flex flex-col justify-between min-h-[380px] rounded-none">
                
                {/* Cassette face details */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-black p-2.5 border border-gray-700 font-mono">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">MEMOREX C-60</span>
                    <span className="text-[10px] text-[#BC0000] font-black">TAPELOG // SIDE A</span>
                  </div>

                  {/* Tape Graphic */}
                  <div className="bg-black border-2 border-dashed border-gray-700 p-4 flex flex-col items-center justify-center space-y-3 relative overflow-hidden">
                    
                    {/* Cassette casing lines */}
                    <div className="h-1 text-[8px] font-mono text-gray-500 block w-full text-center uppercase tracking-widest">Norelco Magnetic Recording Tape</div>
                    
                    {/* The Tape window with turning wheels */}
                    <div className="w-5/6 h-12 bg-[#111] border-2 border-gray-700 p-2 flex items-center justify-between relative">
                      
                      {/* Left spin reel */}
                      <div className="flex items-center gap-1 relative pl-3">
                        <div className={`w-8 h-8 rounded-full border-4 border-dashed border-gray-500 flex items-center justify-center relative ${isTapePlaying ? 'animate-spin-slow' : ''}`}>
                          <div className="w-2.5 h-2.5 bg-black rounded-full border border-gray-600"></div>
                        </div>
                      </div>

                      {/* Translucid magnetic roll graphic */}
                      <div className="absolute inset-y-1.5 left-1/3 right-1/3 border-y border-dashed border-gray-800 bg-amber-950/20 rounded flex items-center justify-center">
                        <span className="text-[8px] font-mono text-gray-600 uppercase font-black">PLAYING</span>
                      </div>

                      {/* Right spin reel */}
                      <div className="flex items-center gap-1 relative pr-3">
                        <div className={`w-8 h-8 rounded-full border-4 border-dashed border-gray-500 flex items-center justify-center relative ${isTapePlaying ? 'animate-spin-slow' : ''}`}>
                          <div className="w-2.5 h-2.5 bg-black rounded-full border border-gray-600"></div>
                        </div>
                      </div>

                    </div>

                    {/* Label of cassette */}
                    <div className="w-11/12 bg-white text-black font-mono font-black text-center border-2 border-black p-1.5 rounded-none uppercase text-xs">
                      <p className="overflow-hidden whitespace-nowrap text-ellipsis max-w-full">
                        📼 {selectedTestimony.name}
                      </p>
                    </div>

                  </div>
                </div>

                {/* Simulated VU level meter visual */}
                {isTapePlaying && (
                  <div className="py-2.5 px-4 bg-black border border-gray-800 text-center font-mono text-xs">
                    <span className="text-green-500 font-black block mb-1 text-[10px]/tight uppercase tracking-wider">Altifalantes do Reprodutor</span>
                    <div className="flex items-end justify-center h-8 gap-0.5">
                      {audioMeterLevels.map((lvl, idx) => (
                        <div 
                          key={idx} 
                          style={{ height: `${lvl}%` }} 
                          className="w-1 bg-green-500 transition-all duration-100"
                        ></div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Audio Deck Analog Controls Buttons Grid */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setIsTapePlaying(!isTapePlaying)}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 font-mono font-black text-xs uppercase transition border-2 rounded-none ${
                        isTapePlaying 
                          ? 'bg-transparent text-[#eccfb5] border-white' 
                          : 'bg-[#006633] hover:bg-green-800 text-white border-black shadow-[2px_2px_0px_0px_black]'
                      }`}
                    >
                      {isTapePlaying ? (
                        <>
                          <Square className="w-3.5 h-3.5 fill-current" /> Pausa Fita
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" /> Tocar
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setIsTapePlaying(false);
                        setTypedNarrative(selectedTestimony.narrative);
                      }}
                      className="w-full bg-[#333] hover:bg-[#444] text-white font-mono font-black py-2 px-3 border-2 border-black rounded-none text-xs uppercase shadow-[2px_2px_0px_0px_black]"
                    >
                      Reiniciar
                    </button>
                  </div>

                  <p className="text-[9px] text-gray-500 font-mono text-center uppercase font-bold tracking-wider">
                    Grave analógico gerado via Web Audio API na ativação
                  </p>
                </div>

              </div>

              {/* Right Column: Narrative Translation transcript journal */}
              <div className="lg:col-span-7 bg-white p-6 md:p-8 border-4 border-black shadow-[8px_8px_0px_0px_black] flex flex-col justify-between rounded-none">
                <div>
                  
                  {/* Speaker facts title block */}
                  <div className="flex justify-between items-start border-b-2 border-dashed border-gray-300 pb-4 mb-4">
                    <div className="space-y-1">
                      <span className="text-xs text-[#BC0000] font-mono uppercase bg-red-50 border border-[#BC0000] font-black px-2.5 py-0.5 rounded-none">
                        {selectedTestimony.vibe.toUpperCase()}
                      </span>
                      <h4 className="font-display font-black text-xl text-gray-900 uppercase tracking-tight pt-1.5">{selectedTestimony.name}</h4>
                      
                      <div className="flex flex-wrap items-center gap-1.5 md:gap-3 text-xs text-gray-600 font-serif font-semibold pt-1">
                        <span>Idade em 1974: {selectedTestimony.ageIn1974} anos</span>
                        <span className="hidden sm:inline">•</span>
                        <span>Profissão: {selectedTestimony.occupation}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-[#BC0000]" /> {selectedTestimony.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Typing Notebook Sheet */}
                  <div className="font-serif text-sm md:text-base text-gray-800 leading-relaxed bg-[#F9F7F2] p-5 border-2 border-black font-serif italic min-h-[220px] rounded-none shadow-sm">
                    <span className="text-3xl text-gray-400 pointer-events-none mb-1 block">“</span>
                    {typedNarrative}
                    <span className="text-green-600 animate-pulse font-black ml-1">_</span>
                  </div>

                </div>

                {/* Simulated Tape Clip description quote box */}
                {selectedTestimony.audioClipText && (
                  <div className="mt-5 bg-[#1A1A1A] text-[#F9F7F2] p-4 border-2 border-black shadow-[4px_4px_0_0_black] rounded-none text-left font-sans text-xs flex gap-3 items-center">
                    <span className="text-2xl flex-shrink-0">🎙️</span>
                    <div className="space-y-0.5">
                      <span className="font-mono text-[9px] text-amber-300 uppercase block font-black">Destaque de Áudio Transcrito:</span>
                      <p className="italic font-serif leading-relaxed text-gray-100">
                        "{selectedTestimony.audioClipText}"
                      </p>
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

        {/* ================= SECTION: GALERIA DE FOTOS HISTÓRICAS ================= */}
        {activeTab === 'galeria' && (
          <div id="section_galeria" className="space-y-6 animate-fade-in">
            
            {/* Header Text */}
            <div className="bg-white p-5 border-4 border-black shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 rounded-none border-t-4 border-t-[#BC0000]">
              <div className="space-y-1">
                <h3 className="font-display font-black text-2xl text-[#1A1A1A] uppercase tracking-wider">
                  Arquivo Fotográfico de Abril
                </h3>
                <p className="text-xs text-gray-650 font-mono font-bold uppercase tracking-wide">
                  Imagens fotográficas da revolução. Filtra para descobrir diferentes perspetivas históricas.
                </p>
              </div>

              {/* Tag filters selector */}
              <div className="flex flex-wrap items-center gap-1 border-2 border-black p-1 bg-[#fafafa] rounded-none">
                <button
                  onClick={() => setActiveGalleryTag('all')}
                  className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition select-none rounded-none ${
                    activeGalleryTag === 'all' ? 'bg-[#BC0000] text-white border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]' : 'text-gray-700 hover:bg-[#F9F7F2]'
                  }`}
                >
                  Todas
                </button>
                <button
                  onClick={() => setActiveGalleryTag('ruas')}
                  className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition select-none rounded-none ${
                    activeGalleryTag === 'ruas' ? 'bg-[#BC0000] text-white border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]' : 'text-gray-700 hover:bg-[#F9F7F2]'
                  }`}
                >
                  Rua e Povo
                </button>
                <button
                  onClick={() => setActiveGalleryTag('militar')}
                  className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition select-none rounded-none ${
                    activeGalleryTag === 'militar' ? 'bg-[#BC0000] text-white border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]' : 'text-gray-700 hover:bg-[#F9F7F2]'
                  }`}
                >
                  Movimento Militar
                </button>
                <button
                  onClick={() => setActiveGalleryTag('simbolos')}
                  className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition select-none rounded-none ${
                    activeGalleryTag === 'simbolos' ? 'bg-[#BC0000] text-white border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]' : 'text-gray-700 hover:bg-[#F9F7F2]'
                  }`}
                >
                  Símbolos
                </button>
                <button
                  onClick={() => setActiveGalleryTag('celebracoes')}
                  className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition select-none rounded-none ${
                    activeGalleryTag === 'celebracoes' ? 'bg-[#BC0000] text-white border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]' : 'text-gray-700 hover:bg-[#F9F7F2]'
                  }`}
                >
                  Celebrações
                </button>
              </div>
            </div>

            {/* Photo Grid list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPhotos.map((photo) => (
                <div 
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_black] hover:shadow-[8px_8px_0px_0px_black] overflow-hidden hover:-translate-y-1 transition duration-150 group cursor-pointer rounded-none"
                >
                  <div className="h-48 relative overflow-hidden bg-gray-100 border-b-2 border-black">
                    <img 
                      src={photo.imageUrl} 
                      alt={photo.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-305 grayscale group-hover:grayscale-0" 
                    />
                    <div className="absolute top-3 left-3 bg-black border border-white text-white px-2 py-0.5 rounded-none text-[9px] uppercase font-mono font-black tracking-widest leading-none">
                      {photo.category}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <span className="text-[9px] bg-[#BC0000]/10 text-[#BC0000] border border-[#BC0000]/30 font-mono px-2 py-0.5 font-bold uppercase tracking-wider">HISTORIC PHOTO</span>
                    <h4 className="font-sans font-black text-[#1A1A1A] text-lg group-hover:text-[#BC0000] transition uppercase leading-tight">
                      {photo.title}
                    </h4>
                    <p className="text-xs text-gray-700 font-serif leading-relaxed line-clamp-2">
                      {photo.description}
                    </p>

                    <div className="flex md:flex justify-between items-center text-[10px] text-gray-700 font-mono pt-2.5 border-t-2 border-dashed border-gray-300">
                      <span className="font-bold">ANO: 1974</span>
                      {photo.location && (
                        <span className="flex items-center gap-1 font-bold">
                          <MapPin className="w-3 h-3 text-[#BC0000]" /> {photo.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Lightbox Modal display */}
            {selectedPhoto && (
              <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 md:p-10 animate-fade-in text-white overflow-y-auto">
                
                {/* Close trigger button */}
                <button 
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-4 right-4 text-white hover:text-red-500 p-2.5 bg-black border-2 border-white rounded-none hover:border-red-500 transition duration-150 z-55 shadow-[3px_3px_0_0_black]"
                  title="Fechar galeria"
                >
                  <X className="w-6 h-6 stroke-[3]" />
                </button>

                {/* Prev layout trigger button */}
                <button 
                  onClick={() => handleNavigatePhoto('prev')}
                  className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-white hover:text-[#BC0000] p-3 bg-black border-2 border-white rounded-none transition hover:-translate-x-1 duration-150 z-55 shadow-[3px_3px_0_0_black]"
                  title="Fotografia anterior"
                >
                  <ChevronLeft className="w-6 h-6 stroke-[3]" />
                </button>

                {/* Main responsive presentation card */}
                <div className="bg-white text-black border-4 border-black max-w-4xl w-full overflow-hidden flex flex-col md:grid md:grid-cols-12 max-h-[90vh] md:max-h-none shadow-[8px_8px_0px_0px_rgba(188,0,0,1)] rounded-none">
                  
                  {/* Visual portion */}
                  <div className="md:col-span-7 bg-[#1A1A1A] flex items-center justify-center min-h-[250px] md:min-h-none align-middle relative p-4 border-b-2 md:border-b-0 md:border-r-2 border-black">
                    <img 
                      src={selectedPhoto.imageUrl} 
                      alt={selectedPhoto.title}
                      referrerPolicy="no-referrer"
                      className="max-w-full max-h-[45vh] md:max-h-[65vh] object-contain border-2 border-black bg-white p-1" 
                    />
                  </div>

                  {/* Context presentation info */}
                  <div className="md:col-span-5 p-6 md:p-8 flex flex-col justify-between space-y-6 overflow-y-auto bg-[#F9F7F2]">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[#BC0000] uppercase tracking-widest block font-black">Arquivo Nacional de Fotografia</span>
                        <h3 className="font-display font-black text-xl leading-tight text-gray-900 uppercase tracking-tight">{selectedPhoto.title}</h3>
                      </div>

                      <p className="font-serif italic text-xs md:text-sm text-gray-800 leading-relaxed border-l-4 border-[#BC0000] bg-white border border-gray-300 p-3 shadow-xs">
                        "{selectedPhoto.description}"
                      </p>

                      <div className="space-y-2 text-xs text-gray-800 font-mono bg-white p-3 border-2 border-black shadow-[2px_2px_0_0_black]">
                        <div className="flex justify-between border-b border-gray-100 pb-1">
                          <span>📅 Período:</span>
                          <strong className="text-black uppercase">25 de Abril de /74</strong>
                        </div>
                        {selectedPhoto.location && (
                          <div className="flex justify-between items-center border-b border-gray-100 pb-1">
                            <span>📍 Coordenadas/Local:</span>
                            <span className="text-black font-bold uppercase tracking-wide truncate max-w-[150px]">{selectedPhoto.location}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>🏷️ Categoria de Registo:</span>
                          <span className="text-[#BC0000] uppercase font-bold text-right">{selectedPhoto.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t-2 border-dashed border-black pt-4 text-center">
                      <p className="text-[9px] text-gray-650 font-mono uppercase font-bold tracking-wider">
                        Usa as setas das margens para navegar.
                      </p>
                    </div>
                  </div>

                </div>

                {/* Next layout trigger button */}
                <button 
                  onClick={() => handleNavigatePhoto('next')}
                  className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-white hover:text-[#BC0000] p-3 bg-black border-2 border-white rounded-none transition hover:translate-x-1 duration-150 z-55 shadow-[3px_3px_0_0_black]"
                  title="Próxima fotografia"
                >
                  <ChevronRight className="w-6 h-6 stroke-[3]" />
                </button>

              </div>
            )}

          </div>
        )}

        {/* ================= SECTION: QUIZ DE ABRIL ================= */}
        {activeTab === 'quiz' && (
          <div id="section_quiz" className="space-y-6 animate-fade-in max-w-3xl mx-auto">
            
            {/* Header info card */}
            <div className="bg-white p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] flex flex-col sm:flex-row items-center gap-6 rounded-none">
              <div className="p-4 bg-amber-50 border-2 border-black text-amber-500 text-center flex-shrink-0">
                <Sparkles className="w-10 h-10" />
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="font-display font-black text-2xl text-[#1A1A1A] uppercase tracking-wider">
                  Quiz Histórico: Testa o Teu Conhecimento!
                </h3>
                <p className="text-xs text-gray-700 font-serif leading-relaxed">
                  Quão bem conheces as senhas da rádio, os capitães implicados e os cenários célebres do Largo do Carmo e Rossio? Responde a estas 5 perguntas interativas para ver a tua pontuação!
                </p>
              </div>
            </div>

            {/* Questions Container Grid */}
            <div className="space-y-6">
              {quizQuestions.map((item, questIdx) => {
                const selectedOption = quizAnswers[questIdx];
                const isCorrect = selectedOption === item.correct;
                
                return (
                  <div key={questIdx} className="bg-white p-5 md:p-6 border-4 border-black shadow-[4px_4px_0px_0px_black] space-y-4 rounded-none">
                    <div className="flex items-start gap-3">
                      <span className="bg-black text-white w-6 h-6 rounded-none flex items-center justify-center font-mono text-xs font-black border-2 border-black mt-0.5 flex-shrink-0">
                        {questIdx + 1}
                      </span>
                      <h4 className="font-display font-black text-[#1A1A1A] text-base md:text-lg leading-snug uppercase tracking-tight">
                        {item.q}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-9">
                      {item.options.map((opt, optIdx) => {
                        let btnStyle = 'bg-white border-2 border-black hover:bg-[#F9F7F2] text-gray-800 shadow-[2px_2px_0px_0px_black]';
                        
                        // Option state highlights after submission
                        if (quizAnswers[questIdx] === optIdx) {
                          btnStyle = 'bg-[#1A1A1A] text-white border-black shadow-[2px_2px_0px_0px_rgba(188,0,0,1)] font-bold';
                        }
                        
                        if (quizSubmitted) {
                          if (optIdx === item.correct) {
                            btnStyle = 'bg-[#006633] text-white border-2 border-black font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_black]';
                          } else if (quizAnswers[questIdx] === optIdx && !isCorrect) {
                            btnStyle = 'bg-[#BC0000] text-white border-2 border-black shadow-[2px_2px_0px_0px_black] font-bold';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={quizSubmitted}
                            onClick={() => handleQuizOption(questIdx, optIdx)}
                            className={`w-full text-left p-3 text-xs leading-normal transition-all duration-75 select-none rounded-none font-sans font-medium uppercase tracking-tight ${btnStyle}`}
                          >
                            <span className="font-mono font-black text-xs mr-1">{String.fromCharCode(65 + optIdx)})</span> {opt}
                          </button>
                        );
                      })}
                    </div>

                    {/* Formatted correction description card */}
                    {quizSubmitted && (
                      <div className="pl-9 animate-fade-in">
                        <div className={`p-4 border-2 border-dashed border-black font-serif leading-relaxed rounded-none ${isCorrect ? 'bg-green-50/70 text-gray-900 border-green-650' : 'bg-red-50/70 text-gray-900 border-red-650'}`}>
                          <p className="font-black flex items-center gap-1.5 mb-1 text-xs uppercase tracking-wider font-mono">
                            {isCorrect ? '✓ Excelente! Correto.' : '✗ Incorreto — A resposta certa é a ' + String.fromCharCode(65 + item.correct)}
                          </p>
                          <p className="text-gray-800 text-xs leading-relaxed font-serif font-medium">{item.explanation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit & Reset actions layout */}
            <div className="bg-white p-6 border-4 border-black shadow-[6px_6px_0px_0px_black] flex flex-col sm:flex-row justify-between items-center gap-4 text-center rounded-none border-t-4 border-t-[#006633]">
              
              {!quizSubmitted ? (
                <>
                  <p className="text-xs text-gray-600 font-mono font-bold uppercase tracking-wider">
                    {Object.keys(quizAnswers).length} de {quizQuestions.length} perguntas sintonizadas.
                  </p>
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                    className={`px-6 py-2.5 font-mono font-black text-xs uppercase tracking-widest transition-all duration-150 rounded-none border-2 ${
                      Object.keys(quizAnswers).length < quizQuestions.length
                        ? 'bg-gray-250 text-gray-500 border-gray-400 cursor-not-allowed opacity-60'
                        : 'bg-[#BC0000] hover:bg-red-800 text-white border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                  >
                    Submeter Respostas
                  </button>
                </>
              ) : (
                <>
                  <div className="text-left space-y-1">
                    <h4 className="font-display font-black text-[#1A1A1A] text-lg uppercase">
                      O Teu Resultado de Abril
                    </h4>
                    <p className="text-xs text-gray-700 font-serif">
                      Acertaste em <strong className="text-[#BC0000] text-base font-mono font-black">{quizScore}</strong> de um total de {quizQuestions.length} perguntas no quiz.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <span className="text-xs px-3 py-1 bg-amber-50 border-2 border-black font-mono font-black uppercase text-amber-800 tracking-wider">
                      {quizScore === 5 ? '🏆 Historiador de Abril Excelso!' : 
                       quizScore >= 3 ? '👌 Excelente saber!' : '📚 Estuda os registos de rádio!'}
                    </span>
                    <button
                      onClick={handleResetQuiz}
                      className="flex items-center gap-1.5 bg-black hover:bg-gray-800 text-white font-mono font-bold px-4 py-2 border-2 border-black rounded-none text-xs transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase select-none"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Recomeçar
                    </button>
                  </div>
                </>
              )}

            </div>

          </div>
        )}

      </main>

      {/* Persistent bottom floral bar info */}
      <footer className="mt-16 border-t-4 border-black py-8 text-center text-slate-500 text-xs px-4 max-w-7xl mx-auto w-full">
        <div className="flex justify-center items-center gap-3 mb-3 select-none">
          <span className="text-xl">🌺</span>
          <span className="text-2xl font-display font-black tracking-widest text-[#BC0000]">
            "25 DE ABRIL, SEMPRE!"
          </span>
          <span className="text-xl">🌺</span>
        </div>
        <p className="text-xs font-serif font-semibold italic text-gray-700 leading-normal max-w-lg mx-auto bg-[#F9F7F2] p-4 border border-gray-300 rounded-none shadow-sm">
          "O povo é quem mais ordena, dentro de ti, ó cidade." — Zeca Afonso hino dos cravos vermelhos da paz. Desenvolvido para reviver as memórias primas da democracia lusa.
        </p>
        <p className="text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest mt-4">
          © 1974 - {new Date().getFullYear()} • Arquivos Democráticos de Portugal • Todos os direitos reservados.
        </p>
      </footer>

    </div>
  );
}

// Easy fallback replacement for missing Lucide icon if necessary
function UsersIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
