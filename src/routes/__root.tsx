import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import css from "./__root.css?raw";
import { Logo } from "@/components/Logo";
import Scoper from "@/components/Scoper";
import Footer from "@/components/Footer";
export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Scoper style={css} />
      <nav className="">
        <Link
          to="/"
          activeProps={{
            className: "",
          }}
          activeOptions={{ exact: true }}
        >
          <Logo />
        </Link>
        <div>
          <Link
            to="/"
            activeProps={{
              className: "",
            }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>
          <Link
            to="/posts"
            activeProps={{
              className: "",
            }}
          >
            Posts
          </Link>
        </div>
      </nav>
      <Outlet />
      <Footer />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
