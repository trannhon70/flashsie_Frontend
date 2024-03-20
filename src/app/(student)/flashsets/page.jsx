"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";

import * as flashsetsAPINew from "@/apisNew/flashsets";
import { Card, CardBody, CardFooter, Spinner } from "@nextui-org/react";
import Link from "next/link";
import React, { useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Page() {
  const [page, setPage] = useState(1);
  const total = useRef(0);
  //   const flashsets = useQuery({
  //     queryKey: ['flashsets', page, 10],
  //     queryFn: () =>
  //       flashsetsAPI.getFlashsets({ page, perPage: 10 }).then((res) => {
  //         return res.data
  //       }),
  //   })

  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery(
    ["projects"],
    async ({ pageParam = 1 }) => {
      const res = await flashsetsAPINew.getFlashsets({
        page: pageParam,
        perPage: 20,
      });
      total.current = res?.data.total;

      return res;
    },
    {
      //   getPreviousPageParam: (firstPage) => firstPage.previousId ?? undefined,
      getNextPageParam: (lastPage) => {
        // const previousPage = lastPage.info.prev
        //   ? +lastPage.info.prev.split('=')[1]
        //   : 0
        const currentPage = lastPage.data.page;
        if (lastPage.data.page * 20 >= lastPage.data.total) return false;
        // if (currentPage === lastPage.info.pages) return false
        return currentPage + 1;
      },
    }
  );
  const loadMore = () => {
    if (flashsets.isLoading) return;
    setPage((s) => s + 1);
  };

  if (status === "loading")
    return <Spinner size="lg" className="mt-8 self-center" />;
  if (status === "error")
    return <Spinner size="lg" color="danger" className="mt-8 self-center" />;

  return (
    <div className="flex flex-col py-4">
      <h2 className="text-xl">Flash Sets</h2>
      <InfiniteScroll
        dataLength={total.current}
        next={() => {
          fetchNextPage();
        }}
        hasMore={!!hasNextPage}
        loader={<h4>Loading...</h4>}
      >
        <div
          className={`grid grid-cols-2 gap-4 py-4 md:grid-cols-3 lg:grid-cols-5`}
        >
          {data?.pages?.map((page) => (
            <React.Fragment key={page.nextId}>
              {page?.data?.data?.map((i) => (
                <Link
                  key={i.id}
                  href={`/flashsets/${i.id}`}
                  className="cursor-pointer"
                >
                  <Card shadow="sm" className="w-full">
                    <CardBody className="overflow-visible p-0">
                      <Image
                        width={320}
                        height={320}
                        alt={i.name}
                        className="aspect-square w-full"
                        src={i.image}
                      />
                    </CardBody>
                    <CardFooter className="justify-between text-small">
                      <b className="line-clamp-1">{i.name}</b>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </React.Fragment>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
