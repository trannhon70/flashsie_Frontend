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
import * as flashsetAPI from "@/apis/flashsets";
import * as flashsetAPINew from "@/apisNew/flashsets";
import Dictation from "./Dictation";

export default function PlayCountdownModal({
  children,
  flashsetId,
  page,
  perPage,
  type,
  handleSubmitted,
  formatNumberDictation,
  setLoading,
  handleRefecth,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const isFirst = useRef(true);
  const [_page, setPage] = useState(page);

  const cards = useQuery({
    enabled: isOpen,
    queryKey: ["flashset-cards", flashsetId, page, perPage, type],
    queryFn: () =>
      flashsetAPINew.getFlashcards({
        id: flashsetId,
        page: 1,
        perPage: 1000,
        type: "dictation",
      }),
  });


  useEffect(() => {
    if (!isOpen && !isFirst.current)
      queryClient.refetchQueries(["flashset", flashsetId]);
    isFirst.current = false;
  }, [isOpen]);

  const handclick = () => {
    if (formatNumberDictation === 0) {
      localStorage.setItem("check", "check");
    }

    onOpen();
  };

  const handleonClose = () => {
    handleRefecth();
    onClose();
    setLoading(true);
  };
  return (
    <>
      <div className="relative cursor-pointer" onClick={handclick}>
        {children}
        <div className="absolute bottom-0 left-0 right-0 top-0" />
      </div>
      {isOpen && (
        <Modal
          size="md"
          isDismissable={false}
          isOpen={true}
          onClose={handleonClose}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Dictation
                </ModalHeader>
                <ModalBody>
                  {cards.isLoading ? (
                    <div className="flex h-80 w-full flex-col items-center justify-center">
                      <Spinner size={60} />
                    </div>
                  ) : (
                    <Dictation
                      cards={cards?.data?.data?.data.sort((a, b) => {
                        const numA = parseInt(a.name.replace("Card ", ""));
                        const numB = parseInt(b.name.replace("Card ", ""));
                        return numA - numB;
                      })}
                      flashsetId={flashsetId}
                      onClose={onClose}
                      handleSubmitted={handleSubmitted}
                      formatNumberDictation={formatNumberDictation}
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
