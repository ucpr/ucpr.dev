import type { ParentProps } from "solid-js";
import { lazy } from "solid-js";
import { Router, Route } from "@solidjs/router";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Article from "./pages/Articles/Article";

const Articles = lazy(() => import("./pages/Articles"));
const Tags = lazy(() => import("./pages/Tags"));

const App = (_: ParentProps) => {
	return (
		<>
			<Header />

			<Router>
				<Route path="/" component={Home} />
				<Route path="/profile" component={Profile} />
				<Route path="/articles" component={Articles} />
				<Route path="/articles/:id" component={Article} />
				<Route path="/tags" component={Tags} />
				<Route path="*paramName" component={NotFound} />
			</Router>

			<Footer />
		</>
	);
};

export default App;
