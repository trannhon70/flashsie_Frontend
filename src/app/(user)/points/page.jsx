"use client";
import {
  Button,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import * as leaderboardAPI from "@/apisNew/leaderboard";

const Profile = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const [total, setTotal] = useState(0);

  const score = useQuery({
    queryKey: ["my-scores", page, perPage],
    queryFn: () =>
      leaderboardAPI.getMyScores({ page, perPage }).then((res) => {
        setTotal(res.data.total);
        return res.data.data.map((i, index) => ({
          ...i,
          index: index + 1 + (page * perPage - perPage),
        }));
      }),
  });

  const pages = Math.ceil(total / perPage) || 1;

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

  const renderCell = useCallback((cell, columnKey) => {
    const cellValue = cell[columnKey];

    switch (columnKey) {
      case "name":
        return <p>{cell.parentName}</p>;
      case "score":
        return <p>{cell.score}</p>;
      case "index":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize text-default-400">
              {cell.index}
            </p>
          </div>
        );
      case "type":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize text-default-400">
              {cell.parentKey}
            </p>
          </div>
        );

      default:
        return cellValue;
    }
  }, []);

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

  // if (session.status === "loading") return null;

  return (
    <Table
      aria-label=""
      className="mt-4"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
    >
      <TableHeader
        columns={[
          { name: "No.", uid: "index" },
          { name: "Name", uid: "name" },
          { name: "Type", uid: "type" },
          { name: "Point", uid: "score" },
        ]}
      >
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "end" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={score.data || []}
        emptyContent={score.isLoading || "No data to display."}
        isLoading={score.isLoading}
        loadingContent={<Spinner label="Loading..." />}
      >
        {(item) => (
          <TableRow key={item.index}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default Profile;
