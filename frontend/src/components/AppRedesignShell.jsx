import { useParams } from "react-router-dom";
import AnimatedStage from "./AnimatedStage";
import GlassySidebar from "./GlassySidebar";
import HeaderBar from "./HeaderBar";
import { ToastContainer } from "react-toastify";

export default function AppRedesignShell({ isChatSelected }) {
  const params = useParams();
  const chatOpen = Boolean(params.userId || isChatSelected);

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        draggable
        pauseOnHover
      />
      <div className="h-screen w-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 transition-colors duration-300 overflow-hidden flex flex-col">
        <HeaderBar className="flex-shrink-0" />

        <div className="flex flex-1 overflow-hidden md:gap-2">
          {/* Sidebar */}
          <GlassySidebar
            className={`h-full flex-shrink-0 
            ${chatOpen ? "hidden md:block" : "block"} 
            w-full md:w-1/3 lg:w-1/4 md:pl-2`}
          />

          {/* Chat Stage */}
          <AnimatedStage
            className={`h-full flex-1 w-full overflow-hidden 
            ${chatOpen ? "flex px-3" : "hidden md:flex md:pr-2"}`}
          />
        </div>
      </div>
    </>
  );
}
