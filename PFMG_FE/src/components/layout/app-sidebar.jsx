"use client";

import * as React from "react";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import { NavMain } from "@/components/layout/nav-main";
import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";
import { NavEwConfig } from "@/components/layout/nav-ew-config";
import NavModal from "./nav-modal";
import house from "../../assets/images/sidebar-icons/house.svg";
import users from "../../assets/images/sidebar-icons/Users.svg";
import questions from "../../assets/images/sidebar-icons/Question.svg";
import gear from "../../assets/images/sidebar-icons/Gear.svg";
import { PFMGSidebar } from "./nav-pfmg-sidebar";
import { useEmitterStore, useSidebarStore } from "../../store/missionStore";
import NavEwConfigBlank from "./NavEwConfigBlank";

// ----------------------
// Static nav items
// ----------------------
const data = {
  user: {
    name: "Raj",
    email: "raj@ugda.com",
    avatar: "CN",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: house,
      isActive: true,
      items: [],
    },
    {
      title: "Members",
      url: "/members",
      icon: users,
      items: [],
    },
    {
      title: "Help",
      url: "/help",
      icon: questions,
      items: [],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: gear,
      items: [],
    },
  ],
};

export function AppSidebar({ ...props }) {
  const location = useLocation();
  const [selectedSidebarItem, setSelectedSidebarItem] = useState(null);

  // ----------------------
  // Path checks
  // ----------------------
  const isEwConfig = location.pathname === "/ew-config";
  const isModal = [
    "/modal-mode",
    "/modal-em",
    "/modal-detail",
    "/modal-ws",
  ].includes(location.pathname);

  // Pages with no sidebar
  const noSideBarPath = [
    "/mission-selection",
    "/live-missions",
    "/ew-config-details",
    "/Emitter-Type-Selection",
  ];

  // Pages where sidebar should show
  const listingPagePrefixes = [
    "/PFMG-DbMgmt-Listing",
    // "/PFMG-DbMgmt-Listing-details",
    // "/jammingRecForMode",
    "/mission-creation",
  ];

  const isListingPage = listingPagePrefixes.some((path) =>
    location.pathname.startsWith(path)
  );

  // ----------------------
  // Debug logging
  // ----------------------
  useEffect(() => {
    console.log("➡️ Current path:", location.pathname);
  }, [location.pathname]);

  // ----------------------
  // Decide which sidebar to render
  // ----------------------
  const renderSidebarContent = () => {
    if (isEwConfig) return <NavEwConfig />;

    // if (isEwConfig) {
    //   const fromMissionSave = location.state?.fromMissionSave || false;
    //   return fromMissionSave ? <NavEwConfigBlank /> : <NavEwConfig />;
    // }
    if (isModal) return <NavModal />;
    if (isListingPage) {
      return (
        <PFMGSidebar
        // items={sidebarData}
        // selectedItem={selectedItem}
        // onItemSelect={setSelectedItem}
        />
      );
    }
    return <NavMain items={data.navMain} />;
  };

  // ----------------------
  // Final render
  // ----------------------
  if (noSideBarPath.some((path) => location.pathname.startsWith(path))) {
    return null;
  }

  return (
    <Sidebar
      collapsible="offcanvas"
      className="bg-[#37383B] border-r border-[#37383B]"
      {...props}
    >
      <SidebarContent>{renderSidebarContent()}</SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
