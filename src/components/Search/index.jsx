"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  User,
} from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
// import { useDebounceEffect } from '~/utils/helpers'
import * as searchAPI from "@/apis/search";
import * as searchAPINew from "@/apisNew/search";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDebounceEffect } from "@/utils/helpers";

export default function Search({ children }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const [text, setText] = useState("");
  const [result, setResult] = useState([]);
  const [perPage, setPerPage] = useState(10);

  useDebounceEffect(
    () => {
      if (text)
        searchAPINew.search(text, perPage).then((r) => {
          setResult(r.data);
        });
      //   else setResult([])
    },
    1000,
    [text]
  );

  const handleChange = ({ target }) => setText(target.value);
  return (
    <>
      <div onClick={onOpen}>{children}</div>

      {isOpen && (
        <Modal isOpen={isOpen} placement={"center"} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col">Search</ModalHeader>
                <ModalBody className="px-0">
                  <div className="px-6">
                    <Input
                      classNames={{
                        base: "w-full h-10",
                        mainWrapper: "h-full",
                        input: [
                          "bg-transparent",
                          "text-black/90",
                          "placeholder:text-default-700/50",
                        ],
                        inputWrapper: "h-full font-normal text-white ",
                      }}
                      placeholder="Type to search..."
                      size="sm"
                      startContent={
                        <FaSearch
                          size={18}
                          className="text-white-400 pointer-events-none flex-shrink-0 text-black/50 dark:text-white/90"
                        />
                      }
                      type="search"
                      autoFocus
                      value={text}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex w-full flex-col items-start gap-2 max-h-[500px] overflow-x-auto pl-6 ">
                    {result?.length === 0 && (
                      <p className="my-10 text-center">No recent searches</p>
                    )}
                    {result?.map?.((i) => (
                      <div
                        key={i.id}
                        className="w-full cursor-pointer"
                        onClick={() => {
                          onClose();
                          router.push(
                            // i.type == 'course' ? `/courses/${i.id}` : `/flashsets/${i.id}`
                            `/${i.side}/${i.id}`
                          );
                        }}
                      >
                        <User
                          avatarProps={{ src: i.image, radius: "sm" }}
                          name={i.name}
                          description={i.side.slice(0, -1)}
                        />
                      </div>
                    ))}
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
