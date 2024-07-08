"use client";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { AvatarComp } from "./AvatarComp";
import Image from "next/image";

const Navbar = () => {
  const session = useSession();
  const route = useRouter();
  const pathname = usePathname();
  const { status, data } = session;
  const [isExpanded, setIsExpanded] = useState(false);
  const renderButton = () => {
    switch (status) {
      case "authenticated":
        return (
          <div
            className={`${
              isExpanded ? "flex flex-col pb-4" : "hidden"
            } sm:flex sm:flex-row  gap-4 sm:items-center`}
          >
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <AvatarComp
                source={data?.user?.image || undefined}
                fallback={data?.user?.username?.charAt(0)}
              />
              <div>
                <span className="hidden sm:inline">Welcome, </span>
                {data?.user?.username || data?.user?.email}
              </div>
            </div>

            <Button
              onClick={() => {
                signOut(), setIsExpanded(false);
              }}
            >
              Logout
            </Button>
            <Button
              onClick={() => {
                route.replace("/dashboard");
                setIsExpanded(false);
              }}
            >
              Dashboard
            </Button>
          </div>
        );
      case "unauthenticated":
        if (pathname.startsWith("/sign-up"))
          return (
            <Button className="" onClick={() => route.push("/sign-in")}>
              Sign-in
            </Button>
          );
        else if (pathname.startsWith("/sign-in"))
          return (
            <Button onClick={() => route.push("/sign-up")}>Sign-up</Button>
          );
        else if (pathname.startsWith("/"))
          return (
            <Button onClick={() => route.push("/sign-in")}>Sign-in</Button>
          );
      case "loading":
        return <Button onClick={() => route.push("/sign-in")}>Sign-in</Button>;
    }
  };
  return (
    <div
      className={`px-4 py-3 text-white ${
        status === "authenticated" ? "sm:flex" : "flex"
      } justify-around items-center bg-gray-800`}
    >
      <div className="flex justify-between items-center">
        <div
          className="font-bold text-xl cursor-pointer"
          onClick={() => route.replace("/")}
        >
          Honest Insights
        </div>
        {status === "authenticated" && (
          <div
            className=" sm:hidden"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Image
              alt="hamBurgerIcon"
              src={"/ham.png"}
              width={56}
              height={56}
            />
          </div>
        )}
      </div>
      <div className="">{renderButton()}</div>
    </div>
  );
};

export default Navbar;
