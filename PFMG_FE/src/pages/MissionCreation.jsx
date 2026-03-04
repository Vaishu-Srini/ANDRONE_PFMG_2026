import React from "react";
import PFMGDbMgmtListing from "./PFMGDbMgmtListing";
import { useSearchParams } from "react-router-dom";
import PFMGDbMgmtListingDetails from "./PFMGDbMgmtListing-details";
import JammingRecForMode from "./jammingRecForMode";
import PFMGDbMgmtListingWeapons from "./PFMG-DbMgmt-Listing-weapons";

const MissionCreation = () => {
  const [searchParams] = useSearchParams();
  const component = searchParams.get("component");
  console.log("component", component);
  const platformId = searchParams.get("platformId");

  return (
    <>
      {component === "weapon" && <PFMGDbMgmtListingWeapons />}
      {component === "emitter" && <PFMGDbMgmtListing />}
      {component === "mode" && <PFMGDbMgmtListingDetails />}
      {component === "jamming" && <JammingRecForMode />}
    </>
  );
};

export default MissionCreation;
