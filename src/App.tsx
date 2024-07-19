import type { ParentProps } from "solid-js";
import { Router, Route } from "@solidjs/router";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Profile from "./pages/profile";
import Home from "./pages/home";
import NotFound from "./pages/notfound";
import Articles from "./pages/articles";
import Tags from "./pages/tags";

const App = (_: ParentProps) => {
  return (
    <>
      <Header />

      <Router>
        <Route path="/" component={Home} />
        <Route path="/profile" component={Profile} />
        <Route path="/articles" component={Articles} />
        <Route path="/tags" component={Tags} />
        <Route path="*paramName" component={NotFound} />
      </Router>

      <Footer />
    </>
  );
};

export default App;
