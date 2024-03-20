"use client";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { memo, useRef, useState } from "react";

import * as courseAPINew from "@/apisNew/courses";
import constants from "@/utils/constants";
import { alert } from "@/utils/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CreateQuiz = ({ children, courseId, flashsetId, totalCards }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [types, setTypes] = useState([]);
  const [count, setCount] = useState();
  const [inOrder, setInOrder] = useState(true);
  const queryClient = useQueryClient();
  const disabled = useRef(false);
  const [check, setCheck] = useState(false);

  const createQuiz = useMutation(
    (values) => {
      return courseAPINew.createQuiz(courseId, flashsetId, values);
    },
    {
      onMutate: async (values) => {
        disabled.current = true;
        return values;
      },
      onSuccess: (res) => {
        alert.success("Quiz has been created successfully!");
        setIsOpen(false);
        queryClient.refetchQueries(["course-flashsets"]);
        disabled.current = false;
      },
      onError: (error) => {
        disabled.current = false;
        console.log(error);
        alert.error("Failed to create!");
      },
    }
  );

  const handleCreateQuiz = () => {
    if (disabled.current) return;
    const countAsNumber = Number(count);
    const inOrderAsBoolean = Boolean(inOrder);
    createQuiz.mutate({
      types,
      count: countAsNumber,
      inOrder: inOrderAsBoolean,
    });
  };

  const handleChangeInput = (e) => {
    if (Number(e.target.value) > Number(totalCards)) {
      return setCheck(true);
    } else {
      setCheck(false);
      setCount(e.target.value);
    }
  };

  return (
    <>
      <div
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {children}
      </div>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          size="xl"
          onOpenChange={() => {
            setIsOpen(false);
          }}
          isDismissable={false}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-row text-center">
                  {constants.quiz_let_choose}
                </ModalHeader>
                <ModalBody>
                  <CheckboxGroup
                    label="Types"
                    defaultValue={types}
                    onChange={setTypes}
                  >
                    <Checkbox value="abcd">{constants.quiz_abcd}</Checkbox>
                    <Checkbox value="arrange-word">
                      {constants.quiz_arrange_word}
                    </Checkbox>
                    <Checkbox value="blank">{constants.quiz_blank}</Checkbox>
                  </CheckboxGroup>
                  <Input
                    label="Number of Questions"
                    type="number"
                    value={count}
                    onChange={handleChangeInput}
                    isInvalid={check}
                    errorMessage={
                      check
                        ? `The number of questions must be less than ${totalCards}`
                        : ""
                    }
                  />
                  <Select
                    label="Select option"
                    fullWidth={true}
                    onChange={(e) => setInOrder(e.target.value)}
                  >
                    {[
                      { title: "Randomly", value: false },
                      { title: "Orderly", value: true },
                    ].map((e) => (
                      <SelectItem key={e.value} value={e.value}>
                        {e.title}
                      </SelectItem>
                    ))}
                  </Select>
                </ModalBody>
                <ModalFooter>
                  <Button
                    onPress={handleCreateQuiz}
                    isDisabled={types.length === 0}
                    isLoading={createQuiz.isLoading}
                    color="primary"
                  >
                    Create Quiz
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

function areEqual(p, n) {
  return true;
}

export default memo(CreateQuiz);
