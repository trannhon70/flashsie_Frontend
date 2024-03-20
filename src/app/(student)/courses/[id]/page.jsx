"use client";
// import { useEffect, memo, useState, useCallback } from 'react'
import { BsPersonFillAdd, BsPersonFillDash } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
// import LearnModal from './components/Learn/LearnModal'
// import CountDownModal from './components/CountdownModal'
import Bookmark from "@/components/Bookmark";

import { Button, Skeleton, User } from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import * as userAPI from "@/apis/user";
import * as userAPINew from "@/apisNew/user";
import * as coursesAPINew from "@/apisNew/courses";
import * as flashsetsAPINEW from "@/apisNew/flashsets";
import { SessionStore } from "@/config/sesstionStore";
import { alert } from "@/utils/helpers";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/useProfile";

const Course = () => {
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const { id } = useParams();
  const router = useRouter();
  const course = useQuery({
    queryKey: ["course", id],
    queryFn: () => coursesAPINew.getCourseById(id),
  });
  const students = useQuery({
    queryKey: ["course-students", id],
    queryFn: () =>
      coursesAPINew
        .getStudents(id, { page: 1, perPage: 20 })
        .then((r) => r.data),
  });

  const flashsets = useQuery({
    queryKey: ["course-flashsets", id, 1, pageSize],
    queryFn: () =>
      flashsetsAPINEW
        .getFlashsets({ page: 1, perPage: pageSize, params: { course: id } })
        .then((res) => {
          setTotal(res.total);
          setLoading(false);
          return res.data;
        }),
  });

  const onClickSeeMore = () => {
    setLoading(true);
    setPageSize((size) => pageSize + 10);
  };

  if (course.isLoading)
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
          <Skeleton className="w-2/5 rounded-lg">
            <div className="h-3 w-2/5 rounded-lg bg-default-400"></div>
          </Skeleton>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col">
      {searchParams.get("view_mode") != "full" && (
        <div className="flex flex-row justify-between">
          <Button onPress={router.back} isIconOnly variant="light">
            <IoIosArrowBack size={24} />
          </Button>
        </div>
      )}
      <div className="flex flex-col gap-5 ">
        <Image
          className="mt-4 aspect-square w-full rounded-lg"
          width={480}
          height={480}
          src={course?.data?.data?.image}
          alt={course?.data?.data?.name}
        />
        <div className="mt-4 flex cursor-pointer flex-col items-start">
          <p className="text-xl font-semibold">{course?.data?.data?.name}</p>
          <User
            avatarProps={{
              src: course?.data?.data?.creator?.avatar,
              size: "sm",
            }}
            name={course?.data?.data?.creator?.name}
          />
        </div>
      </div>

      <div className="mt-4 flex cursor-pointer flex-row justify-between">
        <p className="text-lg font-semibold">Flash Sets</p>
        {/* <p>More</p> */}
      </div>
      <div className="mt-2 grid w-full grid-flow-row grid-cols-3 gap-2">
        {flashsets?.data?.data?.length == 0 && (
          <p className="mb-4 text-default-400">No data to display</p>
        )}
        {flashsets?.data?.data?.map((i) => (
          <Link
            href={`/courses/${id}/flashsets/${i.id}`}
            key={i.id}
            className="flex flex-1 flex-col gap-2"
          >
            <Image
              className="aspect-square w-full rounded-md"
              width={100}
              height={100}
              src={i.image}
              alt={i.name}
            />
            <div className="flex flex-row justify-between">
              <div className="flex flex-1 text-sm ">{i.name}</div>
              <Bookmark
                isBookmark={i.isBookmark}
                parentType="flashset"
                parentId={i.id}
                size={18}
              />
            </div>
          </Link>
        ))}
      </div>
      {flashsets?.data?.length === total ? (
        ""
      ) : (
        <Button
          isLoading={loading}
          onClick={onClickSeeMore}
          color="success"
          className="text-base text-white "
        >
          See more
        </Button>
      )}

      <div className="mt-4 flex cursor-pointer flex-row justify-between">
        <p className="text-lg font-semibold">Students</p>
        {/* <p>More</p> */}
      </div>
      <div className="text-md flex cursor-pointer flex-row font-medium">
        <span className="w-8">No.</span>
        <span className="ml-4">Student name</span>
        {/* <span className='text-xl'>No.</span> */}
        {/* <p>More</p> */}
      </div>

      {students?.data?.data?.map?.((i, idx) => (
        <div
          key={i.id}
          className="mt-4 flex cursor-pointer flex-row items-center"
        >
          <span className="w-8 rounded-sm border-1 p-1 text-center">
            {idx + 1}
          </span>
          <span className="ml-4 flex-1">{i.name}</span>
          <FriendButton userId={i.id} friendStatus={i.friendStatus} />
        </div>
      ))}
    </div>
  );
};

const FriendButton = ({ userId, friendStatus }) => {
  const { fetchProfile, users } = useProfile();
  const [status, setStatus] = useState(friendStatus);
  useEffect(() => {
    fetchProfile();
  }, []);
  const addFriend = useMutation(
    (values) => {
      return userAPINew.addFriend(values);
    },
    {
      onSuccess: (res) => {
        setStatus("requested");
        alert.success("Your request has been sent successfully!");
      },
      onError: (error) => {
        console.log(error);
        alert.error(error?.response?.data?.message || "Failed to add friend!");
      },
    }
  );
  const acceptFriend = useMutation(
    (values) => {
      userAPINew.acceptFriend(values);
    },
    {
      onSuccess: (res) => {
        setStatus("friends");
        alert.success("Friend request has been accepted successfully!");
      },
      onError: (error) => {
        console.log(error);
        alert.error(
          error?.response?.data?.message || "Failed to accept request friend!"
        );
      },
    }
  );
  const cancelRequestFriend = useMutation(
    (values) => {
      userAPINew.unFriend(values);
    },
    {
      onSuccess: (res) => {
        setStatus(null);
        alert.success("Friend request has been cancelled successfully!");
      },
      onError: (error) => {
        console.log(error);
        alert.error(
          error?.response?.data?.message || "Failed to cancel request friend!"
        );
      },
    }
  );

  const handleAdd = () => {
    addFriend.mutate(userId);
  };
  const handleAccept = () => {
    acceptFriend.mutate(userId);
  };

  const handleDel = async () => {
    const res = await alert.confirm(
      "Cancel request",
      "Are you sure you want to cancel this friend request?"
    );
    if (res.isConfirmed) cancelRequestFriend.mutate(userId);
  };

  if (status == "friends" || userId === users?.data?.id) return null;
  if (status == "requested") {
    return (
      <Button size="sm" color="default" onPress={handleDel}>
        <BsPersonFillAdd /> Friend request sent
      </Button>
    );
  }
  if (status == "pending") {
    return (
      <div className="flex flex-row gap-1">
        <Button size="sm" color="success" onPress={handleAccept}>
          <BsPersonFillAdd />
          Accept Friend
        </Button>
        <Button size="sm" color="danger" onPress={handleDel}>
          <BsPersonFillDash />
          Reject
        </Button>
      </div>
    );
  }
  return (
    <Button size="sm" color="primary" onPress={handleAdd}>
      <BsPersonFillAdd /> Add friend
    </Button>
  );
};

export default Course;
