"use client";
import { useQuery } from "@tanstack/react-query";

import * as gamesAPINew from "@/apisNew/games";
import { Button, Card, Skeleton } from "@nextui-org/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { AiFillLock } from "react-icons/ai";
import { BsImages } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import GameModal from "./GameModal";

export default function MiniGame() {
  const router = useRouter();
  const { id } = useParams();
  const game = useQuery({
    queryKey: ["game", id],
    queryFn: () => gamesAPINew.readById(id),
  });
  const scenes = useQuery({
    queryKey: ["game-scenes", id],
    queryFn: () => gamesAPINew.scenes(id),
    // refetchOnWindowFocus: 'always',
    // // refetchOnMount: 'always',
    // refetchInterval: 2000,
  });


  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between">
        <Button onPress={router.back} isIconOnly variant="light">
          <IoIosArrowBack size={24} />
        </Button>
        <p className="text-xl">{game?.data?.data?.name}</p>
        <div className="w-6" />
      </div>

      <Image
        className="mt-4 aspect-square w-full rounded-lg"
        width={480}
        height={480}
        src={game?.data?.data?.image}
        alt={game?.data?.data?.name}
      />
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {scenes?.data?.data?.map?.((i) =>
        
          i.isBlocked ? (
            <Card
              key={i.id}
              className="flex aspect-square w-full cursor-not-allowed flex-col items-center justify-center overflow-hidden rounded-2xl bg-gray-200"
            >
              <AiFillLock size={40} className="opacity-10" />
            </Card>
          ) : (
            <GameModal
              key={i.id}
              game={game.data.data}
              scene={i}
              scenes={scenes.data.data}
              onClose={scenes.refetch}
            >
              <Card className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl bg-gray-200">
                <BsImages size={40} className="opacity-10" />

                <div className="absolute text-2xl">
                  {i.totalCompleted}/{i.totalCards}
                </div>
              </Card>
            </GameModal>
          )
        )}

        {scenes.isLoading && (
          <>
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="aspect-square w-full rounded-lg" />
          </>
        )}
      </div>
    </div>
  );
}
