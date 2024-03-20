"use client";
import { Link } from "@nextui-org/react";
import Image from "next/image";
import Navbar from "../Navbar";

export default function PageLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="item relative flex min-h-screen w-full flex-col">
        <img
          src="/img/bg.png"
          alt="BG"
          className="absolute bottom-0 left-0 right-0 top-0 z-0 h-screen w-screen object-cover"
          style={{ objectPosition: "center center", width: "100%" }}
        />
        <div className="z-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center">
          <Image
            src="/img/logo.png"
            width={150}
            height={150}
            className="block w-[20rem]"
          />
          <div>
            <Link href="/login">
              <button className="mx-16 mb-4 block w-[200px] rounded-full border-b-4 border-[blue-700] bg-[#F98C35] py-2 font-bold text-white hover:border-b-4">
                Login
              </button>
            </Link>
          </div>
          <div>
            <Link href="/signup">
              <button className="mx-16 block w-[200px] rounded-full border-b-4 border-[blue-700] bg-[#F98C35] py-2 font-bold text-white opacity-50 hover:border-b-4">
                Sign up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
