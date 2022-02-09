import { Routes, Route } from "react-router-dom";

import AuthRoute from "./hoc/AuthRoute";
import Reports from "./components/reports/Reports";
import Dash from "./components/dash/Dash";

const Router = () => {
  return (
    <div className="app">
      <Routes>
        <AuthRoute path="/reports" render={Reports} type="private" />
        <AuthRoute path="/dash" render={() => <Dash />} />
        <Route path="/" render={Reports} />
      </Routes>
    </div>
  );
};

export default Router;
