import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { clearStorage, getItem } from "@/utils/localStorage";
import { useRouter } from "next/navigation";
import Feed from "./Feed";
import { STRIPE_PAYMENT_LINK } from "@/utils/globalVars";
import jwt, { JwtPayload } from "jsonwebtoken";
import HomeIcon from "@heroicons/react/24/outline/HomeIcon";
import HeartIcon from "@heroicons/react/24/outline/HeartIcon";
import CogIcon from "@heroicons/react/24/outline/CogIcon";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import Bars3Icon from "@heroicons/react/24/outline/Bars3Icon";
import ArrowLeftOnRectangleIcon from "@heroicons/react/24/outline/ArrowLeftOnRectangleIcon";
import { Logo } from "./Logo";

interface Props {
  page: string;
  children: JSX.Element;
}

export default function Main({ page, children }: Props) {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isProUser = (jwt.decode(getItem("auth-token") as string) as JwtPayload)
    .isProUser as boolean;

  const navigation = [
    { name: "Feed", route: "/home", icon: HomeIcon, current: page === "home" },
    {
      name: "Favorites",
      route: "/favorites",
      icon: HeartIcon,
      current: page === "favorites",
    },
    {
      name: "Settings",
      route: "/settings",
      icon: CogIcon,
      current: page === "settings",
    },
  ];
  const userNavigation = [
    { name: "Your profile", href: "#" },
    { name: "Sign out", href: "#" },
  ];

  function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
  }

  const logOut = () => {
    clearStorage();
    router.push("/sign-in");
  };

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-[#F3F3F3] px-6 pb-4 ring-1 ring-white/10">
                    <div className="flex h-16 mt-4 shrink-0 items-center">
                      <Logo />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li
                                key={item.name}
                                className="cursor-pointer"
                                onClick={() => {
                                  const element = navigation.find(
                                    (item) => item.current === true
                                  )!;
                                  element.current = false;
                                  item.current = true;
                                  router.push(item.route);
                                }}
                              >
                         <a
                          className={classNames(
                            item.current
                              ? "text-black"
                              : "text-gray-400",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                        >
                          <item.icon
                            className="h-6 w-6 shrink-0"
                            aria-hidden="true"
                            style={{ stroke: 'currentColor' }}

                          />
                                  {item.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                    {/* <div className="relative">
                      <div className="absolute inset-x-0 rounded-md bottom-0 h-48 bg-white">
                        <div className="flex flex-col px-4 gap-x-2">
                        <p className="mt-1 leading-6 text-black-400">
                          Searches
                        </p>
                        <p className="mt-1 leading-6 text-black-400">
                          Searches
                        </p>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-[#F3F3F3] px-6 pb-4">
            <div className="flex h-16 mt-4 shrink-0 items-center">
              <Logo />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li
                        key={item.name}
                        className="cursor-pointer"
                        onClick={() => {
                          const element = navigation.find(
                            (item) => item.current === true
                          )!;
                          element.current = false;
                          item.current = true;
                          router.push(item.route);
                        }}
                      >
                        <a
                          className={classNames(
                            item.current
                              ? "text-black"
                              : "text-gray-400",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                        >
                          <item.icon
                            className="h-6 w-6 shrink-0"
                            aria-hidden="true"
                            style={{ stroke: 'currentColor' }}

                          />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div
              className="h-6 w-px bg-gray-900/10 lg:hidden"
              aria-hidden="true"
            />

            <div className="flex flex-1 justify-end gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                {!isProUser && (
                  <>
                    <button
                      type="button"
                      className="rounded-md bg-[#0070F3] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm"
                      onClick={() => {
                        window.open(STRIPE_PAYMENT_LINK, "_blank");
                      }}
                    >
                      Upgrade to Pro
                    </button>
                    {/* Separator */}
                    <div
                      className="block h-6 w-px bg-gray-900/10"
                      aria-hidden="true"
                    />
                  </>
                )}
                <span className="sr-only">Log out</span>
                <ArrowLeftOnRectangleIcon
                  className="h-8 w-8 text-gray-700 cursor-pointer"
                  aria-hidden="true"
                  onClick={logOut}
                />
              </div>
            </div>
          </div>

          <main className="py-10">
            <div className="md:flex md:justify-center px-4">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}
