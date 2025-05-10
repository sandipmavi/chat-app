import { Outlet } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

// import { Home } from "./pages/Home";

function App() {
  return (
    <>
      <Toaster />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;
