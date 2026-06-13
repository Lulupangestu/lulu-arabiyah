import React, { useState, useEffect } from 'react';
import { 
  BookOpen, User, Volume2, 
  Flame, Trophy, BookMarked, CheckCircle2, 
  XCircle, ChevronRight, PlayCircle, RefreshCw,
  Sparkles, Lock, Check, Milestone
} from 'lucide-react';

// --- DEFINISI TYPE UNTUK TYPESCRIPT ---
interface VocabItem {
  arabic: string;
  latin: string;
  meaning: string;
}

interface QuizItem {
  question: string;
  options: string[];
  correctAnswer: number;
  xpReward: number;
}

interface LessonItem {
  id: number;
  title: string;
  desc: string;
  xpReward: number;
  isCompleted: boolean;
}

interface AchievementItem {
  id: number;
  title: string;
  icon: string;
  isUnlocked: boolean;
  desc: string;
}

const App: React.FC = () => {
  // --- STATE SYSTEM ---
  const [activeTab, setActiveTab] = useState<string>('level');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showMeaning, setShowMeaning] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentLevel, setCurrentLevel] = useState<number>(3);
  const [xp, setXp] = useState<number>(90); 
  const [streak] = useState<number>(7); 

  // --- DATABASE KOSAKATA INTERNAL ---
  const databaseOtomatis: VocabItem[] = [
    { arabic: "مَرْحَبًا", latin: "Marhaban", meaning: "Halo / Selamat Datang" },
    { arabic: "شُكْرًا", latin: "Syukran", meaning: "Terima kasih" },
    { arabic: "عَفْوًا", latin: "'Afwan", meaning: "Sama-sama / Maaf" },
    { arabic: "كِتَابٌ", latin: "Kitaabun", meaning: "Buku" },
    { arabic: "قَلَمٌ", latin: "Qalamun", meaning: "Pena / Pulpen" },
    { arabic: "بَيْتٌ", latin: "Baitun", meaning: "Rumah" },
    { arabic: "مَدْرَسَةٌ", latin: "Madrasatun", meaning: "Sekolah" },
    { arabic: "مَسْجِدٌ", latin: "Masjidun", meaning: "Masjid" },
    { arabic: "أَنَا", latin: "Ana", meaning: "Saya" },
    { arabic: "أَنْتَ", latin: "Anta", meaning: "Kamu (Laki-laki)" },
    { arabic: "أَنْتِ", latin: "Anti", meaning: "Kamu (Perempuan)" },
    { arabic: "هِىَ", latin: "Hiya", meaning: "Dia (Perempuan)" }
  ];

  const [currentVocab, setCurrentVocab] = useState<VocabItem>(databaseOtomatis[0]);

  // --- DATABASE KUIS ---
  const quizPool: QuizItem[] = [
    {
      question: "Apa arti dari kata 'شُكْرًا' (Syukran)?",
      options: ["Sama-sama", "Terima Kasih", "Maaf", "Tolong"],
      correctAnswer: 1,
      xpReward: 50
    },
    {
      question: "Apa bahasa Arab dari kata 'Buku'?",
      options: ["قَلَمٌ (Qalamun)", "بَيْتٌ (Baitun)", "كِتَابٌ (Kitaabun)", "مَسْجِدٌ (Masjidun)"],
      correctAnswer: 2,
      xpReward: 60
    }
  ];

  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const currentQuiz = quizPool[currentQuizIndex];

  // --- DATABASE PETA BELAJAR ---
  const roadmapLessons: LessonItem[] = [
    { id: 1, title: "Huruf Hijaiyah", desc: "28 huruf dasar", xpReward: 50, isCompleted: true },
    { id: 2, title: "Harakat & Cara Baca", desc: "Fathah, kasrah, dhammah", xpReward: 60, isCompleted: true },
    { id: 3, title: "Kosakata Dasar (Benda)", desc: "50 kata benda umum", xpReward: 80, isCompleted: true },
    { id: 4, title: "Isim & Fi'il", desc: "Kata benda & kata kerja", xpReward: 100, isCompleted: false },
    { id: 5, title: "Kata Ganti (Dhamir)", desc: "Ana, anta, huwa...", xpReward: 100, isCompleted: false },
    { id: 6, title: "Kalimat Sederhana", desc: "Jumlah ismiyah & filiyah", xpReward: 120, isCompleted: false }
  ];

  // --- DATABASE PENCAPAIAN ---
  const achievements: AchievementItem[] = [
    { id: 1, title: "Pemula Hebat", icon: "⭐", isUnlocked: true, desc: "Memulai petualangan" },
    { id: 2, title: "7 Hari Streak", icon: "🔥", isUnlocked: true, desc: "Belajar 7 hari rutin" },
    { id: 3, title: "Baca 10 Materi", icon: "📖", isUnlocked: true, desc: "Membaca materi dasar" },
    { id: 4, title: "Hafal 100 Kata", icon: "🧠", isUnlocked: false, desc: "Kuasai kata baru" }
  ];

  useEffect(() => {
    if (xp >= 500 && currentLevel === 3) {
      setCurrentLevel(4);
    }
  }, [xp, currentLevel]);

  const fetchOtomatisKosakata = () => {
    setIsLoading(true);
    setShowMeaning(false);
    setTimeout(() => {
      const acak = databaseOtomatis[Math.floor(Math.random() * databaseOtomatis.length)];
      setCurrentVocab(acak);
      setIsLoading(false);
      setXp(prev => Math.min(500, prev + 2));
    }, 400);
  };

  const handleQuizAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    const correct = index === currentQuiz.correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      setXp(prev => Math.min(500, prev + currentQuiz.xpReward));
    }
  };

  const nextQuiz = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setCurrentQuizIndex((prev) => (prev + 1) % quizPool.length);
  };

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentVocab.arabic);
      utterance.lang = 'ar-SA';
      window.speechSynthesis.speak(utterance);
    } else {
      alert("🔊 Pengucapan: " + currentVocab.arabic);
    }
  };

  return (
    <div className="min-h-screen bg-[#111613] text-gray-100 font-sans pb-10">
      {/* HEADER BAR */}
      <header className="bg-[#111613] border-b border-[#1f2823] p-4 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-emerald-500 font-bold text-2xl">🌱</span>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold tracking-wider leading-tight text-white">
                Seltuju Arabiyah
              </h1>
              <span className="text-[9px] font-arabic text-emerald-500 tracking-wider" dir="rtl">صلتوجو عربية</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-[#1b4332] text-[#34d399] border border-[#2d6a4f] rounded-full px-3.5 py-1 flex items-center gap-1.5 text-xs font-semibold shadow-inner">
              <Sparkles size={14} className="text-yellow-400 animate-pulse" />
              <span>{xp} XP</span>
            </div>
            <div className="w-9 h-9 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm border border-emerald-400">
              AK
            </div>
          </div>
        </div>
      </header>

      {/* TABS MENU */}
      <div className="max-w-2xl mx-auto px-4 pt-4">
        <div className="grid grid-cols-4 gap-1 bg-[#19221d] p-1.5 rounded-xl border border-[#232f28]">
          {['level', 'materi', 'kuis', 'profil'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs capitalize transition-all ${activeTab === tab ? 'bg-[#203229] text-[#34d399] font-bold border border-[#2e4c3d]' : 'text-gray-400 hover:text-white'}`}
            >
              {tab === 'level' && <Milestone size={18} className="mb-1" />}
              {tab === 'materi' && <BookOpen size={18} className="mb-1" />}
              {tab === 'kuis' && <PlayCircle size={18} className="mb-1" />}
              {tab === 'profil' && <User size={18} className="mb-1" />}
              <span>{tab}</span>
            </button>
          ))}
        </div>
      </div>

      {/* DYNAMIC WINDOW */}
      <main className="max-w-2xl mx-auto p-4 space-y-6">
        {activeTab === 'level' && (
          <div className="space-y-6">
            <section className="bg-[#1a2e24] border border-[#244b39] rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden">
              <div className="w-14 h-14 bg-emerald-600 rounded-full flex flex-col items-center justify-center text-white border-4 border-[#2c3d35] flex-shrink-0">
                <span className="text-xl font-extrabold leading-tight">{currentLevel}</span>
                <span className="text-[8px] uppercase tracking-wider font-bold">Level</span>
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="text-md font-bold text-white">Mutawassit — Menengah</h3>
                <div className="flex justify-between items-center text-xs text-[#a3b899]">
                  <span>{xp} / 500 XP menuju Level 4</span>
                </div>
                <div className="w-full bg-[#13221b] rounded-full h-2.5 overflow-hidden">
                  <div className="bg-[#34d399] h-2.5 rounded-full transition-all duration-500" style={{ width: `${(xp / 500) * 100}%` }}></div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#18201b] border border-[#222b24] p-3.5 rounded-xl text-center">
                <span className="block text-2xl font-black text-white">15</span>
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Pelajaran</span>
              </div>
              <div className="bg-[#18201b] border border-[#222b24] p-3.5 rounded-xl text-center text-orange-400 flex flex-col items-center justify-center">
                <span className="text-2xl font-black flex items-center gap-1"><Flame size={20} /> {streak}</span>
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Streak</span>
              </div>
              <div className="bg-[#18201b] border border-[#222b24] p-3.5 rounded-xl text-center">
                <span className="block text-2xl font-black text-emerald-400">57</span>
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Kata</span>
              </div>
            </div>

            <section className="bg-[#151c18] border border-[#1f2822] rounded-2xl p-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">👑 Pencapaian</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {achievements.map((ach) => (
                  <div key={ach.id} className={`p-3 rounded-xl border text-center ${ach.isUnlocked ? 'bg-[#1b2b21] border-[#294233] text-emerald-200' : 'bg-[#121714] border-[#1b231e] text-gray-600 opacity-60'}`}>
                    <div className="text-2xl mb-1.5">{ach.isUnlocked ? ach.icon : <Lock size={18} className="mx-auto" />}</div>
                    <p className="text-[11px] font-bold truncate">{ach.title}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-[#151c18] border border-[#1f2822] rounded-2xl p-5">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">🗺️ Peta Belajar</h4>
              <div className="relative pl-8 space-y-6 before:content-[''] before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[3px] before:bg-[#202d25]">
                {roadmapLessons.map((lesson) => (
                  <div key={lesson.id} className="relative group">
                    <div className={`absolute -left-[31px] top-1 w-[21px] h-[21px] rounded-full border-4 flex items-center justify-center ${lesson.isCompleted ? 'bg-emerald-500 border-[#151c18]' : 'bg-[#151c18] border-[#2c3d33]'}`}>
                      {lesson.isCompleted && <Check size={10} className="stroke-[4px] text-black" />}
                    </div>
                    <div className="p-4 bg-[#18221c] border border-[#223127] rounded-xl flex justify-between items-center">
                      <div>
                        <h5 className="font-bold text-sm text-white">{lesson.title}</h5>
                        <p className="text-[11px] text-gray-500 mt-0.5">{lesson.desc}</p>
                      </div>
                      <span className="text-[10px] bg-[#1e2d25] text-emerald-400 border border-[#2d4438] px-2 py-0.5 rounded-full font-bold">+{lesson.xpReward} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'materi' && (
          <div className="space-y-6">
            <div className="bg-[#151c18] border border-[#1f2822] rounded-2xl p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-bold text-white flex items-center gap-1.5"><BookOpen size={18} /> Kosakata Dasar</h3>
                <button onClick={fetchOtomatisKosakata} className="flex items-center space-x-1 text-xs font-bold text-emerald-400 bg-[#1a2d23] border border-[#2c4c3b] px-3.5 py-2 rounded-xl">
                  <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                  <span>Acak Kata</span>
                </button>
              </div>
              <div className="bg-gradient-to-br from-[#1b3f2f] to-[#142f23] rounded-2xl p-10 text-center cursor-pointer border border-[#255841] relative min-h-[180px] flex flex-col justify-center items-center" onClick={() => setShowMeaning(!showMeaning)}>
                <button onClick={playAudio} className="absolute top-4 right-4 bg-white/10 p-2.5 rounded-full text-emerald-300"><Volume2 size={20} /></button>
                {isLoading ? (
                  <p className="text-sm animate-pulse text-emerald-400">Memuat...</p>
                ) : !showMeaning ? (
                  <>
                    <h2 className="text-5xl font-arabic font-extrabold mb-4 text-white" dir="rtl">{currentVocab.arabic}</h2>
                    <p className="text-emerald-300 text-lg font-semibold">{currentVocab.latin}</p>
                  </>
                ) : (
                  <>
                    <h2 className="text-3xl font-extrabold text-white mb-2">{currentVocab.meaning}</h2>
                    <p className="text-emerald-300 text-sm">({currentVocab.latin})</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'kuis' && (
          <div className="space-y-6">
            <section className="bg-[#151c18] border border-[#1f2822] rounded-2xl p-5">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#202c24]">
                <h3 className="text-md font-bold text-white flex items-center gap-2"><PlayCircle size={20} /> Kuis Cepat</h3>
                <span className="text-xs text-emerald-400 font-bold bg-[#1d2d24] px-2.5 py-1 rounded-full">+{currentQuiz.xpReward} XP</span>
              </div>
              <p className="text-gray-200 font-semibold text-lg mb-5 text-center p-4 bg-[#18211c] rounded-xl">{currentQuiz.question}</p>
              <div className="space-y-3">
                {currentQuiz.options.map((option, index) => {
                  let btnStyle = "bg-[#18211c] border-[#26352c] text-gray-300";
                  let Icon = null;
                  if (selectedAnswer !== null) {
                    if (index === currentQuiz.correctAnswer) {
                      btnStyle = "bg-[#1e4620] border-[#34d399] text-white";
                      Icon = <CheckCircle2 className="text-[#34d399]" size={20} />;
                    } else if (index === selectedAnswer && !isCorrect) {
                      btnStyle = "bg-[#541e1e] border-red-500 text-white";
                      Icon = <XCircle className="text-red-400" size={20} />;
                    } else {
                      btnStyle = "bg-[#121714] border-[#1b231f] opacity-40";
                    }
                  }
                  return (
                    <button key={index} onClick={() => handleQuizAnswer(index)} disabled={selectedAnswer !== null} className={`w-full p-4 rounded-xl border text-left font-medium flex justify-between items-center ${btnStyle}`}>
                      <span>{option}</span>{Icon}
                    </button>
                  );
                })}
              </div>
              {selectedAnswer !== null && (
                <button onClick={nextQuiz} className="w-full bg-[#10b981] text-white mt-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold">
                  <span>Soal Berikutnya</span><ChevronRight size={16} />
                </button>
              )}
            </section>
          </div>
        )}

        {activeTab === 'profil' && (
          <div className="space-y-6">
            <section className="bg-[#151c18] border border-[#1f2822] rounded-2xl p-6 text-center">
              <div className="w-20 h-20 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-3xl mx-auto mb-3">AK</div>
              <h3 className="text-xl font-bold text-white">Anas Khalid</h3>
              <p className="text-xs text-gray-500 font-semibold">User Premium Seltuju</p>
            </section>
            <section className="bg-[#151c18] border border-[#1f2822] rounded-2xl p-5">
              <h3 className="font-bold flex items-center mb-4 text-white text-sm uppercase"><Trophy className="mr-2 text-yellow-500" size={18} /> Peringkat Seltuju</h3>
              <div className="space-y-3">
                {[
                  { rank: 1, name: "Ahmad", points: 2100, isSelf: false },
                  { rank: 2, name: "Siti", points: 1850, isSelf: false },
                  { rank: 3, name: "Anas Khalid (Kamu)", points: 1200 + xp, isSelf: true }
                ].map((u) => (
                  <div key={u.rank} className={`flex items-center justify-between p-3 rounded-xl border ${u.isSelf ? 'bg-[#1b3124] border-[#294c36]' : 'bg-[#19211d] border-[#243029]'}`}>
                    <span className="text-xs font-bold text-gray-300">#{u.rank} {u.name}</span>
                    <span className="text-xs font-bold text-gray-400">{u.points} XP</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;