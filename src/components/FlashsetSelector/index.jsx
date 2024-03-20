"use client";
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Pagination,
    Select,
    SelectItem,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@nextui-org/react";
import { Formik } from "formik";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

import * as flashsetAPINew from "@/apisNew/flashsets";
import { useProfile } from "@/hooks/useProfile";
import config from "@/utils/config";
import { useQuery } from "@tanstack/react-query";

const FlashsetSelector = ({ children, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { users, fetchProfile } = useProfile();

  const [state, setState] = useState({
    name: "",
    type: "all",
    role: users?.type === "teacher" ? users?.type : "admin",
  });
  const [selected, setSelected] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pages = Math.ceil(total / perPage) || 1;

  useEffect(() => {
    fetchProfile();
  }, []);

  const flashset = useQuery({
    queryKey: [
      "search-flashsets",
      page,
      perPage,
      state.name,
      state.type,
      state.role,
    ],
    queryFn: () =>
      flashsetAPINew
        .getFlashcardsByRole({
          page: page,
          perPage: perPage,
          filter_role: state.role,
          search_name: state.name,
          category: state.type,
        })
        .then((res) => {
          setTotal(res.data.total);
          return res.data.data;
        }),
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

  const onNextPage = useCallback(() => {
    if (page < pages) setPage(page + 1);
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) setPage(page - 1);
  }, [page]);

  const bottomContent = useMemo(() => {
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden w-[30%] justify-end gap-2 sm:flex">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [page, pages]);

  return (
    <>
      <div className="relative" onClick={() => setIsOpen(true)}>
        {children}
        <div className="absolute bottom-0 left-0 right-0 top-0 cursor-pointer" />
      </div>
      <Modal
        isOpen={isOpen}
        size="2xl"
        isDismissable={false}
        onOpenChange={() => {
          setIsOpen(false);
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-row text-center">
            List Flash Set{" "}
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
                      placeholder="Search Flash set name"
                      // className='my-2 min-w-[320px]'
                      name="name"
                      errorMessage={errors.name}
                      value={values.name}
                      onChange={handleChange}
                    />
                    <Select
                      label="Type"
                      name="type"
                      className="w-72"
                      defaultSelectedKeys={
                        values.type ? [values.type] : undefined
                      }
                      onChange={handleChange}
                    >
                      <SelectItem key={"all"} value={"all"}>
                        All
                      </SelectItem>
                      {config.flashsetTypes.map((i) => (
                        <SelectItem key={i.id} value={i.id}>
                          {i.name}
                        </SelectItem>
                      ))}
                    </Select>
                    {users.role === "admin" && (
                      <Select
                        label="Role"
                        name="role"
                        className="w-56"
                        defaultSelectedKeys={
                          values.role ? [values.role] : undefined
                        }
                        onChange={handleChange}
                      >
                        <SelectItem key={"admin"} value={"admin"}>
                          Admin
                        </SelectItem>
                        <SelectItem key={"teacher"} value={"teacher"}>
                          Teacher
                        </SelectItem>
                      </Select>
                    )}

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
              bottomContent={bottomContent}
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
