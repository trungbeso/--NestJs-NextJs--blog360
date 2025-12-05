"use client";

import { cn } from "@/lib/utils";
import { PropsWithChildren, ReactNode, useState } from "react";

type Props = PropsWithChildren<{
  triggerIcon: ReactNode;
  triggerClassName?: string;
}>;

function SideBar(props: Props) {
  const [show, setShow] = useState(false);
  return (
    <>
      <button
        className={props.triggerClassName}
        onClick={() => setShow((prev) => !prev)}
      >
        {props.triggerIcon}
      </button>
      <div
        className={cn(
          "w-60 absolute top-0 z-10 transition-all bg-white rounded-r-md min-h-screen",
          { "-left-full": !show, "left-0": show }
        )}
      >
        {props.children}
      </div>
    </>
  );
}

export default SideBar;
