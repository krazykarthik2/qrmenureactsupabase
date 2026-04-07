import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useSupabaseMenu } from '../hooks/useSupabaseMenu';

export default function MemoryGame() {
  const { categories, loading } = useSupabaseMenu();
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (!loading && categories.length > 0) {
      startNewGame();
    }
  }, [loading, categories]);

  const startNewGame = () => {
    // Collect valid images from up to 4 categories (to make 8 pairs)
    const validImages = categories.filter(c => c.image).slice(0, 4).map(c => c.image);
    
    // Fallback if very few categories have images
    while (validImages.length < 4 && validImages.length > 0) {
      validImages.push(validImages[0]);
    }
    
    if (validImages.length === 0) return; // No images to play with!

    const gameCards = [...validImages, ...validImages]
      .sort(() => Math.random() - 0.5)
      .map((img) => ({ imgUrl: img }));
      
    // Insert "Free Space/Logo" card exactly in the center to make a 3x3 grid (9 cards)
    gameCards.splice(4, 0, { isCenterLogo: true });
    
    // Assign stable IDs
    const finalCards = gameCards.map((card, index) => ({ ...card, id: index }));
    
    setCards(finalCards);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
    setDisabled(false);
  };

  const handleCardClick = (index) => {
    if (disabled || flipped.includes(index) || solved.includes(index) || cards[index].isCenterLogo) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      setMoves(m => m + 1);
      
      const firstIndex = newFlipped[0];
      const secondIndex = newFlipped[1];

      if (cards[firstIndex].imgUrl === cards[secondIndex].imgUrl) {
        setSolved([...solved, firstIndex, secondIndex]);
        setFlipped([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  // Game over when 8 cards are solved (4 pairs)
  const isGameOver = cards.length > 0 && solved.length === 8;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-[#ffd54f]">Loading Game...</div>;
  }

  if (cards.length === 0) {
     return <div className="min-h-screen flex items-center justify-center text-white/50">Not enough category images to play!</div>;
  }

  return (
    <div className="min-h-screen pb-16 flex flex-col items-center">
      <div className="absolute top-8 left-6 md:left-12 z-50">
        <Link 
          to="/" 
          className="group flex items-center gap-3 px-5 py-2.5 bg-black/50 backdrop-blur-xl border border-white/10 rounded-full text-white/80 hover:text-white hover:bg-black/80 hover:border-white/20 transition-all duration-300 shadow-xl"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-sans tracking-widest uppercase">Home</span>
        </Link>
      </div>

      <div className="pt-8 w-full">
        <Header 
          title="CAFE MEMORY"
          subtitle="Match the items to win!" 
        />
      </div>

      <div className="max-w-md w-full px-6 mt-4">
        <div className="flex justify-between items-center mb-6 px-2">
          <span className="font-sans text-xl text-[#ffd54f]">Moves: {moves}</span>
          <button 
            onClick={startNewGame}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-sm font-bold tracking-wider"
          >
            <RotateCcw size={16} /> RESET
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 md:gap-6 perspective-1000">
          {cards.map((card, index) => {
            if (card.isCenterLogo) {
              return (
                <div key={card.id} className="relative w-full aspect-square rounded-2xl flex flex-col items-center justify-center bg-black/50 border border-[#ffd54f]/50 shadow-[0_0_15px_rgba(255,213,79,0.2)]">
                  <span className="text-[#ffd54f] font-serif font-bold text-center text-sm md:text-base leading-tight tracking-widest">VIYA<br/>PURI</span>
                </div>
              );
            }

            const isFlipped = flipped.includes(index) || solved.includes(index);
            
            return (
              <div 
                key={card.id}
                onClick={() => handleCardClick(index)}
                className={`relative w-full aspect-square rounded-2xl cursor-pointer transition-all duration-500 transform-style-3d ${isFlipped ? '[transform:rotateY(180deg)]' : 'hover:scale-105 active:scale-95 shadow-xl'}`}
              >
                {/* Back of Card (Hidden by default, shows when NOT flipped) */}
                <div className={`absolute inset-0 bg-gradient-to-br from-[#ffd54f] to-[#ff9800] rounded-2xl flex items-center justify-center backface-hidden border border-white/10 ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>
                  <span className="text-black/30 font-serif font-bold text-4xl">?</span>
                </div>
                
                {/* Front of Card (Shows when flipped) */}
                <div className={`absolute inset-0 bg-white/10 backdrop-blur-lg border overflow-hidden ${solved.includes(index) ? 'border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.5)]' : 'border-white/20'} rounded-2xl flex items-center justify-center transform rotate-y-180 backface-hidden transition-all duration-300 ${!isFlipped ? 'opacity-0' : 'opacity-100'}`}>
                  {card.imgUrl ? (
                    <img src={card.imgUrl} alt="card" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="text-white/30" size={32} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {isGameOver && (
          <div className="mt-10 bg-green-500/20 border border-green-400/30 p-6 rounded-2xl text-center backdrop-blur-md animate-fade-in shadow-2xl">
            <h3 className="text-3xl font-serif text-green-300 mb-2">You Won! 🎉</h3>
            <p className="text-white/80">Completed in {moves} moves.</p>
          </div>
        )}
      </div>
    </div>
  );
}
