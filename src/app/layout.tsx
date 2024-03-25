"use client";
import Header from "@/components/header";
import Banner from "../components/banner";
import CookiesBanner from "@/components/cookies";
import { useEffect, useState } from "react";
import Head from "next/head";
import GoogleAnalytics from "../components/google-analytics";
import { getLocalStorage } from "../../util/localStorageHelper";
import { urlFor } from "../../util/client";
import { getGlobalContent } from "../../util/actions";
import "../styles/app.scss";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isShowCookie, setIsShowCookie] = useState<boolean>(true);
  const [isConsentCookie, setIsConsentCookie] = useState(false);
  const [favicon, setFavicon] = useState("/favicon_default.ico");
  const [globalConfig, setGlobalConfig] = useState<any>();

  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;

  useEffect(() => {
    const govUk = require("govuk-frontend");
    govUk.initAll();
    async function fetchGlobalContent() {
      const globalConfig = await getGlobalContent();

      const getLocalStorageCookies = getLocalStorage({
        key: "cookies",
        defaultValue: isShowCookie,
      });
      setIsShowCookie(getLocalStorageCookies);

      const getLocalStorageConsentCookies = getLocalStorage({
        key: "consentCookies",
        defaultValue: isConsentCookie,
      });
      setIsConsentCookie(getLocalStorageConsentCookies);

      const defineFavicon =
        globalConfig.favicon == null || globalConfig.favicon == undefined
          ? "/favicon_default.ico"
          : urlFor(globalConfig.favicon)?.url();
      setFavicon(defineFavicon);
      setGlobalConfig(globalConfig);
    }
    fetchGlobalContent();
  }, [isConsentCookie, isShowCookie]);
  return (
    <html lang="en">
      <Head>
        <title>Digital site notice</title>
        <link rel="icon" href={favicon} sizes="any" />
      </Head>
      <body>
        {isShowCookie && (
          <CookiesBanner
            onClick={(value: any) => {
              setIsShowCookie(false),
                localStorage.setItem("cookies", "false"),
                setIsConsentCookie(value),
                localStorage.setItem("consentCookies", value);
            }}
          />
        )}
        {isConsentCookie &&
          environment !== "development" &&
          globalConfig?.googleAnalytics && (
            <GoogleAnalytics gaId={globalConfig?.googleAnalytics} />
          )}
        <Header globalConfig={globalConfig} />
        <Banner globalConfig={globalConfig} />
        <div className="layout-wrap">{children}</div>
      </body>
    </html>
  );
}
