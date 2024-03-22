"use client";
import { Button } from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import Cards from "../components/Cards";

import Image from "next/image";
import useSound from "use-sound";
import * as flashsetAPI from "@/apis/flashsets";
import constants from "@/utils/constants";
import { shuffle } from "@/utils/helpers";
import Answers from "./Answers";
import Blank from "./Blank";

export default function PlayCountdown({
  cards,
  cardFull,
  flashsetId,
  onClose,
  histories,
  numberFormat,
  handleSubmitted,
}) {
  const queryClient = useQueryClient();
  const [playSuccess] = useSound("/sound/success.mp3");
  const [playWrong] = useSound("/sound/wrong.mp3");

  const result = useRef([]);
  const refCard = useRef();
  const refCards = useRef();

  const cardImgs = useRef(
    [
      ...cards.map((i) => i.frontImage),
      ...cards.map((i) => i.backImage),
    ].filter((i) => !!i)
  );
  const cardTexts = useRef(
    [...cards.map((i) => i.frontText), ...cards.map((i) => i.frontText)].filter(
      (i) => !!i
    )
  );

  const frontAnswersText = useRef([
    ...cards.map((i) => i.frontText).filter((i) => !!i),
  ]);
  const frontAnswersImage = useRef([
    ...cards.map((i) => i.frontImage).filter((i) => !!i),
  ]);
  const backAnswersText = useRef([
    ...cards.map((i) => i.backText).filter((i) => !!i),
  ]);
  const backAnswersImage = useRef([
    ...cards.map((i) => i.backImage).filter((i) => !!i),
  ]);

  const [isContinue, setContinue] = useState(false);
  const [isRePlay, setRePlay] = useState(false);

  const [index, setIndex] = useState(
    histories == cards.length
      ? 0
      : histories >= cardFull.length
        ? numberFormat
        : histories % cards?.length
    // numberFormat
  );

  const [question, setQuestion] = useState({
    type: "abcd",
    questionContent: "",
    questionType: "",
    answerTrue: "",
    answerType: "",
    answers: [],
  });
  const [selected, setSelected] = useState(-1);
  const [isCorrect, setIsCorrect] = useState(null);

  const numberFormatCardLength = cards.length;

  useEffect(() => {
    if (index === -1 || index >= cardFull.length) return;
    const card = cardFull[index];
    if (!card) return;
    const ques = question;
    ques.type =
      cards[index]?.types[
        Math.floor(Math.random() * (cards[index]?.types.length || 0))
      ] || ["abcd", "arrange-word", "blank"][Math.floor(Math.random() * 3)];

    // Front Text exists, Back Image exists
    if (card.frontText?.length > 0 && card.backImage?.length > 0) {
      ques.questionContent = card.frontText.toLowerCase();
      ques.questionType = "text";
      ques.answerType = "image";
      ques.answerTrue = card.backImage;
    }
    // Front Text exists, Back Image empty
    if (card.frontText?.length > 0 && card.backImage?.length === 0) {
      ques.questionContent = card.frontText;
      ques.questionType = "text";
      ques.answerType = "text";
      ques.answerTrue = card.backText;
    }
    // Front Image exists, Back Text exists
    if (card.frontImage?.length > 0 && card.backText?.length > 0) {
      ques.questionContent = card.frontImage;
      ques.questionType = "image";
      ques.answerType = "text";
      ques.answerTrue = card.backText;
    }
    // Front Image exists, Back Text empty
    if (card.frontImage?.length > 0 && card.backText?.length === 0) {
      ques.questionContent = card.frontImage;
      ques.questionType = "image";
      ques.answerType = "image";
      ques.answerTrue = card.backImage;
    }
    //sua
    if (!card.frontImage && !card.backImage) {
      ques.questionContent = card.backText;
      ques.questionType = "text";
      ques.answerType = "text";
      ques.answerTrue = card.frontText;
    }
    if (ques.answerType === "image" && ques.type !== "abcd") ques.type = "abcd";
    let randAnswers = shuffle(
      ques.answerType === "image" ? cardImgs.current : cardTexts.current
    );
    if (ques.type == "abcd") {
      randAnswers = shuffle(backAnswersText.current);
      ques.answerTrue = ques.questionContent;
    } else {
      randAnswers = shuffle(
        ques.answerType === "image" ? cardImgs.current : cardTexts.current
      );
    }
    const _answers = randAnswers
      .filter((i) => i !== ques.answerTrue)
      .slice(0, 3);
    // console.log(ques.questionContent)
    ques.answers = shuffle([..._answers, ques.questionContent]);

    setQuestion({ ...ques });
    refCard.current?.setCard(card);
  }, [index]);

  useEffect(() => {
    if (isCorrect != null) {
      refCard.current.setCardStatus(isCorrect);
      setTimeout(() => {
        setIsCorrect(null);
        setSelected(-1);
        setIndex((s) => s + 1);
        refCard.current.setColorCard();
      }, 1000);

      const dataset = {
        type: "quiz",
        flashcards: [
          {
            id: isContinue
              ? cardFull[index].id
              : isRePlay
                ? cardFull[index].id
                : cardFull[index].id,
            result: isCorrect,
          },
        ],
      };
      handleSubmitted(dataset);
      queryClient.refetchQueries(["flashset", flashsetId]);
    }
  }, [isCorrect, index]);

  useEffect(() => {
    const [playSuccess] = useSound("/sound/success.mp3");
    const [playWrong] = useSound("/sound/wrong.mp3");
    playSuccess()
    playWrong()
  }, []);

  const handleAnswer = (img) => () => {
    // if (isCorrect != null) return
    // refCard.current.flip?.()
    if (`${question.answerTrue}`.toLowerCase() === `${img}`.toLowerCase()) {
      playSuccess();
      setIsCorrect(true);
      result.current.push(true);
      refCard.current.setColorCard("#89f9b6");
    } else {
      playWrong();
      setIsCorrect(false);
      result.current.push(false);
      refCard.current.setColorCard("#ff8989");
    }
    setSelected(question.answers.findIndex((i) => i === img));
    setContinue(false);
  };

  return (
    <div className="flex flex-1 flex-col">
      {Array.isArray(cards) && (
        <div className="mb-2 flex flex-row justify-between text-xl">
          <span>
            {numberFormat}/{cards.length}
          </span>
        </div>
      )}

      {Array.isArray(cards) && cards.length - index >= 1 ? (
        <Cards
          ref={refCards}
          refCard={refCard}
          flashsetId={flashsetId}
          data={cards}
          disableFlip
          isSwap={question.type === "abcd" ? false : true}
        />
      ) : isContinue ? (
        <Cards
          ref={refCards}
          refCard={refCard}
          flashsetId={flashsetId}
          data={cardFull.slice(index, cardFull.length)}
          disableFlip
          isSwap={question.type === "abcd" ? false : true}
        />
      ) : (
        <Cards
          ref={refCards}
          refCard={refCard}
          flashsetId={flashsetId}
          data={cardFull.slice(index, cardFull.length)}
          disableFlip
          isSwap={question.type === "abcd" ? false : true}
        />
      )}

      {index !== 0 && index % cards.length === 0 && !isContinue ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="gradient relative flex h-full w-full flex-col items-center justify-center rounded-md bg-slate-800">
            <span className="mb-4 text-center text-4xl font-bold text-green-500">
              {constants.label_game_finished}
            </span>
            <div className="flex flex-row gap-4">
              <span className="mb-4 text-lg font-bold text-green-300">
                Point: {result.current.filter((i) => !!i).length * 3}
              </span>
              <span className="mb-4 text-lg font-bold text-green-300">
                Correct: {result.current.filter((i) => !!i).length}
              </span>
            </div>
            <span className="mb-4 text-center text-xl font-bold text-white">
              Do you want to do next Quiz Challenge!
            </span>
            <div className="flex flex-row gap-4">
              <Button onPress={onClose}>CLOSE</Button>
              <Button
                onPress={() => {
                  setContinue(true);
                }}
                color="primary"
              >
                CONTINUE
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {index >= cards.length && isContinue ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="gradient relative flex h-full w-full flex-col items-center justify-center rounded-md bg-slate-800">
            <span className="mb-4 text-center text-4xl font-bold text-green-500">
              {constants.label_game_finished}
            </span>
            <div className="flex flex-row gap-4">
              <span className="mb-4 text-lg font-bold text-green-300">
                Point: {result.current.filter((i) => !!i).length * 3}
              </span>
              <span className="mb-4 text-lg font-bold text-green-300">
                Correct: {result.current.filter((i) => !!i).length}
              </span>
            </div>

            <div className="flex flex-row gap-4">
              <Button
                onPress={() => {
                  setIndex(0);
                  setRePlay(true);
                }}
              >
                REPLAY
              </Button>
              <Button onPress={onClose}>CLOSE</Button>
            </div>
          </div>
        </div>
      ) : null}

      {question.type === "abcd" && (
        <div className="flex grid-cols-2 justify-center gap-4 p-4 pb-4 md:grid-cols-4">
          {Array.isArray(cardFull) &&
            cardFull?.length - index >= 1 &&
            [...question.answers].map((i, idx) =>
              question.answerType == "image" ? (
                <div
                  key={`${i}-${idx}`}
                  onClick={handleAnswer(i)}
                  className={`flex h-[70px] w-[70px] cursor-pointer flex-col items-center justify-center border-1 md:border-4 ${
                    idx == selected
                      ? isCorrect
                        ? "border-green-600 bg-green-200"
                        : "border-red-600 bg-red-200"
                      : "border-blue-500"
                  }  p-2`}
                >
                  <Image
                    key={`${i}-${idx}`}
                    width={70}
                    height={70}
                    src={i}
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <div
                  key={`${i}-${idx}`}
                  onClick={handleAnswer(i)}
                  className={`md;border-4 flex h-[70px] w-full flex-1 cursor-pointer flex-col items-center justify-center border-1 ${
                    idx == selected
                      ? isCorrect
                        ? "border-green-600 bg-green-200"
                        : "border-red-600 bg-red-200"
                      : "border-blue-500"
                  }  p-2`}
                >
                  {i}
                </div>
              )
            )}
        </div>
      )}

      {question.type === "arrange-word" && (
        <div className="flex flex-row justify-center gap-4 p-4 pb-2">
          {cardFull.length - index >= 1 && (
            <Answers
              isCorrect={isCorrect}
              answer={question.answerTrue
                .split("")
                .map((i, idx) => ({ key: idx, value: i.toUpperCase() }))}
              onAnswer={(ans) => handleAnswer(ans)()}
            />
          )}
        </div>
      )}

      {question.type === "blank" && (
        <Blank isCorrect={isCorrect} onAnswer={(ans) => handleAnswer(ans)()} />
      )}
    </div>
  );
}
