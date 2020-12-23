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

function App() {
  return (
    <ContextProvider>
      <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
        <div className="container">
          <div
            className="background"
            style={{
              backgroundImage: `url("${process.env.PUBLIC_URL}/images/mosaic.png")`,
            }}
          />
          <Router>
            <Switch>
              <Route exact path="/bingo-2020">
                <Content />
              </Route>
              <Redirect to="/bingo-2020" />
            </Switch>
          </Router>
        </div>
      </DndProvider>
    </ContextProvider>
  );
}

export default App;
