"use client";
import * as flashsetAPINew from "@/apisNew/flashsets";
import { alert } from "@/utils/helpers";
import {
    Button,
    Checkbox,
    CheckboxGroup,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter
} from "@nextui-org/react";
import React, { useState } from "react";

const ModalFlashetDistribute = ({
  isOpen,
  onClose,
  teacher,
  setSearch,
  flashetId,
  dataTeacher,
  setTeacher,
  setFlashetId,
}) => {
  const [dataCheck, setDataCheck] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const initialSelected = dataCheck
      .filter((item) => item.check === true)
      .map((item) => item.value);
    const reuslt = [...selected, ...initialSelected];
    setSelected(reuslt);
  }, [dataCheck]);

  React.useEffect(() => {
    if (teacher?.length > 0) {
      setDataCheck(
        teacher.map((item, index) => ({
          value: item.id,
          label: `${item.name}`,
          check: item.state_join,
        }))
      );
    }
  }, [teacher]);

  const checkAllGroup = (e) => {
    if (e === true) {
      setSelected(dataCheck.map((item) => item.value));
    } else {
      setSelected([]);
    }
  };

  const onClickComfirm = async () => {
    setLoading(true);
    const body = {
      teachers_ids: selected,
      flashset_id: flashetId,
    };
    const result = await flashsetAPINew.flashsetsDistributed(body);
    console.log(result, "result");
    if (result.message === "Create successfully") {
      dataTeacher();
      alert.success("Successfully distributed");
      setLoading(false);
    }
    setLoading(false);
  };

  const onchangeSelected = (e) => {
    setSelected(e);
  };
  const handleClose = () => {
    setDataCheck([]);
    setSelected([]);
    setSelected([]);
    setTeacher([]);
    setSearch("");
    setFlashetId("");
    setLoading(false);
    onClose();
  };
  return (
    <Modal size="xs" isOpen={isOpen} onClose={handleClose}>
      <ModalContent>
        {(onClose) => (
          <>
            {/* <ModalHeader className='flex flex-col gap-1'>
              Modal Title
            </ModalHeader> */}
            <ModalBody className="">
              <p className="text-lg text-medium">Distribute to:</p>
              <Checkbox
                onValueChange={(e) => {
                  checkAllGroup(e);
                }}
                value="all"
                color="success"
              >
                All Teachers
              </Checkbox>
              <Input
                type="text"
                placeholder="Search name..."
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <CheckboxGroup
                value={selected}
                onValueChange={onchangeSelected}
                color="default"
                style={{ height: "200px", overflowY: "scroll" }}
              >
                {dataCheck.map((item, index) => {
                  return (
                    <Checkbox
                      defaultChecked={true}
                      key={index}
                      value={item.value}
                    >
                      {item.label}
                    </Checkbox>
                  );
                })}
              </CheckboxGroup>
            </ModalBody>
            <ModalFooter className="justify-center">
              <Button
                isLoading={loading}
                color="primary"
                onPress={() => onClickComfirm()}
              >
                Confirm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalFlashetDistribute;
