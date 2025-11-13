import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";

const AppShell = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20 pb-24 md:pb-12">
        <Outlet />
      </div>
    </div>
  );
};

export default AppShell;
