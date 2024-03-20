"use client";
import { Button, Skeleton } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import Bookmark from "@/components/Bookmark";
import CountDownModal from "@/components/FlashCardModal/CountDown";
import Dictation from "@/components/FlashCardModal/Dictation";
import LearnModal from "./../../../../../../components/FlashCardModal/Learn/index";
import QuizModal from "@/components/FlashCardModal/Quiz";

import * as courseAPI from "@/apis/courses";
import * as courseAPINew from "@/apisNew/courses";
import * as flashsetsAPI from "@/apis/flashsets";
import * as flashsetsAPINew from "@/apisNew/flashsets";
import constants from "@/utils/constants";
import { useEffect, useState } from "react";

const Flashset = (props) => {
  const searchParams = useSearchParams();
  const { id, flashsetId } = useParams();
  const [loading, setLoading] = useState(false);
  const checkLocal = localStorage.getItem("check");
  const router = useRouter();
  const flashset = useQuery({
    queryKey: ["flashset", flashsetId],
    queryFn: async () => {
      const result = await flashsetsAPINew.getFlashsetById(flashsetId, id);
      return result;
    },
  });
  const quiz = useQuery({
    queryKey: ["course-quiz", id, flashsetId],
    queryFn: () =>
      courseAPINew.getQuiz(id, flashsetId, { page: 1, perPage: 20 }),
  });

  const handleCallbackHistories = async ({ flashcards, type }) => {
    return flashsetsAPINew.histories(flashsetId, type, flashcards, id);
  };

  useEffect(() => {
    if (loading === true) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [loading]);

  const numberIndex = flashset?.data?.data?.quiz;
  const totalQuiz = quiz?.data?.data?.total;
  const formatNumber =
    numberIndex / totalQuiz >= 1
      ? numberIndex - totalQuiz * parseInt(numberIndex / totalQuiz)
      : flashset?.data?.data?.quiz;

  const numberDictation = flashset?.data?.data.dictation;
  const totalCards = flashset?.data?.data.totalCards;
  const formatNumberDictation =
    numberDictation / totalCards >= 1
      ? numberDictation - totalCards * parseInt(numberDictation / totalCards)
      : flashset?.data?.data.dictation;

  if (flashset.isLoading)
    return (
      <div className="w-full space-y-5 p-4" radius="lg">
        <Skeleton className="rounded-lg">
          <div className="h-80 rounded-lg bg-default-300"></div>
        </Skeleton>
        <div className="space-y-3">
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
          </Skeleton>
          <Skeleton className="w-2/5 rounded-lg">
            <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
          </Skeleton>
        </div>
      </div>
    );

  console.log(flashset.data.data, "flashset.data.data");
  return (
    <>
      {loading === true ? (
        <div className="flex h-full min-h-[500px] w-[100%] items-center justify-center ">
          <Image
            src={"/img/flashie-loading-screen.gif"}
            width={220}
            height={100}
          />
        </div>
      ) : (
        <div className="flex w-full flex-col">
          <div className="flex flex-row justify-between">
            {searchParams.get("isBack") != "false" && (
              <Button onPress={router.back} isIconOnly variant="light">
                <IoIosArrowBack size={24} />
              </Button>
            )}
            <p>{flashset?.data?.data?.name}</p>
            <Bookmark
              isBookmark={flashset?.data?.data?.isBookmark}
              parentType="flashset"
              parentId={flashset?.data?.data?.id}
              size={18}
            />
          </div>
          <Image
            className="mt-4 aspect-square h-auto w-full rounded-lg"
            width={100}
            height={80}
            src={flashset.data.data.image}
            alt="img-course-flashet"
          />
          <div className="mt-4 flex flex-row items-center justify-between">
            <p>{constants.label_course_flashset_learn}</p>
            <div className="flex flex-row items-center gap-2">
              <LearnModal
                perPage={20}
                page={Math.ceil((flashset.data.data.learned + 1) / 20)}
                learned={flashset.data.data.learned}
                flashsetId={flashsetId}
                result={flashset?.data?.data.isLearning}
                handleSubmitted={handleCallbackHistories}
                handleRefecth={() => flashset.refetch()}
                setLoading={setLoading}
                courseId={id}
              >
                <Button size="sm" color="primary">
                  Start
                </Button>
              </LearnModal>

              <p className="w-16 text-right">
                {flashset.data.data.learned > flashset.data.data.totalCards
                  ? flashset.data.data.totalCards
                  : flashset.data.data.learned}
                /{flashset.data.data.totalCards}
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-row items-center justify-between">
            <p>{constants.label_course_flashset_feature_2}</p>
            <div className="flex flex-row items-center gap-2">
              <CountDownModal
                flashsetId={flashsetId}
                perPage={21}
                page={Math.ceil((flashset.data.data.countdown + 1) / 21)}
              >
                <Button size="sm" color="primary">
                  Start
                </Button>
              </CountDownModal>
              <p className="w-16 text-right">
                {flashset.data.data.hamburger?.completed >
                flashset.data.data.hamburger?.total
                  ? flashset.data.data.hamburger?.total
                  : flashset.data.data.hamburger?.completed}
                /{flashset.data.data.hamburger?.total}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-row items-center justify-between">
            <p>{constants.label_course_flashset_feature_3}</p>
            <div className="flex flex-row items-center gap-2">
              <Dictation
                flashsetId={flashsetId}
                perPage={20}
                page={Math.ceil((flashset.data.data.dictation + 1) / 20)}
                handleSubmitted={handleCallbackHistories}
                formatNumberDictation={formatNumberDictation}
                setLoading={setLoading}
                handleRefecth={() => flashset.refetch()}
              >
                <Button size="sm" color="primary">
                  Start
                </Button>
              </Dictation>
              <p className="w-16 text-right">
                {(() => {
                  if (
                    flashset.data.data.dictation >
                      flashset.data.data.totalCards &&
                    formatNumberDictation !== 0
                  ) {
                    return formatNumberDictation;
                  } else if (
                    flashset.data.data.dictation >=
                      flashset.data.data.totalCards &&
                    checkLocal === "check"
                  ) {
                    return 0;
                  } else if (
                    flashset.data.data.dictation >
                      flashset.data.data.totalCards &&
                    checkLocal !== "check"
                  ) {
                    return flashset.data.data.totalCards;
                  } else {
                    return flashset.data.data.dictation;
                  }
                })()}
                /{flashset.data.data.totalCards}
              </p>
            </div>
          </div>
          {quiz?.data?.data?.total > 0 && (
            <div className="mt-4 flex flex-row items-center justify-between">
              <p>{constants.label_course_flashset_feature_4}</p>
              <div className="flex flex-row items-center gap-2">
                <QuizModal
                  courseId={id}
                  flashsetId={flashsetId}
                  perPage={20}
                  page={Math.ceil((flashset.data.data.quiz + 1) / 20)}
                  numberFormat={formatNumber}
                  handleSubmitted={handleCallbackHistories}
                >
                  <Button size="sm" color="primary">
                    Start
                  </Button>
                </QuizModal>
                <p className="w-16 text-right">
                  {formatNumber}/{quiz?.data?.data?.total}
                </p>
              </div>
            </div>
          )}
          {/* <div className='mt-4 flex flex-row justify-between'>
        <p>ReQuiz</p>
        <p>18/60</p>
      </div> */}
        </div>
      )}
    </>
  );
};

export default Flashset;
