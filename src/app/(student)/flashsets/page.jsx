"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";

import * as flashsetsAPINew from "@/apisNew/flashsets";
import { Card, CardBody, CardFooter, Spinner } from "@nextui-org/react";
import Link from "next/link";
import React, { useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Page() {
  const [page, setPage] = useState(20);
  const total = useRef(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fecthData = async () => {
    const res = await flashsetsAPINew.getFlashsets({
      page: 1,
      perPage: page,
    });
    total.current = res?.data.total;
    setData(res?.data?.data);
  };

  React.useEffect(() => {
    const fetchLoading = async () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    };
    fetchLoading();
  }, []);

  React.useEffect(() => {
    fecthData();
  }, [page]);

  React.useEffect(() => {
    function handleScroll() {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        if (page <= Number(total.current)) {
          setPage((prevPage) => prevPage + 10);
        }
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, total.current]);
  
  const loadMore = () => {
    if (flashsets.isLoading) return;
    setPage((s) => s + 1);
  };

  if (loading) return <Spinner size="lg" className="mt-8 self-center" />;
  // if (status === "error")
  //   return <Spinner size="lg" color="danger" className="mt-8 self-center" />;

  return (
    <div className="flex flex-col py-4">
      <h2 className="text-xl">Flash Sets</h2>

      <div
        className={`grid grid-cols-2 gap-4 py-4 md:grid-cols-3 lg:grid-cols-5`}
      >
        {data?.map((i) => (
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
      </div>
    </div>
  );
}
