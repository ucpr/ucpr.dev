import { ParentProps, lazy } from "solid-js";
import { MemoryRouter, createMemoryHistory, Route } from "@solidjs/router";
import { Suspense } from "solid-js";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const Articles = lazy(() => import("./pages/Articles"));
const Tags = lazy(() => import("./pages/Tags"));

const App = (_: ParentProps) => {
	const history = createMemoryHistory();

	return (
		<>
			<Header
				toHome={() => history.set({ value: "/" })}
				toProfile={() => history.set({ value: "/profile" })}
				toArticles={() => history.set({ value: "/articles" })}
				toTags={() => history.set({ value: "/tags" })}
			/>

			<MemoryRouter
				history={history}
				root={(props) => <Suspense>{props.children}</Suspense>}
			>
				<Route path="/" />
				<Route path="/profile" component={Profile} />
				<Route path="/articles" component={Articles} />
				<Route path="/tags" component={Tags} />
				<Route path="*paramName" component={NotFound} />
			</MemoryRouter>

			<Footer />
		</>
	);
};

export default App;
