// App.jsx
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        draggable
        pauseOnHover
      />

      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;
