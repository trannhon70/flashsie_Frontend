"use client";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import * as courseAPI from "@/apis/courses";
import * as courseAPINew from "@/apisNew/courses";
import * as flashsetAPI from "@/apis/flashsets";
import * as flashsetAPINew from "@/apisNew/flashsets";
import Quiz from "./Quiz";

export default function QuizModal({
  children,
  courseId,
  flashsetId,
  numberFormat,
  handleSubmitted,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [perPage, setPerPage] = useState(1000);
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const isFirst = useRef(true);

  const cards = useQuery({
    enabled: isOpen,
    queryKey: ["course-quiz", courseId, flashsetId, page, perPage],
    queryFn: () =>
      courseAPINew.getQuiz(courseId, flashsetId, { page, perPage }),
  });

  const history = useQuery({
    queryKey: ["flashset", flashsetId],
    queryFn: () => flashsetAPINew.getFlashcards(flashsetId),
  });

  const card = useQuery({
    queryKey: ["flashset-cards", flashsetId],
    queryFn: () =>
      flashsetAPINew.getFlashcards({
        id: flashsetId,
        page: 1,
        perPage: 1000,
        type: "quiz",
      }),
  })?.data?.data?.data;

  if (cards?.data?.data?.data[0]?.inOrder == true) {
    card.sort((a, b) => {
      const numA = parseInt(a.name.replace("Card ", ""));
      const numB = parseInt(b.name.replace("Card ", ""));
      return numA - numB;
    });
  }

  useEffect(() => {
    if (!isOpen && !isFirst.current) {
      queryClient.refetchQueries(["flashset", flashsetId]);
    }
    isFirst.current = false;
  }, [isOpen]);

  return (
    <>
      <div className="relative cursor-pointer" onClick={onOpen}>
        {children}
        <div className="absolute bottom-0 left-0 right-0 top-0" />
      </div>
      {isOpen && (
        <Modal size="full" isOpen={true} onClose={onClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Quiz</ModalHeader>
                <ModalBody>
                  {cards.isLoading ? (
                    <div className="flex h-80 w-full flex-col items-center justify-center">
                      <Spinner size={60} />
                    </div>
                  ) : (
                    <Quiz
                      handleSubmitted={handleSubmitted}
                      numberFormat={numberFormat}
                      histories={history.data.data.quiz}
                      cardFull={card}
                      cards={cards?.data?.data?.data}
                      flashsetId={flashsetId}
                      onClose={onClose}
                    />
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
