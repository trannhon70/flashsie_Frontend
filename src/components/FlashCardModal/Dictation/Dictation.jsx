"use client";
import { Button, Input } from "@nextui-org/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaVolumeLow } from "react-icons/fa6";
import useSound from "use-sound";
import * as flashsetAPI from "@/apis/flashsets";
import * as flashsetAPINew from "@/apisNew/flashsets";
import constants from "@/utils/constants";
import { speak } from "@/utils/helpers";
import useFlashset from "./../../../app/(student)/courses/[id]/flashsets/[flashsetId]/page";

export default function Dictation({
  cards,
  flashsetId,
  onClose,
  handleSubmitted,
  formatNumberDictation,
}) {
  const queryClient = useQueryClient();
  const [playSuccess] = useSound("/sound/success.mp3");
  const [playWrong] = useSound("/sound/wrong.mp3");

  const [input, setInput] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const result = useRef([]);

  const flashset = useQuery({
    queryKey: ["flashset", flashsetId],
    queryFn: () => flashsetAPINew.getFlashsetById(flashsetId),
  });

  const [index, setIndex] = useState(formatNumberDictation);

  // useEffect(() => {
  //   queryClient.invalidateQueries('flashset', flashsetId)
  // }, [])

  useEffect(() => {
    if (cards?.[index]?.frontText && isCorrect == null) {
      speak(cards[index].frontText);
    }

    if (isCorrect != null) {
      setTimeout(() => {
        setIsCorrect(null);
        setInput("");
        setIndex((s) => s + 1);
      }, 2000);

      // if (flashset?.data?.data?.dictation < cards.length) {
      const dataset = {
        type: "dictation",
        flashcards: [{ id: cards[index].id }],
      };
      handleSubmitted(dataset);
      // flashsetAPI.histories(flashsetId, 'dictation', [{ id: cards[index].id }]).then(() => {})
      // }
    }
  }, [isCorrect]);

  const handleAnswer = () => {
    if (
      `${cards[index].frontText}`.toLowerCase() === `${input}`.toLowerCase()
    ) {
      playSuccess();
      setIsCorrect(true);
      result.current.push(true);
    } else {
      playWrong();
      setIsCorrect(false);
      result.current.push(false);
    }
    localStorage.removeItem("check");
  };

  const handleChange = ({ target }) => {
    setInput(target.value);
  };

  useEffect(() => {
    window.addEventListener("keyup", handleKeyPress);

    return () => {
      window.removeEventListener("keyup", handleKeyPress);
    };
  }, [input]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      localStorage.removeItem("check");
      handleAnswer();
    }
  };

  return (
    <div
      className="flex flex-1 flex-col"
      // onClick={isMobile() || !isDesktop ? handleAnswer : () => {}}
    >
      {Array.isArray(cards) && (
        <div className="mb-2 flex flex-row justify-between text-xl">
          <span>
            {flashset?.data?.dictation === cards.length
              ? cards.length
              : Math.min(index + 1, cards.length)}
            /{cards.length}
          </span>
          {/* <span>{timeLeft / 1000}s</span> */}
        </div>
      )}

      {cards[index] && (
        <div className="flex flex-col items-center gap-4">
          <div
            className={`relative h-[28vh] w-[21vh] overflow-hidden rounded-md border-2 bg-blue-100 ${
              isCorrect
                ? "border-green-500"
                : isCorrect == false
                  ? "border-red-500"
                  : ""
            }`}
          >
            {isCorrect == false && (
              <p className="flex h-[100%] items-center justify-center text-center text-2xl ">
                {cards[index].frontText || ""}
              </p>
            )}
            {cards[index].frontImage?.length > 0 && (
              <Image
                src={cards[index].frontImage}
                width={300}
                height={400}
                className={` h-[28vh] w-[21vh]`}
                alt="frontImage"
              />
            )}
            <Button
              className={"absolute left-2 top-2"}
              color="primary"
              isIconOnly
              variant="light"
              onPress={() => {
                new Audio(
                  `https://translate.google.com/translate_tts?ie=UTF-8&q=${cards[index].frontText}&tl=en&client=tw-ob`
                ).play();
              }}
            >
              <FaVolumeLow size={30} />
            </Button>
          </div>
          <Input
            placeholder={constants.place_dictation_input}
            className="w-48"
            value={input}
            onChange={handleChange}
          />
          <div
            className={`relative flex h-[28vh] w-[21vh] flex-col items-center justify-center overflow-hidden rounded-md border-2 bg-blue-100 ${
              isCorrect
                ? "border-green-400 bg-green-200"
                : isCorrect == false
                  ? "border-red-400 bg-red-200"
                  : ""
            }`}
          >
            <p className="text-center text-2xl">
              {cards[index].backText || ""}
            </p>
          </div>

          <Button
            isDisabled={isCorrect !== null || input.length === 0}
            color="primary"
            onPress={handleAnswer}
            onKeyDown={handleKeyPress}
          >
            Check
          </Button>
        </div>
      )}
      {!cards[index] && (
        <div className="mb-4 flex h-[60vh] w-full flex-col items-center justify-center gap-2 rounded-md bg-slate-800">
          {/* <span className='text-xl text-white'>End of Game</span> */}
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
            <Button onPress={onClose}>CLOSE</Button>
          </div>
        </div>
      )}
    </div>
  );
}
