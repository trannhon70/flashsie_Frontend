"use client";
import {
  Avatar,
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Link,
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaBookmark, FaRankingStar } from "react-icons/fa6";

import AddCourseToken from "../../../components/AddCourseToken";
import Search from "@/components/Search";
import { useProfile } from "@/hooks/useProfile";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AiFillHome, AiOutlinePlus } from "react-icons/ai";

const initMenu = [
  {
    icon: AiFillHome,
    text: "Home",
    pathname: "/home",
  },
  {
    icon: FaBookmark,
    text: "Bookmarks",
    pathname: "/bookmarks",
  },
  {
    icon: FaRankingStar,
    text: "Leaderboard",
    pathname: "/leaderboard",
  },
];

export default function NavbarComponent({
  sidebars = [],
  toggleMenu,
  toggleClass = "md:hidden",
  menu = initMenu,
}) {
  const path = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { users, fetchProfile } = useProfile();

  useEffect(() => {
    fetchProfile();
  }, []);
  const onDropdown = (key) => {
    if (key === "logout") {
      // signOut({ redirect: false, callbackUrl: "/login" });
      sessionStorage.clear();
      router.replace("/login");
    } else {
      router.push(key);
    }
  };

  if (!users?.data?.id) {
    return <></>;
  }

  return (
    <Navbar isBordered maxWidth="lg" className="bg-primary">
      <NavbarContent justify="start" className="max-w-[70px] md:max-w-[150px]">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className={`text-white ${toggleClass}`}
        />
        <Link href="/home">
          <Image
            src="/img/logo_ic.png"
            width={80}
            height={80}
            className="h-8 w-8 md:hidden"
          />
          <Image
            src="/img/logo.png"
            width={150}
            height={150}
            className="hidden h-14 w-32 md:block"
          />
        </Link>
      </NavbarContent>
      {Array.isArray(menu) && (
        <NavbarContent justify="center" className="hidden md:flex">
          {menu.map((i) => {
            const Icon = i.icon;
            const selected = path.includes(i.pathname);
            return (
              <NavbarItem key={i.text} className="flex flex-col">
                <Link
                  href={i.pathname}
                  className="flex h-12 w-16 flex-col  items-center justify-center text-white"
                >
                  <Icon size={18} />
                  <span
                    className={`mt-1 rounded-full px-1 text-[6px] md:text-xs ${
                      selected ? "bg-white text-blue-400" : ""
                    }`}
                  >
                    {i.text}
                  </span>
                </Link>
              </NavbarItem>
            );
          })}
        </NavbarContent>
      )}
      <NavbarContent>
        <Search>
          <Input
            isDisabled={false}
            classNames={{
              base: "w-full h-10",
              mainWrapper: "h-full",
              input: [
                "bg-transparent",
                "text-black/90",
                "placeholder:text-default-700/50",
              ],
              inputWrapper: "h-full font-normal text-white ",
            }}
            placeholder="Type to search..."
            size="sm"
            startContent={
              <FaSearch
                size={18}
                className="text-white-400 pointer-events-none flex-shrink-0 text-black/50 dark:text-white/90"
              />
            }
            type="search"
          />
        </Search>
      </NavbarContent>
      <NavbarContent justify="end" className="!flex-grow-0 ">
        <AddCourseToken>
          <Button isIconOnly radius="full" size="sm">
            <AiOutlinePlus /> 
          </Button>
        </AddCourseToken>

        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src={users?.data?.avatar}
            />
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Profile Actions"
            variant="flat"
            onAction={onDropdown}
          >
            <DropdownItem
              key="/profile"
              className="h-14 gap-2 rounded-none border-b-1"
            >
              <p className="font-semibold">Login as {users?.data?.role}</p>
              <p className="font-semibold">{users?.data?.email}</p>
            </DropdownItem>
            <DropdownItem key="/profile">Profile</DropdownItem>
            {users?.data?.type === "teacher" && (
              <DropdownItem key="/teacher/flashset-management">
                Teacher
              </DropdownItem>
            )}
            {users?.data?.role === "admin" && (
              <DropdownItem key="/admin/users">Admin</DropdownItem>
            )}
            <DropdownItem
              key="logout"
              color="danger"
              className="rounded-none border-t-1"
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      <NavbarMenu>
        {Array.isArray(menu) &&
          menu.map((item, index) => {
            let active =
              path !== "/"
                ? path == item.pathname
                : path.startsWith(item.pathname);

            return (
              <NavbarMenuItem
                key={`${item.name}-${index}`}
                className=" md:hidden"
              >
                <Link
                  color={active ? "primary" : "foreground"}
                  className="mt-4 w-full gap-4"
                  href={item.pathname}
                  size="lg"
                >
                  <item.icon size={28} />
                  {item.text}
                </Link>
              </NavbarMenuItem>
            );
          })}
        <Divider />
        {Array.isArray(toggleMenu) &&
          toggleMenu.map((item, index) => {
            let active =
              path !== "/"
                ? path == item.pathname
                : path.startsWith(item.pathname);

            return (
              <NavbarMenuItem key={`${item.name}-${index}`}>
                <Link
                  color={active ? "primary" : "foreground"}
                  className="mt-4 w-full gap-4"
                  href={item.pathname}
                  size="lg"
                >
                  <item.icon size={28} />
                  {item.text}
                </Link>
              </NavbarMenuItem>
            );
          })}
      </NavbarMenu>
    </Navbar>
  );
}
