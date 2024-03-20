"use client";
import ContentWithSidebar from "@/components/layouts/ContentWithSidebar";
import { useEffect, useMemo } from "react";

import { PiGameControllerBold } from "react-icons/pi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { TbCardsFilled } from "react-icons/tb";
import { SessionStore } from "@/config/sesstionStore";
import { useRouter } from "next/navigation";

const TeacherLayout = ({ children }) => {
  const router = useRouter();
  const user = SessionStore.getUserSession();
  useEffect(() => {
    if (!user?.id) {
      router.replace("/login");
    }
  }, []);
  const menus = useMemo(
    () => [
      {
        icon: TbCardsFilled,
        text: "Flash Set Management",
        pathname: "/teacher/flashset-management",
      },
      {
        icon: PiGameControllerBold,
        text: "Mini Game Management",
        pathname: "/teacher/game-management",
      },
      {
        icon: FaChalkboardTeacher,
        text: "Course Management",
        pathname: "/teacher/course-management",
      },
    ],
    []
  );
  return <ContentWithSidebar toggleMenu={menus}>{children}</ContentWithSidebar>;
};

export default TeacherLayout;
