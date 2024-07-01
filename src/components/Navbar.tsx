"use client";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import { AvatarComp } from "./AvatarComp";

const Navbar = () => {
  const session = useSession();
  const route = useRouter();
  const pathname = usePathname();
  const { status, data } = session;
  const renderButton = () => {
    switch (status) {
      case "authenticated":
        return (
          <div className="flex gap-4 items-center">
            <div>Welcome, {data?.user?.username || data?.user?.email}</div>
            <AvatarComp source={data?.user?.image || undefined} fallback={data?.user?.username?.charAt(0)}/>
            <Button onClick={() => signOut()}>Logout</Button>
            <Button onClick={() => route.replace("/dashboard")}>
              Dashboard
            </Button>
          </div>
        );
      case "unauthenticated":
        if (pathname.startsWith("/sign-up"))
          return (
            <Button onClick={() => route.push("/sign-in")}>Sign-in</Button>
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
        return <Button onClick={() => route.push("/sign-up")}>Sign-up</Button>;
    }
  };
  return (
    <div className="p-6 text-white flex justify-around items-center bg-gray-800">
      <div className="font-bold text-xl cursor-pointer" onClick={()=>route.replace('/')}>Honest Insights</div>
      <div>{renderButton()}</div>
    </div>
  );
};

export default Navbar;
