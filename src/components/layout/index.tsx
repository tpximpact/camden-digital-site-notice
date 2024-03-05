import Header from "@/components/header";
import Banner from "../banner";
import CookiesBanner from "@/components/cookies";
import { useEffect, useState } from "react";
import Head from "next/head";
import { urlFor } from "../../../util/client";
import { getGlobalContent } from "../../../util/client";

const globalContent = await getGlobalContent();

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isShowCookie, setIsShowCookie] = useState(true);
  const [favicon, setFavicon] = useState("");
  useEffect(() => {
    const getLocalStorageCookies = localStorage.getItem("cookies");
    const { favicon } = globalContent;
    favicon == null || favicon == undefined
      ? setFavicon("/favicon_default.ico")
      : setFavicon(urlFor(favicon)?.url());
    if (getLocalStorageCookies !== null) {
      setIsShowCookie(JSON.parse(getLocalStorageCookies));
    }
  }, []);
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
