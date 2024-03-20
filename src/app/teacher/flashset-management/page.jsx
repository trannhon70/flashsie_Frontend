"use client";
import * as flashsetAPINew from "@/apisNew/flashsets";
import BreadCrumbs from "@/components/layouts/Breadcrumb";
import { SessionStore } from "@/config/sesstionStore";
import config from "@/utils/config";
import constants from "@/utils/constants";
import { alert, searchByName } from "@/utils/helpers";
import {
  Button,
  Input,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BiSolidEdit, BiSolidLayerPlus, BiTrash } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import { LuAlignHorizontalDistributeCenter } from "react-icons/lu";
import ModalFlashetDistribute from "./modalFlashetDistribute";

const columns = [
  { name: constants.label_no, uid: "index", class: "w-5 text-center" },
  { name: "Name", uid: "name", class: "text-center" },
  {
    name: constants.label_flashset_type,
    uid: "type",
    class: "w-24 text-center",
  },
  // { name: 'Create', uid: 'createdAt' },
  // { name: 'ACCESS', uid: 'type' },
  { name: "Status", uid: "status", class: "w-24 text-center" },
  { name: constants.label_edit, uid: "actions", class: "w-24 text-center" },
];

const Courses = () => {
  const queryClient = useQueryClient();
  const user = SessionStore.getUserSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const [total, setTotal] = useState(0);
  const [filterValue, setFilterValue] = useState("");
  const [type, setType] = useState("");
  const [active, setActive] = useState("teacher");
  const [search, setSearch] = useState("");
  const [teacher, setTeacher] = useState([]);
  const [flashetId, setFlashetId] = useState("");

  const course = useQuery({
    queryKey: ["flashset-management", page, perPage, active, filterValue, type],
    queryFn: () =>
      flashsetAPINew
        .getFlashcardsByRole({
          page,
          perPage,
          filter_role: active,
          search_name: filterValue,
          category: type || "",
        })
        .then((res) => {
          setTotal(res.data.total);
          return res.data.data.map((i, index) => ({
            ...i,
            index: index + 1 + (page * perPage - perPage),
          }));
        }),
    enabled: active !== undefined,
  });

  useEffect(() => {
    course.refetch();
  }, [active]);

  const pages = Math.ceil(total / perPage) || 1;

  const dataTeacher = async () => {
    const result = await flashsetAPINew.getTeacherDistributed(flashetId);
    setTeacher([...result.data.teacher_join, ...result.data.no_teachers_join]);
  };

  useEffect(() => {
    if (flashetId) {
      dataTeacher();
    }
  }, [search, flashetId]);

  const handleDel = (id) => () => {
    alert.deleteComfirm({
      onDelete: () =>
        flashsetAPINew
          .del(id)
          .then(() => queryClient.refetchQueries(["flashset-management"])),
    });
  };

  const renderCell = useCallback((cell, columnKey) => {
    const cellValue = cell[columnKey];

    switch (columnKey) {
      case "name":
        return <p className="text-center">{cell.name}</p>;
      case "index":
        return (
          <div className="text-bold text-center text-sm capitalize text-default-400">
            {cell.index}
          </div>
        );
      case "type":
        return (
          <div className="text-bold w-24 text-center text-sm capitalize text-default-400">
            {cell.type}
          </div>
        );
      case "status":
        return (
          <div className="text-bold w-24 text-center text-sm capitalize text-default-400">
            {cell.status}
          </div>
        );
      case "actions":
        return (
          <div className="relative flex w-24 items-center justify-center gap-2">
            <Tooltip content="Edit">
              <Link href={`/teacher/flashset-management/edit?id=${cell.id}`}>
                <span className="cursor-pointer text-lg text-default-400 active:opacity-50">
                  <BiSolidEdit />
                </span>
              </Link>
            </Tooltip>

            <Tooltip content="Add flash card">
              <Link href={`/teacher/flashset-management/${cell.id}/cards`}>
                <span className="cursor-pointer text-lg text-default-400 active:opacity-50">
                  <BiSolidLayerPlus />
                </span>
              </Link>
            </Tooltip>
            <Tooltip color="danger" content="Delete">
              <span
                className="cursor-pointer text-lg text-default-400 active:opacity-50"
                onClick={handleDel(cell.id)}
              >
                <BiTrash />
              </span>
            </Tooltip>
            {user.role === "admin" && (
              <Tooltip color="success" content="Distribute to:">
                <span
                  className="cursor-pointer text-lg text-default-400 active:opacity-50"
                  onClick={() => handleOpen(cell)}
                >
                  <LuAlignHorizontalDistributeCenter />
                </span>
              </Tooltip>
            )}
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const handleOpen = (cell) => {
    setFlashetId(cell.id);
    onOpen();
  };
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
          <div className="flex flex-1 flex-row items-center gap-2">
            <Input
              isClearable
              className="w-64"
              placeholder="Search by name..."
              startContent={<BsSearch />}
              value={filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
            />
            <Select
              size="sm"
              label={constants.label_flashset_type}
              name={"type"}
              value={type}
              selectionMode="single"
              // selectedKeys={type?.length > 0 ? [''] : undefined}
              className="w-36"
              classNames={{ mainWrapper: "h-10 w-36" }}
              onChange={({ target }) => setType(target.value)}
            >
              {config.flashsetTypes.map((i) => (
                <SelectItem key={i.id} value={i.id}>
                  {i.name}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="flex gap-3">
            <Link href="/teacher/flashset-management/edit">
              <Button color="primary" startContent={<AiOutlinePlus />}>
                Add New
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }, [total, perPage, filterValue, onRowsPerPageChange]);

  const bottomContent = useMemo(() => {
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <div className="w-[30%]" />

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

  const renderTab = () => {
    return (
      <>
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
        <Table
          aria-label=""
          className="mt-4"
          isHeaderSticky
          // topContent={topContent}
          topContentPlacement="outside"
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          classNames={{
            wrapper: "bg-blue-100 p-0 rounded-md border-2 border-[#5E9DD0]",
            thead: "[&>tr]:first:shadow-none",
            th: [
              "bg-transparent",
              "font-semibold",
              "text-slate-700",
              "border-b-2",
              "border-divider",
              "border-[#5E9DD0] ",
            ],
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                className={column.class}
                align={column.uid === "actions" ? "end" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={course?.data || []}
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
      </>
    );
  };

  const searchResult = searchByName(teacher, search);

  return (
    <div className="w-ful">
      <BreadCrumbs />
      {topContent}
      <div className=" mt-2 text-center">
        <Tabs
          className="text-sm"
          size="lg"
          color="warning"
          onSelectionChange={(key) => {
            setActive(key);
          }}
          on
          key="light"
          variant="light"
          aria-label="Tabs variants"
        >
          {user?.role === "admin" && (
            <Tab
              key="admin"
              title={
                <>
                  <div className={active === "admin" ? "text-white" : ""}>
                    Admin
                  </div>
                </>
              }
            >
              {renderTab()}
            </Tab>
          )}

          <Tab
            key="teacher"
            title={
              <>
                <div className={active === "teacher" ? "text-white" : ""}>
                  Teacher
                </div>
              </>
            }
          >
            {renderTab()}
          </Tab>
        </Tabs>
      </div>
      <ModalFlashetDistribute
        isOpen={isOpen}
        onClose={onClose}
        teacher={searchResult}
        setSearch={setSearch}
        flashetId={flashetId}
        dataTeacher={dataTeacher}
        setTeacher={setTeacher}
        setFlashetId={setFlashetId}
      />
    </div>
  );
};

export default Courses;
