"use client";

import React, { useEffect, useState } from "react";

import ContactsMenu from "./menu-items/Contacts";
import FollowUpsMenu from "./menu-items/FollowUps";
import WhatsAppMenu from "./menu-items/WhatsApp";
import AdministrationMenu from "./menu-items/Administration";
import DashboardMenu from "./menu-items/Dashboard";
import { cn } from "@/lib/utils";

type Props = {
  modules: any;
  dict: any;
  build: number;
};

const ModuleMenu = ({ modules, dict, build }: Props) => {
  const [open, setOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <div
        className={` ${
          open ? "w-72" : "w-20 "
        }  h-screen p-5  pt-8 relative duration-300`}
      >
        <div className="flex gap-x-4 items-center">
          <div
            className={`cursor-pointer duration-500 border rounded-full px-4 py-2 ${
              open && "rotate-[360deg]"
            }`}
            onClick={() => setOpen(!open)}
          >
            N
          </div>

          <h1
            className={` origin-left font-medium text-xl duration-200 ${
              !open && "scale-0"
            }`}
          >
            {process.env.NEXT_PUBLIC_APP_NAME}
          </h1>
        </div>
        <div className="pt-6">
          <DashboardMenu open={open} title={dict.ModuleMenu.dashboard} />
          <ContactsMenu open={open} title={dict.ModuleMenu.contacts || "Contatos"} />
          <FollowUpsMenu open={open} title={dict.ModuleMenu.followups || "Follow-ups"} />
          <WhatsAppMenu open={open} title={dict.ModuleMenu.whatsapp || "WhatsApp"} />
          <AdministrationMenu open={open} title={dict.ModuleMenu.settings} />
        </div>
      </div>
      <div
        className={cn("flex justify-center items-center w-full", {
          hidden: !open,
        })}
      >
        <span className="text-xs text-gray-500 pb-2">
          build: 1.0.0-beta-{build}
        </span>
      </div>
    </div>
  );
};

export default ModuleMenu;
