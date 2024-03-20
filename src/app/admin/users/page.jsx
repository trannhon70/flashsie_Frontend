"use client";
import ImportUsers from "@/components/ImportUsers";
import BreadCrumbs from "@/components/layouts/Breadcrumb";
import {
  Button,
  Chip,
  Input,
  Pagination,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  User,
} from "@nextui-org/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { AiFillSetting } from "react-icons/ai";
import { BiSolidCopy, BiTrash } from "react-icons/bi";

import * as userAPI from "@/apis/user";
import * as userAPINew from "@/apisNew/user";
import * as courseAPINew from "@/apisNew/courses";
import constants from "@/utils/constants";
import { alert, copyToClipboard, useWindowSize } from "@/utils/helpers";
import dayjs from "dayjs";
import { BsSearch } from "react-icons/bs";
import { FaFileDownload } from "react-icons/fa";

const statusColorMap = {
  active: "success",
  deleted: "danger",
  inactive: "warning",
};

const columns = [
  { name: "No.", uid: "index" },
  { name: "Name", uid: "name" },
  { name: "Type", uid: "type" },
  { name: "Create", uid: "createdAt" },
  // { name: 'ACCESS', uid: 'type' },
  { name: "Status", uid: "status" },
  { name: "", uid: "actions" },
];

const Courses = () => {
  const queryClient = useQueryClient();
  const { isMobile, isTablet } = useWindowSize();
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "age",
    direction: "ascending",
  });
  const [filterValue, setFilterValue] = useState("");
  const [total, setTotal] = useState(0);

  const course = useQuery({
    queryKey: ["users", page, perPage, filterValue],
    queryFn: () =>
      userAPINew
        .getUsers({ page, perPage, search: filterValue })
        .then((res) => {
          setTotal(res.data.total);
          return res.data.data.map((i, index) => ({
            ...i,
            index: index + 1 + (page * perPage - perPage),
          }));
        }),
  });

  const pages = Math.ceil(total / perPage) || 1;

  const handleDel = (id) => () => {
    alert.deleteComfirm({
      onDelete: () =>
        userAPINew
          .deleteUser(id)
          .then(() => queryClient.refetchQueries(["users"])),
    });
  };
  const handleType = (id) => (e) => {
    userAPINew
      .updateType(id, { type: e.target.value })
      .then(() => queryClient.refetchQueries(["users"]))
      .catch(() => {
        alert.error("Failed to update!");
      });
  };

  const generateToken = async (courseId) => {
    try {
      // const res = await courseAPINew.createToken(courseId);
      // console.log(res, "ress");
      // if (res.data.token) {
      copyToClipboard(courseId);
      // }
    } catch (error) {
      alert.error(error?.response?.data?.message || "Failed to create!");
    }
  };

  const renderCell = useCallback((cell, columnKey) => {
    const cellValue = cell[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: cell.avatar }}
            description={cell.email}
            name={cell.name}
          />
        );
      case "index":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize text-default-400">
              {cell.index}
            </p>
          </div>
        );
      case "createdAt":
        return (
          <div className="flex flex-col">
            {/* <p className='text-bold text-sm capitalize'>{cellValue}</p> */}
            <p className="text-bold text-sm capitalize text-default-400">
              {dayjs(cell.createdAt).format(constants.format_date)}
            </p>
          </div>
        );
      case "type":
        return (
          <div className="flex flex-col">
            <select
              defaultValue={cell.type}
              className="w-20 rounded-sm"
              aria-label="select"
              aria-labelledby="dsd"
              onChange={handleType(cell.id)}
            >
              <option value={"teacher"}>Teacher</option>
              <option value={"student"}>Student</option>
            </select>
            {/* <p className='text-bold text-sm capitalize'>{cell.type}</p> */}
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[cell.status]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content={constants.course_copy_token}>
              <span
                onClick={() => generateToken(cell.id)}
                className="hidden cursor-pointer text-lg text-default-400 active:opacity-50 md:block"
              >
                <BiSolidCopy />
              </span>
            </Tooltip>

            <Tooltip color="danger" content="Delete">
              <span
                className="hidden cursor-pointer text-lg text-default-400 active:opacity-50 md:block"
                onClick={handleDel(cell.id)}
              >
                <BiTrash />
              </span>
            </Tooltip>

            <Popover placement="bottom" showArrow={true}>
              <PopoverTrigger>
                <Button
                  isIconOnly
                  variant="light"
                  size="md"
                  className="h-6 w-6 md:hidden"
                >
                  <AiFillSetting />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex flex-col gap-1 py-2">
                  <Button
                    size="sm"
                    variant="light"
                    className="w-full justify-start"
                    onPress={() => copyToClipboard(cell.id)}
                  >
                    <BiSolidCopy /> {constants.course_copy_token}
                  </Button>

                  <Button
                    size="sm"
                    variant="light"
                    className="w-full justify-start"
                    onPress={handleDel(cell.id)}
                  >
                    <BiTrash /> {constants.label_delete}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onRowsPerPageChange = useCallback((e) => {
    setPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <div className="flex w-full flex-col gap-1 sm:max-w-[44%]">
            <div className="flex flex-row gap-1">
              <ImportUsers
                isOpen={true}
                onDone={() => queryClient.refetchQueries(["users"])}
              />
              <a href="/template_insert_users.xlsx" download>
                <div className="flex flex-row items-center justify-center gap-1 rounded-md border bg-slate-300 px-2 py-1">
                  <FaFileDownload />
                  Template file
                </div>
              </a>
            </div>
            <Input
              isClearable
              className="w-full"
              placeholder="Search by name..."
              startContent={<BsSearch />}
              value={filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
            />
          </div>
          {/* <div className='w-full sm:max-w-[44%]'> */}

          {/* </div> */}
          <div className="flex gap-3"></div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">Total {total}</span>
          <label className="flex items-center text-small text-default-400">
            Rows per page:
            <select
              value={`${perPage}`}
              className="bg-transparent text-small text-default-400 outline-none"
              onChange={onRowsPerPageChange}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [total, filterValue, perPage, onRowsPerPageChange]);

  const bottomContent = useMemo(() => {
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <div className="w-[30%]" />
        {/* <span className='w-[30%] text-small text-default-400'>
          {selectedKeys === 'all'
            ? 'All items selected'
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span> */}
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
    <div className="w-ful">
      <BreadCrumbs />
      <Table
        aria-label=""
        className="mt-4"
        isHeaderSticky
        topContent={topContent}
        topContentPlacement="outside"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "bg-blue-100 p-0 rounded-md border-2 border-[#5E9DD0]",
          // table: 'border-collapse border-hidden',
          thead: "[&>tr]:first:shadow-none",
          // td: ' border-2',
          th: [
            "bg-transparent",
            "font-semibold",
            "text-slate-700",
            "border-b-2",
            "border-divider",
            "border-[#5E9DD0] ",
          ],
        }}
        // removeWrapper
        // isCompact
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={course.data || []}
          emptyContent={course.isLoading || "No data to display."}
          isLoading={course.isLoading}
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
    </div>
  );
};

export default Courses;
