import Header from "@/components/header";
import Banner from "../banner";
import CookiesBanner from "@/components/cookies";
import { useEffect, useState } from "react";
import Head from "next/head";
import { urlFor, getGlobalContent } from "../../../util/client";
import { getLocalStorage } from "../../../util/helpLocalStorage";
import { useContext } from "react";
import { ContextApplication } from "@/context";

const globalContent = await getGlobalContent();

export default function Layout({ children }: { children: React.ReactNode }) {
  const { setGlobalConfig } = useContext(ContextApplication);
  const [isShowCookie, setIsShowCookie] = useState<boolean>(true);

  const favicon =
    globalContent.favicon == null || globalContent.favicon == undefined
      ? "/favicon_default.ico"
      : urlFor(globalContent.favicon)?.url();

  useEffect(() => {
    const getLocalStorageCookies = getLocalStorage({
      key: "cookies",
      defaultValue: false,
    });
    setIsShowCookie(getLocalStorageCookies);

    setGlobalConfig(globalContent);
  }, [setGlobalConfig]);

  return (
    <main>
      {isShowCookie && (
        <CookiesBanner
          onClick={() => {
            setIsShowCookie(false), localStorage.setItem("cookies", "false");
          }}
        />
      )}
      <Header />
      <Banner />
      <Head>
        <title>Digital site notice</title>
        <link rel="icon" href={favicon} sizes="any" />
      </Head>
      <div className="layout-wrap">{children}</div>
    </main>
  );
}
