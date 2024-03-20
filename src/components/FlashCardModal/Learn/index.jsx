"use client";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { isDesktop } from "react-device-detect";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";

import Cards from "./CardLearn";

import * as flashsetAPI from "@/apis/flashsets";
import * as flashsetAPINew from "@/apisNew/flashsets";
import { alert } from "@/utils/helpers";

export default function Learn({
  children,
  flashsetId,
  page,
  perPage,
  learned,
  handleSubmitted,
  handleRefecth,
  setLoading,
  courseId,
}) {
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const refCards = useRef();
  const refBody = useRef(new Date().getTime());

  const [isLoading, setIsLoading] = useState(true);
  const isFirst = useRef(true);
  const isFlipped = useRef(false);
  const isListen = useRef(false);

  const cards = useQuery({
    queryKey: ["flashset-cards", flashsetId, page, perPage],
    queryFn: () =>
      flashsetAPINew.getFlashcards({ id: flashsetId, page: 1, perPage: 100 }),
  });

  const MAX_LENGTH_CARDS = cards?.data?.data?.data.length;

  const [formatNumber, setFormatNumber] = useState(0);

  const [index, setIndex] = useState(Number(learned));

  const handleFlip = (flashcardId) => {
    refBody.current = new Date().getTime();
    isFlipped.current = true;
  };

  useEffect(() => {
    if (isOpen) {
      (async () => {
        const response = await flashsetAPINew.getFlashsetById(
          flashsetId,
          courseId
        );
        const calculate =
          response.data.learned / response.data.totalCards >= 1
            ? response.data.learned -
              response.data.totalCards *
                parseInt(response.data.learned / response.data.totalCards)
            : response.data.learned;

        setIndex(calculate);
        setFormatNumber(calculate);
        setIsLoading(false);
      })();
    }
    if (!isOpen && !isFirst.current) {
      setIsLoading(true);
      setFormatNumber(0);
    }
    isFirst.current = false;
  }, [isOpen]);

  const handlePrev = () => {
    if (index === 0) return;
    isListen.current = false;
    isFlipped.current = false;
    refCards.current.prev();

    if (learned <= MAX_LENGTH_CARDS) return;

    const dataset = {
      flashsetId: flashsetId,
      flashcardId: cards?.data.data.data[index].id,
      courseId: courseId,
      type: "learn",
    };
    flashsetAPI.deleteCardInHistories(dataset);
  };

  const handleNext = () => {
    if (!isFlipped.current && learned <= MAX_LENGTH_CARDS) {
      alert.error("Please try flipping this card first");
      return;
    }

    isListen.current = false;
    isFlipped.current = false;

    refCards.current.next();
    if (index >= formatNumber) {
      if (index > cards?.data?.data?.data.length - 1) return;
      setFormatNumber((pre) => pre + 1);

      const dataset = {
        type: "learn",
        flashcards: [{ id: cards?.data?.data.data[index].id, result: true }],
      };
      return handleSubmitted(dataset);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowRight") handleNext();
      else if (e.key === "ArrowLeft") handlePrev();
    };
    if (isOpen) {
      window.addEventListener("keyup", handleKeyPress);
    }
    return () => {
      return isOpen && window.removeEventListener("keyup", handleKeyPress);
    };
  }, [isOpen, handleNext, handlePrev]);

  const isMobile = () =>
    window?.matchMedia && window?.matchMedia?.("(max-width: 768px)")?.matches;

  const handleBody = () => {
    if (!isMobile() || isDesktop) return;
    if (new Date().getTime() - refBody.current < 1000) return;
  };

  const oncloseModal = () => {
    setLoading(true);
    handleRefecth();
    onClose();
  };

  const onClickOpen = () => {
    onOpen();
  };

  return (
    <>
      <div className="relative cursor-pointer" onClick={onClickOpen}>
        {children}
        <div className="absolute bottom-0 left-0 right-0 top-0" />
      </div>
      {isOpen && (
        <Modal size="full" isOpen={true} onClose={oncloseModal}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Learn</ModalHeader>
                <ModalBody onClick={handleBody}>
                  {isLoading === true && (
                    <div className="flex min-h-screen w-[100%] items-center justify-center ">
                      <Image
                        src={"/img/flashie-loading-screen.gif"}
                        width={220}
                        height={100}
                      />
                    </div>
                  )}
                  {isLoading === false && (
                    <>
                      {Array.isArray(cards?.data?.data?.data) && (
                        <Cards
                          ref={refCards}
                          flashsetId={flashsetId}
                          data={cards?.data.data?.data?.sort((a, b) => {
                            const numA = parseInt(a.name.replace("Card ", ""));
                            const numB = parseInt(b.name.replace("Card ", ""));
                            return numA - numB;
                          })}
                          currentIndex={index}
                          maxIndexLength={cards?.data?.data?.data?.length - 1}
                          onClose={onClose}
                          onFlip={handleFlip}
                          onSpeaked={() => {
                            isListen.current = true;
                          }}
                          onIndexChange={(e) => {
                            setIndex(index + 1);
                          }}
                          onIndexChangePrev={(e) => {
                            setIndex(index - 1);
                          }}
                        />
                      )}

                      {Array.isArray(cards?.data?.data.data) && (
                        <div className="flex flex-row items-center justify-between p-4 font-semibold">
                          <Button
                            color="primary"
                            isIconOnly
                            variant="light"
                            onPress={handlePrev}
                          >
                            <FaCircleChevronLeft size={30} />
                          </Button>
                          {index <= cards?.data?.data?.data.length - 1 && (
                            <p>
                              {index + 1}/{cards?.data?.data?.data.length}
                            </p>
                          )}

                          {index > cards?.data?.data?.data.length - 1 ? (
                            <Button
                              color="success"
                              onPress={async () => {
                                onClose();
                              }}
                            >
                              Done
                            </Button>
                          ) : (
                            <Button
                              color="primary"
                              isIconOnly
                              variant="light"
                              onPress={handleNext}
                            >
                              <FaCircleChevronRight size={30} />
                            </Button>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
