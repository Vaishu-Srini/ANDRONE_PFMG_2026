import { HashRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import Missions from "./pages/Missions.jsx";
import Entity from "./pages/Entity.jsx";
import Emitters from "./pages/Emitters.jsx";
import EWConfig from "./pages/EWConfig.jsx";
import ModalEm from "./pages/ModalEm.jsx";
import ModalModel from "./pages/ModalMode.jsx";
import ModalDetail from "./pages/ModalDetail.jsx";
import PFMGDbMgmtListing from "./pages/PFMGDbMgmtListing.jsx";
import AddIndependentMode from "./pages/AddIndependentMode.jsx";
import PFMGDbMgmtListingDetails from "./pages/PFMGDbMgmtListing-details.jsx";
import MissionSelection from "./pages/MissionSelection.jsx";
import Members from "./pages/Members.jsx";
import Help from "./pages/Help.jsx";
import Settings from "./pages/Settings.jsx";
import JammingRecForMode from "./pages/jammingRecForMode.jsx";
import LiveMissions from "./pages/LiveMissions.jsx";
import EWConfigDetails from "./pages/EwConfigDetails.jsx";
import MissionCreation from "./pages/MissionCreation.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PFMGDbMgmtListingweapons from "./pages/PFMG-DbMgmt-Listing-weapons.jsx";
import EntitySelection from "./pages/EntitySelection.jsx";
import ModalWs from "./pages/modalWs.jsx";
import PfmGenFile from "./pages/pfmGenFile.jsx";
import { ResponseModalProvider } from "./context/ResponseModalContext.jsx";

function App() {
  return (
    <ResponseModalProvider>
      <>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <Router>
          <Routes>
            {/* Routes that need the sidebar layout */}
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Home />} />
              {/* Add more routes here that need the sidebar */}
              <Route path="/missions" element={<Missions />} />
              <Route path="/generatedFiles" element={<PfmGenFile />} />
              <Route path="/mission-selection" element={<MissionSelection />} />
              <Route path="/entity" element={<Entity />} />
              <Route path="/emitters" element={<Emitters />} />
              <Route path="/ew-config" element={<EWConfig />} />
              <Route path="/modal-em" element={<ModalEm />} />
              <Route path="/modal-ws" element={<ModalWs />} />

              <Route path="/modal-mode" element={<ModalModel />} />
              <Route path="/modal-detail" element={<ModalDetail />} />
              <Route
                path="/add-independent-mode"
                element={<AddIndependentMode />}
              />
              <Route
                path="/PFMG-DbMgmt-Listing"
                element={<PFMGDbMgmtListing />}
              />
              <Route path="/mission-creation" element={<MissionCreation />} />
              <Route
                path="/PFMG-DbMgmt-Listing-details"
                element={<PFMGDbMgmtListingDetails />}
              />
              <Route
                path="/PFMG-DbMgmt-Listing-weapons"
                element={<PFMGDbMgmtListingweapons />}
              />
              <Route
                path="/Emitter-Type-Selection"
                element={<EntitySelection />}
              />
              <Route path="/members" element={<Members />} />
              <Route path="/help" element={<Help />} />
              <Route path="/settings" element={<Settings />} />
              <Route
                path="/jammingRecForMode"
                element={<JammingRecForMode />}
              />
              <Route path="/live-missions" element={<LiveMissions />} />
              <Route path="/ew-config-details" element={<EWConfigDetails />} />
              {/* Catch-all route for 404 pages */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </>
    </ResponseModalProvider>
  );
}

export default App;
