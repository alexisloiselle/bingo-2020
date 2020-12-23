import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import "./App.css";
import { Content } from "./components/content";
import { ContextProvider } from "./stores";
import { isMobile } from "react-device-detect";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import cellsLoiselle from "./services/cells.loiselle";
import cellsMtlo from "./services/cells.mtlo";

function App() {
  return (
    <ContextProvider>
      <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
        <div className="container">
          <div
            className="background"
            style={{
              backgroundImage: `url("/images/mosaic.png")`,
            }}
          />
          <Router>
            <Switch>
              <Route exact path="/loiselle">
                <Content source={cellsLoiselle} />
              </Route>
              <Route exact path={["/mtlo"]}>
                <Content source={cellsMtlo} />
              </Route>
              <Redirect path={"/tremblay"} to="/mtlo" />
              <Redirect path={"/vincent"} to="/mtlo" />
              <Redirect path={"/mont-lo"} to="/mtlo" />
              <Redirect path={"/mont-laurier"} to="/mtlo" />
              <Route exact path="/">
                <Content />
              </Route>
              <Redirect to="/" />
            </Switch>
          </Router>
        </div>
      </DndProvider>
    </ContextProvider>
  );
}

export default App;
