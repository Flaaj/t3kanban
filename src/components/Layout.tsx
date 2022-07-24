import React, { FC, ReactNode } from "react";

import cn from "clsx";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import BoardsIcon from "src/assets/jsx/BoardsIcon";
import SettingsIcon from "src/assets/jsx/SettingsIcon";

interface ILayout {
  children: ReactNode;
}

const Layout: FC<ILayout> = ({ children: route }) => {
  const session = useSession();

  // if (session.status === "loading") {
  //   return (
  //     <div className="h-screen overflow-hidden grid grid-cols-[200px_1fr] grid-rows-[auto,_1fr]">
  //       <header className="col-span-2 p-2 md:p-4 bg-indigo-300 shadow-md flex justify-between">
  //         <SiteLogo />
  //         <LoggedAs />
  //       </header>
  //     </div>
  //   );
  // }

  // if (!session.data) {
  //   return (
  //     <div className="h-screen overflow-hidden grid grid-cols-[200px_1fr] grid-rows-[auto,_1fr]">
  //       <header className="col-span-2 p-2 md:p-4 bg-indigo-300 shadow-md flex justify-between">
  //         <SiteLogo />
  //         <LoggedAs />
  //       </header>

  //       <button
  //         className="m-auto py-3 px-8 text-xl text-white bg-black hover:bg-opacity-90 transition rounded-xl col-span-2"
  //         onClick={() => signIn()}
  //       >
  //         Login
  //       </button>
  //     </div>
  //   );
  // }

  return (
    <div className="h-screen overflow-hidden grid grid-cols-[200px_1fr] grid-rows-[auto,_1fr]">
      <header className="col-span-2 p-2 md:p-4 bg-indigo-300 shadow-md flex justify-between">
        <SiteLogo />
        <LoggedAs />
      </header>

      <aside className="h-full bg-slate-200 py-4 px-3 shadow-md">
        <NavMenu navItems={navItems} />
      </aside>

      <main className="h-full overflow-auto p-4 grid">{route}</main>
    </div>
  );
};

export default Layout;

const navItems: INavItem[] = [
  {
    label: "Boards",
    href: "/boards",
    icon: <BoardsIcon />,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <SettingsIcon />,
  },
];

const SiteLogo: FC = () => {
  return (
    <Link href="/">
      <a className="text-cyan-700 uppercase text-2xl font-bold tracking-tighter">Kanban by Flaaj</a>
    </Link>
  );
};

const LoggedAs = () => {
  const session = useSession();

  if (session.status === "loading") {
    return null;
  }

  if (!session.data) {
    return (
      <div className="flex items-center text-cyan-900">
        <LoginButton />
      </div>
    );
  }

  return (
    <div className="flex items-center text-cyan-900">
      <p className="mr-2 font-bold">{session.data.user?.name}</p>
      <LogoutButton />
    </div>
  );
};

const LoginButton = () => {
  return (
    <button onClick={() => signIn()} title="Sign in">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
};
const LogoutButton = () => {
  return (
    <button onClick={() => signOut()} title="Sign out">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
    </button>
  );
};

interface INavMenu {
  navItems: INavItem[];
}

const NavMenu: FC<INavMenu> = ({ navItems }) => {
  return (
    <menu>
      {navItems.map((navItem) => (
        <NavItem key={navItem.href} {...navItem} />
      ))}
    </menu>
  );
};

export interface INavItem {
  icon?: JSX.Element;
  label: string;
  href: string;
}

const NavItem: FC<INavItem> = ({ icon, label, href }) => {
  const router = useRouter();
  const isCurrent = router.pathname.startsWith(href);

  return (
    <Link href={href}>
      <a
        className={cn(
          "transition shadow-sm w-full flex p-3 rounded-lg mb-2 last:mb-0",
          isCurrent ? "bg-slate-400" : "bg-slate-300 hover:bg-amber-50"
        )}
      >
        {icon && <span className="mr-3">{icon}</span>}
        <span>{label}</span>
      </a>
    </Link>
  );
};
