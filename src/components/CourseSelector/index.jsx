"use client";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from "@nextui-org/react";
import { Formik } from "formik";
import { memo, useCallback, useState } from "react";

import * as courseAPINew from "@/apisNew/courses";
import constants from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";

const FlashsetSelector = ({ children, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState({
    name: "",
    type: "all",
  });
  const [selected, setSelected] = useState([]);

  const flashset = useQuery({
    queryKey: ["search-course", 1, 10, state.name, state.type],
    queryFn: () =>
      courseAPINew
        .myCourses({
          page: 1,
          perPage: 10,
          q: state.name,
          type: state.type,
        })
        .then((res) => res.data.data),
  });

  const handleSearch = (values) => {
    setState(values);
  };
  const handleSubmit = () => {
    if (typeof onSelect == "function") {
      onSelect(selected);
      setIsOpen(false);
    }
  };

  const renderCell = useCallback((cell, columnKey) => {
    const cellValue = cell[columnKey];
    switch (columnKey) {
      // case 'name1':
      //   return (
      //     <User
      //       avatarProps={{ size: 'sm', radius: 'lg', src: cell.image }}
      //       // description={cell.image}
      //       name={cell.name}
      //     >
      //       {cell.name}
      //     </User>
      //   )
      default:
        return cellValue;
    }
  }, []);

  return (
    <>
      <div
        className="relative"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {children}
        <div className="absolute bottom-0 left-0 right-0 top-0" />
      </div>
      <Modal
        isOpen={isOpen}
        size="xl"
        isDismissable={false}
        onOpenChange={() => {
          setIsOpen(false);
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-row text-center">
            List Course
          </ModalHeader>
          <ModalBody>
            <Formik
              onSubmit={handleSearch}
              initialValues={state}
              enableReinitialize={true}
            >
              {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
              }) => (
                <div className="flex w-full flex-col">
                  <div className="flex flex-row gap-2">
                    <Input
                      type="text"
                      label="Search Group"
                      placeholder={"Search " + constants.label_course_name}
                      name="name"
                      errorMessage={errors.name}
                      value={values.name}
                      onChange={handleChange}
                    />
                    {/* <Select
                      label='Type'
                      name='type'
                      className='w-56'
                      defaultSelectedKeys={
                        values.type ? [values.type] : undefined
                      }
                      onChange={handleChange}
                    >
                      <SelectItem key={'all'} value={'all'}>
                        All
                      </SelectItem>
                      {config.flashsetTypes.map((i) => (
                        <SelectItem key={i.id} value={i.id}>
                          {i.name}
                        </SelectItem>
                      ))}
                    </Select> */}

                    <Button
                      type="submit"
                      color="primary"
                      onPress={handleSubmit}
                    >
                      Filter
                    </Button>
                  </div>
                </div>
              )}
            </Formik>

            <Table
              removeWrapper
              // color={selectedColor}
              selectionMode="multiple"
              defaultSelectedKeys={selected.map((i) => i.id)}
              aria-label="Example static collection table"
              onSelectionChange={(s) =>
                s !== "all"
                  ? setSelected(
                      flashset.data?.filter((i) => [...s].indexOf(i.id) > -1)
                    )
                  : setSelected(flashset.data)
              }
            >
              <TableHeader columns={[{ name: "Name", uid: "name" }]}>
                {(column) => (
                  <TableColumn
                    key={column.uid}
                    className="w-full"
                    align={"start"}
                  >
                    {column.name}
                  </TableColumn>
                )}
                {/* <TableColumn>ROLE</TableColumn>
                <TableColumn>STATUS</TableColumn> */}
              </TableHeader>
              <TableBody
                items={flashset.data || []}
                emptyContent={flashset.isLoading || "No data to display."}
                isLoading={flashset.isLoading}
                loadingContent={<Spinner label="Loading..." />}
              >
                {(item) => (
                  <TableRow key={item.id}>
                    {(columnKey) => (
                      <TableCell>{renderCell(item, columnKey)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* <p className='mt-4 text-center text-large text-lg'>Name</p>
            <div className='flex flex-col'>
              {[1, 2, 3, 4, 5, 6].map((i, idx) => (
                <Checkbox
                  name={i}
                  key={idx}
                  defaultSelected
                  size='md'
                  onChange={handleChange}
                >
                  Name {i}
                </Checkbox>
              ))}
            </div> */}
          </ModalBody>

          <ModalFooter>
            <Button
              color="primary"
              isDisabled={selected.length === 0}
              // isLoading={create.isLoading}
              onPress={handleSubmit}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

function areEqual(p, n) {
  return true;
}

export default memo(FlashsetSelector, areEqual);
