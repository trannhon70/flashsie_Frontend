"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import * as flashsetAPI from "@/apis/flashsets";
import * as flashsetAPINew from "@/apisNew/flashsets";
import Game from "./Game";
import { shuffle, useWindowSize } from "@/utils/helpers";

export default function PlayCountdownModal({
  children,
  flashsetId,
  page,
  perPage,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const windowSize = useWindowSize();
  const isFirst = useRef(true);
  // const [perPage, setPerPage] = useState(20)
  // const [page, setPage] = useState(1)

  const cards = useQuery({
    enabled: isOpen,
    queryKey: ["flashset-cards", flashsetId, 1, 100],
    queryFn: () =>
      flashsetAPINew.getFlashcards({ id: flashsetId, page: 1, perPage: 100 }),
  });
  const cardList = Array.isArray(cards?.data?.data.data)
    ? shuffle(
        cards?.data?.data?.data?.filter?.((i) => i.frontText && i.backText)
      )
    : [];

  useEffect(() => {
    if (!isOpen && !isFirst.current) {
      queryClient.refetchQueries(["flashset", flashsetId]);
    }
    isFirst.current = false;
  }, [isOpen]);

  let width = Math.min(
    windowSize.height * 1.77 > windowSize.width
      ? windowSize.width
      : windowSize.height * 1.77,
    800
  );

  let height = width * 0.5625;

  return (
    <>
      <div className="relative cursor-pointer" onClick={onOpen}>
        {children}
        <div className="absolute bottom-0 left-0 right-0 top-0" />
      </div>
      {isOpen && (
        <Modal
          isOpen={true}
          hideCloseButton
          isDismissable={false}
          size={"undefined"}
          style={{ width, height, maxWidth: "unset" }}
          onClose={onClose}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody style={{ padding: 0 }}>
                  <Game
                    width={width}
                    height={height}
                    cards={cardList}
                    page={page}
                    perPage={perPage}
                    flashsetId={flashsetId}
                  />
                  <div
                    className="absolute right-2 top-2 cursor-pointer"
                    onClick={onClose}
                  >
                    <IoIosCloseCircle color="#fff" size={30} />
                  </div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
