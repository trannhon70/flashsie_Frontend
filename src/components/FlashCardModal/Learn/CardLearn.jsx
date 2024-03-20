"use client";
import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useState,
} from "react";
import { AnimatePresence } from "framer-motion";
import Card from "./Card";
import Image from "next/image";
const colors = [
  "#E42100",
  "#F36000",
  "#F3BC00",
  "#A0A226",
  "#349B19",
  "#70BBFF",
  "#7F4877",
  "#BC2A6E",
];

const Cards = forwardRef(
  (
    {
      currentIndex,
      maxIndexLength,
      data = [],
      cardData,
      onIndexChange,
      refCard,
      disableFlip,
      onFlip,
      onSpeak,
      onSpeaked,
      onOutideClick,
      isSwap,
      onIndexChangePrev,
    },
    ref
  ) => {
    useImperativeHandle(ref, () => ({
      next: handleNext,
      prev: handlePrev,
    }));
    const [cards, setCards] = useState(
      data.map((i) => ({
        ...i,
        color: colors[Math.floor(Math.random() * colors.length)],
      }))
    );

    const [index, setIndex] = useState(currentIndex);

    const handleNext = () => {
      if (currentIndex > maxIndexLength && index >= maxIndexLength) return;
      setIndex((s) => {
        const idx = Math.min(s + 1, data.length);
        onIndexChange?.(idx);
        return idx;
      });
    };
    const handlePrev = () => {
      if (currentIndex <= 0 && index <= 0) return;
      setIndex((s) => {
        const idx = Math.max(s - 1, 0);
        onIndexChangePrev?.(idx);
        return idx;
      });
    };

    const handleFlip = (flashcardId) => () => {
      onFlip?.(flashcardId);
    };


    return (
      <div className="flex h-full flex-col">
        <div
          className="relative flex flex-1 flex-col items-center justify-center rounded-md"
          onClick={onOutideClick}
        >
          {cards.length - currentIndex >= 1 ? (
            <AnimatePresence>
              {cards.map((card, idx) => (
                <Card
                  key={`${idx}-${card.name}`}
                  disableFlip={disableFlip}
                  data={card}
                />
              ))}
              <Card
                ref={refCard}
                autoSpeak={true}
                disableFlip={disableFlip}
                onFlip={handleFlip(cards[currentIndex]?.id)}
                data={cardData || cards[currentIndex]}
                onNext={handleNext}
                onPrev={handlePrev}
                isSwap={isSwap}
                onSpeak={onSpeak}
                onSpeaked={onSpeaked}
              />
            </AnimatePresence>
          ) : (
            <Image
              height={300}
              width={300}
              src="/img/flashie_completed.png"
              className="rounded-lg"
            />
          )}
        </div>
      </div>
    );
  }
);

export default Cards;
