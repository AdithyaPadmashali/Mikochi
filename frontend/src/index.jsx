import { render } from "preact";
import { useState, useEffect, useMemo } from "preact/hooks";
import { LocationProvider, lazy, Router, Route } from "preact-iso";

import { refreshJWT, AuthContext } from "./jwt";
import Login from "./pages/Login";

const Directory = lazy(() => import("./pages/Directory"));
import "./index.css";
import { Provider } from "../states/provider";

export function App() {
  const [jwt, setJWT] = useState(null);
  useEffect(() => refreshJWT(setJWT), []);
  const auth = useMemo(() => {
    return { jwt, setJWT };
  }, [jwt]);

  return (
    <AuthContext.Provider value={auth}>
      <Provider>
        <div id="app">
          {jwt === null ? (
            <Login />
          ) : (
            <LocationProvider>
              <Router>
                <Route default component={Directory} />
              </Router>
            </LocationProvider>
          )}
        </div>
      </Provider>
    </AuthContext.Provider>
  );
}

render(<App />, document.getElementById("app"));
