import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Check, X, Trophy, Clock, Users, Utensils } from 'lucide-react';

const ThanksgivingCharades = () => {
  // --- Game Data ---
  const WORD_LIST = [
    { phrase: "Stuffing the Turkey", category: "Action" },
    { phrase: "Pumpkin Pie", category: "Food" },
    { phrase: "Mashed Potatoes", category: "Food" },
    { phrase: "Watching Football", category: "Activity" },
    { phrase: "Black Friday Shopping", category: "Activity" },
    { phrase: "The Mayflower", category: "History" },
    { phrase: "A Pilgrim", category: "Person" },
    { phrase: "Cornucopia", category: "Object" },
    { phrase: "Raking Leaves", category: "Action" },
    { phrase: "Food Coma", category: "Feeling" },
    { phrase: "Saying Grace", category: "Action" },
    { phrase: "Breaking the Wishbone", category: "Tradition" },
    { phrase: "Cranberry Sauce", category: "Food" },
    { phrase: "Macy's Day Parade", category: "Event" },
    { phrase: "Family Argument", category: "Situation" },
    { phrase: "Leftovers Sandwich", category: "Food" },
    { phrase: "Hot Apple Cider", category: "Drink" },
    { phrase: "Gobbling Like a Turkey", category: "Action" },
    { phrase: "Setting the Table", category: "Chore" },
    { phrase: "Carving the Bird", category: "Action" },
    { phrase: "Native American", category: "Person" },
    { phrase: "Harvest Moon", category: "Nature" },
    { phrase: "Scarecrow", category: "Object" },
    { phrase: "Playing Tag Football", category: "Activity" },
    { phrase: "Burning the Rolls", category: "Situation" },
    { phrase: "Pecan Pie", category: "Food" },
    { phrase: "Gravy Boat", category: "Object" },
    { phrase: "Sweet Potato Casserole", category: "Food" },
    { phrase: "Unbuckling Your Belt", category: "Action" },
    { phrase: "Kids' Table", category: "Place" },
    { phrase: "Green Bean Casserole", category: "Food" },
    { phrase: "Falling Asleep on the Couch", category: "Action" },
    { phrase: "Turkey Trot", category: "Event" },
    { phrase: "Plymouth Rock", category: "Place" },
    { phrase: "Corn on the Cob", category: "Food" },
    { phrase: "Roasting Marshmallows", category: "Action" },
    { phrase: "Autumn Breeze", category: "Nature" },
    { phrase: "Hand Turkey Drawing", category: "Art" }
  ];

  // --- State ---
  const [gameState, setGameState] = useState('menu'); 
  const [teams, setTeams] = useState([
    { name: "Team Pumpkin", score: 0, color: "bg-orange-100 text-orange-800 border-orange-300" },
    { name: "Team Turkey", score: 0, color: "bg-amber-100 text-amber-800 border-amber-300" }
  ]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [roundDuration, setRoundDuration] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [deck, setDeck] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [turnScore, setTurnScore] = useState(0);
  const [winningScore, setWinningScore] = useState(50); 

  const timerRef = useRef(null);

  // --- Helpers ---
  const shuffleDeck = () => {
    const shuffled = [...WORD_LIST].sort(() => 0.5 - Math.random());
    setDeck(shuffled);
  };

  const startGame = () => {
    shuffleDeck();
    setTeams([
        { name: "Team Pumpkin", score: 0, color: "bg-orange-100 text-orange-800 border-orange-300" },
        { name: "Team Turkey", score: 0, color: "bg-amber-100 text-amber-800 border-amber-300" }
    ]);
    setCurrentTeamIndex(0);
    setGameState('prep');
  };

  const startTurn = () => {
    setTimeLeft(roundDuration);
    setTurnScore(0);
    nextCard();
    setGameState('playing');
  };

  const nextCard = () => {
    if (deck.length === 0) {
      shuffleDeck(); 
    }
    const next = deck.length > 0 ? deck[0] : WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    setDeck(prev => prev.slice(1));
    setCurrentCard(next);
  };

  const handleCorrect = () => {
    setTurnScore(prev => prev + 1);
    nextCard();
  };

  const handleSkip = () => {
    nextCard();
  };

  const endTurn = () => {
    clearInterval(timerRef.current);
    const newTeams = [...teams];
    newTeams[currentTeamIndex].score += turnScore;
    setTeams(newTeams);

    if (newTeams[currentTeamIndex].score >= winningScore) {
      setGameState('gameover');
    } else {
      setGameState('summary');
    }
  };

  const nextRound = () => {
    setCurrentTeamIndex(prev => (prev === 0 ? 1 : 0));
    setGameState('prep');
  };

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endTurn();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState]);

  // --- Render ---
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-4 font-sans text-stone-800">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-orange-200">
          <div className="bg-orange-500 p-8 text-center relative overflow-hidden">
            <h1 className="text-4xl font-black text-white drop-shadow-md mb-2">Thanksgiving Charades</h1>
            <p className="text-orange-100 font-medium">Gather 'round & act it out!</p>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-stone-500 mb-1 uppercase tracking-wide">Round Timer</label>
                <div className="flex gap-2">
                  {[30, 60, 90].map(t => (
                    <button key={t} onClick={() => setRoundDuration(t)} className={`flex-1 py-2 rounded-xl font-bold transition-all ${roundDuration === t ? 'bg-orange-500 text-white shadow-md scale-105' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>{t}s</button>
                  ))}
                </div>
              </div>
              <div>
                 <label className="block text-sm font-bold text-stone-500 mb-1 uppercase tracking-wide">Winning Score</label>
                 <div className="flex gap-2">
                  {[30, 50, 100].map(s => (
                    <button key={s} onClick={() => setWinningScore(s)} className={`flex-1 py-2 rounded-xl font-bold transition-all ${winningScore === s ? 'bg-amber-500 text-white shadow-md scale-105' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>{s} pts</button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={startGame} className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-2xl text-xl font-black shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
              <Play fill="currentColor" /> Start Feast
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'prep') {
    const team = teams[currentTeamIndex];
    return (
      <div className={`min-h-screen ${team.color.split(' ')[0]} flex flex-col items-center justify-center p-6 text-center`}>
         <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border-4 border-white/50 animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl text-stone-400 font-bold mb-4">Up Next</h2>
            <div className={`text-4xl font-black mb-8 ${team.name.includes("Pumpkin") ? "text-orange-600" : "text-amber-700"}`}>{team.name}</div>
            <div className="bg-stone-100 rounded-2xl p-6 mb-8">
               <Users className="w-12 h-12 mx-auto text-stone-400 mb-2" />
               <p className="text-stone-600 font-medium">Pass device to actor!</p>
            </div>
            <button onClick={startTurn} className="w-full bg-stone-800 text-white py-4 rounded-xl text-xl font-bold shadow-lg hover:bg-stone-900 transition-all">I'm Ready!</button>
         </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    const team = teams[currentTeamIndex];
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col text-white touch-none">
        <div className="flex items-center justify-between p-4 bg-stone-800 border-b border-stone-700">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${team.name.includes("Pumpkin") ? "bg-orange-500" : "bg-amber-500"}`}></div>
            <span className="font-bold opacity-80">{team.name}</span>
          </div>
          <div className={`flex items-center gap-2 font-mono text-2xl font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-stone-300'}`}>
            <Clock className="w-5 h-5" /> {timeLeft}
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-4 inline-block px-3 py-1 rounded-full bg-stone-700 text-stone-300 text-sm font-bold uppercase tracking-widest">{currentCard?.category}</div>
            <h2 className="text-4xl md:text-6xl font-black leading-tight mb-8 break-words max-w-full">{currentCard?.phrase}</h2>
             <div className="text-stone-500 text-sm font-medium animate-pulse">Keep hidden from team!</div>
        </div>
        <div className="p-4 grid grid-cols-2 gap-4 h-1/3 max-h-64">
          <button onClick={handleSkip} className="bg-stone-700 hover:bg-stone-600 rounded-2xl flex flex-col items-center justify-center gap-2 transition-active active:scale-95 border-b-4 border-stone-900 active:border-b-0 active:mt-1">
            <X className="w-10 h-10 text-red-400" /> <span className="font-bold text-xl uppercase tracking-wider">Skip</span>
          </button>
          <button onClick={handleCorrect} className="bg-green-600 hover:bg-green-500 rounded-2xl flex flex-col items-center justify-center gap-2 transition-active active:scale-95 border-b-4 border-green-800 active:border-b-0 active:mt-1">
            <Check className="w-10 h-10 text-white" /> <span className="font-bold text-xl uppercase tracking-wider">Got It!</span>
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'summary') {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6">
         <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-stone-100">
            <h2 className="text-2xl text-stone-400 font-bold mb-2">Time's Up!</h2>
            <div className="text-6xl font-black text-stone-800 mb-2">+{turnScore}</div>
            <p className="text-stone-500 font-medium mb-8">points scored</p>
            <div className="bg-stone-100 rounded-2xl p-4 mb-8 space-y-3">
              {teams.map((t, idx) => (
                <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border-2 ${t.color}`}>
                  <span className="font-bold text-lg">{t.name}</span>
                  <span className="font-black text-2xl">{t.score}</span>
                </div>
              ))}
            </div>
            <button onClick={nextRound} className="w-full bg-orange-500 text-white py-4 rounded-xl text-xl font-bold shadow-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2">Next Team <Utensils className="w-5 h-5"/></button>
         </div>
      </div>
    );
  }

  if (gameState === 'gameover') {
    const winner = teams.reduce((prev, current) => (prev.score > current.score) ? prev : current);
    return (
       <div className="min-h-screen bg-gradient-to-b from-orange-400 to-amber-600 flex flex-col items-center justify-center p-6 text-white text-center">
          <Trophy className="w-24 h-24 text-yellow-300 drop-shadow-lg mb-6 animate-bounce" />
          <h1 className="text-5xl font-black drop-shadow-md mb-2">{winner.name} Wins!</h1>
          <button onClick={() => setGameState('menu')} className="mt-12 bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-xl shadow-xl hover:scale-105 transition-transform flex items-center gap-2"><RotateCcw className="w-5 h-5" /> Play Again</button>
       </div>
    );
  }
  return null;
};

export default ThanksgivingCharades;

