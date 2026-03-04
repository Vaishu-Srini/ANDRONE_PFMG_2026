import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import home from "../../assets/images/sidebar-icons/house.svg";
import pfmFileIcon from "../../assets/images/sidebar-icons/pfmFileIcon.png";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import entity from "../../assets/images/sidebar-icons/Entity.svg";
import emitter from "../../assets/images/sidebar-icons/Emitters.svg";
import entity_management from "../../assets/images/sidebar-icons/Entity_managment.svg";
import questions from "../../assets/images/sidebar-icons/Question.svg";
import gear from "../../assets/images/sidebar-icons/Gear.svg";

export function NavMain({ items }) {
  const location = useLocation();
  const [isEntityManagementOpen, setIsEntityManagementOpen] = useState(true);
  const [isEntityManagementClicked, setIsEntityManagementClicked] =
    useState(false);
  const [currentContext, setCurrentContext] = useState("dashboard"); // Track current context

  // Effect to track context based on navigation
  useEffect(() => {
    const missionPages = [
      "/missions",
      "/entity",
      "/emitters",
      "/ew-config",
      "/generatedFiles",
    ];
    const dashboardPages = ["/", "/members"];

    if (missionPages.includes(location.pathname)) {
      setCurrentContext("mission");
    } else if (dashboardPages.includes(location.pathname)) {
      setCurrentContext("dashboard");
    }
    // For shared pages (/help, /settings), maintain the current context
  }, [location.pathname]);

  // Define the main navigation items
  const mainNavItems = [
    {
      title: "Mission Plans",
      url: "/missions",
      icon: home,
    },
    {
      title: "Generated Files",
      url: "/generatedFiles",
      icon: pfmFileIcon,
    },
  ];

  // Entity Management sub-items
  const entityManagementItems = [
    {
      title: "Platforms",
      url: "/entity",
      icon: entity,
    },
    {
      title: "Weapon Systems",
      url: "/emitters",
      icon: emitter,
    },
  ];

  const bottomNavItems = [
    {
      title: "Help",
      url: "/help",
      icon: questions,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: gear,
    },
  ];

  const renderNavItem = (item, isFirst = false) => {
    const isActive = location.pathname === item.url;
    return (
      <SidebarMenuItem
        key={item.title}
        className={
          isFirst
            ? "first:py-[32px] -mb-6 px-0 group-data-[collapsible=icon]:!px-0"
            : "px-0 mb-6 group-data-[collapsible=icon]:!px-0"
        }
      >
        <SidebarMenuButton
          asChild
          tooltip={item.title}
          isActive={isActive}
          className="font-medium data-[active=true]:font-bold rounded-[4px] px-5 group-data-[collapsible=icon]:!w-12 group-data-[collapsible=icon]:!h-12 group-data-[collapsible=icon]:!p-1 group-data-[collapsible=icon]:!flex group-data-[collapsible=icon]:!items-center group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:!m-0"
        >
          <Link
            to={item.url}
            className="group-data-[collapsible=icon]:!flex group-data-[collapsible=icon]:!items-center group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:!w-full group-data-[collapsible=icon]:!h-full"
          >
            <img
              src={item.icon}
              alt={item.title}
              className={`!w-5 !h-5 ${isActive ? "invert" : ""} group-data-[collapsible=icon]:!mx-auto`}
              style={{ width: "22px", height: "22px" }}
            />
            <span className="text-[16px] font-karla not-italic leading-normal capitalize  group-data-[collapsible=icon]:hidden">
              {item.title}
            </span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  const renderDashboardNavItem = () => {
    return items.map((item) => {
      const isActive = location.pathname === item.url;

      return (
        <SidebarMenuItem
          key={item.title}
          className="first:pt-[80px] first:pb-[60px] first:px-[20px]  [&:nth-child(2)]:pt-[40px] first:border-b first:border-white/10 py-[24px] px-[20px]  group-data-[collapsible=icon]:!px-0  "
        >
          <SidebarMenuButton
            asChild
            tooltip={item.title}
            isActive={isActive}
            className="font-medium data-[active=true]:font-bold rounded-[4px] px-4 group-data-[collapsible=icon]:!w-12 group-data-[collapsible=icon]:!h-12 group-data-[collapsible=icon]:!p-1 group-data-[collapsible=icon]:!flex group-data-[collapsible=icon]:!items-center group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:!m-0"
          >
            <Link
              to={item.url}
              className="group-data-[collapsible=icon]:!flex group-data-[collapsible=icon]:!items-center group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:!w-full group-data-[collapsible=icon]:!h-full "
            >
              <img
                src={item.icon}
                alt={item.title}
                className={`!w-6 !h-6 ${isActive ? "invert" : ""}`}
                style={{ width: "24px", height: "24px" }}
              />
              <span className="text-[16px] font-karla group-data-[collapsible=icon]:hidden  ">
                {item.title}
              </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });
  };

  const renderMissionPlanItem = () => {
    return (
      <SidebarMenu className="pt-10 px-4 flex flex-col gap-6 ">
        {/* Mission Plans */}
        {mainNavItems.map((item, index) => renderNavItem(item, index === 0))}

        {/* Entity Management with sub-items */}
        <SidebarMenuItem className="-px-0  pb-[60px] group-data-[collapsible=icon]:!px-0">
          <Collapsible
            open={isEntityManagementOpen}
            onOpenChange={setIsEntityManagementOpen}
            className="group/collapsible"
          >
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                tooltip="Entity Management"
                className="font-medium data-[active=true]:font-bold rounded-[4px] px-5 group-data-[collapsible=icon]:!w-12 group-data-[collapsible=icon]:!h-12 group-data-[collapsible=icon]:!p-1 group-data-[collapsible=icon]:!flex group-data-[collapsible=icon]:!items-center group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:!m-0 cursor-pointer"
                onClick={() =>
                  setIsEntityManagementClicked(!isEntityManagementClicked)
                }
              >
                <img
                  src={entity_management}
                  alt="Entity Management"
                  className={`!w-5 !h-5 ${isEntityManagementClicked ? "invert" : ""} group-data-[collapsible=icon]:!mx-auto`}
                  style={{ width: "22px", height: "22px" }}
                />
                <span className="text-[14px] group-data-[collapsible=icon]:hidden  ">
                  Entity Management
                </span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {entityManagementItems.map((item) => (
                  <SidebarMenuSubItem key={item.title}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={location.pathname === item.url}
                      className="font-medium data-[active=true]:font-bold rounded-[4px] px-4 ml-4 text-white mt-[12px]  "
                    >
                      <Link
                        to={item.url}
                        className="group-data-[collapsible=icon]:!flex group-data-[collapsible=icon]:!items-center group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:!w-full group-data-[collapsible=icon]:!h-full"
                      >
                        <img
                          src={item.icon}
                          alt={item.title}
                          className={`!w-5 !h-5 ${location.pathname === item.url ? "invert" : ""} group-data-[collapsible=icon]:!mx-auto`}
                          style={{ width: "20px", height: "20px" }}
                        />
                        <span
                          className={`${location.pathname === item.url ? "text-black" : "text-white"} text-[16px] font-karla not-italic leading-normal capitalize group-data-[collapsible=icon]:hidden`}
                        >
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenuItem>

        {/* Separator */}
        <SidebarSeparator className="my-4 text-[#4B4B4F]" />

        {/* Bottom navigation items */}
        {bottomNavItems.map((item) => renderNavItem(item))}
      </SidebarMenu>
    );
  };
  return (
    <SidebarGroup>
      {currentContext === "dashboard" && renderDashboardNavItem()}
      {currentContext === "mission" && renderMissionPlanItem()}
    </SidebarGroup>
  );
}
