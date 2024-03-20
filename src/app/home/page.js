"use client";
import Image from "next/image";
import CardBoxList from "@/components/common/CardBoxList";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import Link from "next/link";
import * as flashsetsAPINew from "@/apisNew/flashsets";
import * as coursesAPI from "@/apis/courses";
import * as coursesAPINew from "@/apisNew/courses";
import * as gamesAPINew from "@/apisNew/games";
import { Button, Card, Skeleton } from "@nextui-org/react";
import PageLayout from "@/components/layouts/PageLayout";
import { BsCardChecklist } from "react-icons/bs";
import { alert } from "@/utils/helpers";
import { useEffect, useState } from "react";
import Survey from "@/components/Survey";
import constants from "@/utils/constants";
import { useRouter } from "next/navigation";
import { SessionStore } from "@/config/sesstionStore";

export default function Home() {
  const router = useRouter();
  const flashsets = useQuery({
    queryKey: ["flashsets", 1, 10],
    queryFn: () =>
      flashsetsAPINew.getFlashsets({ page: 1, perPage: 10 }).then((res) => {
        return res.data;
      }),
  });

  const games = useQuery({
    queryKey: ["games", 1, 10],
    queryFn: () =>
      gamesAPINew.readAll({ page: 1, perPage: 10 }).then((res) => {
        return res.data;
      }),
  });

  const course = useQuery({
    queryKey: ["courses-active", 1, 10],
    queryFn: () =>
      coursesAPINew
        .getCourses({ page: 1, perPage: 10, params: { filter: "active" } })
        .then((res) => {
          return res.data;
        }),
  });

  const courseInvites = useQuery({
    queryKey: ["invite_courses", 1, 10],
    queryFn: () =>
      coursesAPINew.getInvites({ page: 1, perPage: 10 }).then((res) => {
        return res.data;
      }),
  });
  const courseFree = useQuery({
    queryKey: ["courses-free", 1, 5],
    queryFn: () =>
      coursesAPINew
        .getCourses({ page: 1, perPage: 5, params: { filter: "free" } })
        .then((res) => {
          return res.data;
        }),
  });

  useEffect(() => {
    if (!SessionStore.getUserSession()?.id) {
      router.replace("/login");
    }
  }, []);

  return (
    <PageLayout hideNavigator={true}>
      <Survey />
      <div className="w-full p-1 md:px-4">
        {courseInvites?.isFetched && courseInvites?.data?.data?.length > 0 && (
          <CardBoxList
            className={"mt-8 font-semibold"}
            title={"COURSE INVITE"}
            icon={<BsCardChecklist size={20} color="#5E9DD0" />}
            titleColor={"#5E9DD0"}
          >
            {courseInvites?.isLoading && <p>Loading...</p>}
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {courseInvites?.data?.data?.map?.((i, idx) => (
                <CourseInviteItem key={i?.id} item={i} />
              ))}
            </div>
          </CardBoxList>
        )}

        {course?.data?.data?.length > 0 && (
          <CardBoxList
            className={"mt-8 font-semibold"}
            title={constants?.label_course_active}
            titleColor={"#9747FF"}
          >
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {course?.data?.data?.map((i) => (
                <Link
                  key={i?.id}
                  href={`/courses/${i?.id}`}
                  className="cursor-pointer"
                >
                  <Card className="relative overflow-hidden rounded-2xl">
                    <Image
                      src={i?.image}
                      width={320}
                      height={320}
                      className="aspect-square"
                      alt="1"
                    />
                  </Card>
                  <p className="mt-2">{i?.name}</p>
                </Link>
              ))}

              {course?.isLoading && (
                <>
                  <Card className="w-full space-y-5 p-4" radius="lg">
                    <Skeleton className="rounded-lg">
                      <div className="h-24 rounded-lg bg-default-300"></div>
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
                  </Card>
                  <Card className="w-full space-y-5 p-4" radius="lg">
                    <Skeleton className="rounded-lg">
                      <div className="h-24 rounded-lg bg-default-300"></div>
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
                  </Card>
                  <Card className="w-full space-y-5 p-4" radius="lg">
                    <Skeleton className="rounded-lg">
                      <div className="h-24 rounded-lg bg-default-300"></div>
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
                  </Card>
                </>
              )}
            </div>
          </CardBoxList>
        )}

        <CardBoxList
          className={"mt-8 font-semibold"}
          title={constants?.label_recomment_flashset}
          titleColor={"#D05E5E"}
          linkMore={"/flashsets"}
        >
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {flashsets?.data?.data?.length === 0 && <p>No data to display</p>}
            {flashsets?.data?.data?.map((i) => (
              <Link
                key={i?.id}
                href={`/flashsets/${i?.id}`}
                className="cursor-pointer"
              >
                <Card className="relative overflow-hidden rounded-2xl">
                  <Image
                    src={i?.image}
                    width={320}
                    height={320}
                    className="aspect-square"
                    alt="2"
                  />
                </Card>
                <p className="mt-2">{i?.name}</p>
              </Link>
            ))}
            {flashsets?.isLoading && (
              <>
                <Card className="w-full space-y-5 p-4" radius="lg">
                  <Skeleton className="rounded-lg">
                    <div className="h-24 rounded-lg bg-default-300"></div>
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
                </Card>
                <Card className="w-full space-y-5 p-4" radius="lg">
                  <Skeleton className="rounded-lg">
                    <div className="h-24 rounded-lg bg-default-300"></div>
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
                </Card>
                <Card className="w-full space-y-5 p-4" radius="lg">
                  <Skeleton className="rounded-lg">
                    <div className="h-24 rounded-lg bg-default-300"></div>
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
                </Card>
              </>
            )}
          </div>
        </CardBoxList>

        {courseFree?.data?.data?.length > 0 && (
          <CardBoxList
            className={"mt-8 font-semibold"}
            title={constants?.label_course_free}
            titleColor={"#dd7b02"}
            // linkMore={'/'}
          >
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {courseFree?.data?.data?.map((i) => (
                <Link
                  key={i?.id}
                  href={`/courses/${i?.id}`}
                  className="cursor-pointer"
                >
                  <Card className="relative overflow-hidden rounded-2xl">
                    <Image
                      src={i?.image}
                      width={320}
                      height={320}
                      className="aspect-square"
                      alt="3"
                    />
                  </Card>
                  <p className="mt-2">{i?.name}</p>
                </Link>
              ))}
              {flashsets?.isLoading && (
                <>
                  <Card className="w-full space-y-5 p-4" radius="lg">
                    <Skeleton className="rounded-lg">
                      <div className="h-24 rounded-lg bg-default-300"></div>
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
                  </Card>
                  <Card className="w-full space-y-5 p-4" radius="lg">
                    <Skeleton className="rounded-lg">
                      <div className="h-24 rounded-lg bg-default-300"></div>
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
                  </Card>
                  <Card className="w-full space-y-5 p-4" radius="lg">
                    <Skeleton className="rounded-lg">
                      <div className="h-24 rounded-lg bg-default-300"></div>
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
                  </Card>
                </>
              )}
            </div>
          </CardBoxList>
        )}

        {games?.data?.data?.length > 0 && (
          <CardBoxList
            className={"mt-8 font-semibold"}
            title={constants?.label_recomment_minigame}
            titleColor={"#00BE20"}
            // linkMore={'/'}
          >
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {games?.data?.data?.map((i) => (
                <Link
                  key={i?.id}
                  href={`/games/${i?.id}`}
                  className="cursor-pointer"
                >
                  <Card className="relative overflow-hidden rounded-2xl ">
                    <Image
                      src={i?.image}
                      width={320}
                      height={320}
                      className="aspect-square"
                      alt="4"
                    />
                  </Card>
                  <p className="mt-2">{i?.name}</p>
                </Link>
              ))}
              {games?.isLoading && (
                <>
                  <Card className="w-full space-y-5 p-4" radius="lg">
                    <Skeleton className="rounded-lg">
                      <div className="h-24 rounded-lg bg-default-300"></div>
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
                  </Card>
                  <Card className="w-full space-y-5 p-4" radius="lg">
                    <Skeleton className="rounded-lg">
                      <div className="h-24 rounded-lg bg-default-300"></div>
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
                  </Card>
                  <Card className="w-full space-y-5 p-4" radius="lg">
                    <Skeleton className="rounded-lg">
                      <div className="h-24 rounded-lg bg-default-300"></div>
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
                  </Card>
                </>
              )}
            </div>
          </CardBoxList>
        )}
      </div>
    </PageLayout>
  );
}

const CourseInviteItem = ({ item }) => {
  const queryClient = useQueryClient();
  const user = SessionStore.getUserSession();

  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const accept = (courseId) => () => {
    setAcceptLoading(true);
    coursesAPINew
      .updateStudent(courseId, user.id, "accepted")
      .then(() => {
        setAcceptLoading(false);
        queryClient?.refetchQueries(["courses-active"]);
        queryClient?.refetchQueries(["invite_courses"]);
        alert.success(`Course has been accepted!`);
      })
      .catch(() => {
        setAcceptLoading(false);
      });
  };
  const reject = (courseId) => () => {
    setRejectLoading(true);
    coursesAPINew
      .updateStudent(courseId, user.id, "rejected")
      .then(() => {
        setRejectLoading(false);
        queryClient?.refetchQueries(["courses-active"]);
        queryClient?.refetchQueries(["invite_courses"]);
        alert.success(`Course has been rejected!`);
      })
      .catch(() => {
        setRejectLoading(false);
      });
  };
  return (
    <div className="mt-2 flex flex-row items-center justify-between  gap-10 rounded-lg border-2 border-[#1D365D] bg-[#FCC27C] p-2">
      <p>
        {item?.name} | {item?.creator?.name} | Time 07AM - 08PM
      </p>
      <div className="flex flex-row gap-4">
        <Button
          isDisabled={rejectLoading}
          isLoading={acceptLoading}
          color="primary"
          size="sm"
          className="bg-[#1D365D]"
          onPress={accept(item?.id)}
        >
          OK
        </Button>
        <Button
          isDisabled={acceptLoading}
          isLoading={rejectLoading}
          color="primary"
          variant="ghost"
          size="sm"
          className="text-#1D365D] border-[#1D365D]"
          onPress={reject(item?.id)}
        >
          NO
        </Button>
      </div>
    </div>
  );
};
