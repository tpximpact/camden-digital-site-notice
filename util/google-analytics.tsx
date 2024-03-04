export const loadGoogleAnalytics = (apiKey: any) => {
  console.log("test", apiKey);
  const config = {
    apiKey: apiKey,
    product: "community",
    optionalCookies: [
      {
        name: "analytics",
        label: "Analytics",
        description:
          "Analytical cookies help us to improve our website by collecting and reporting information on its usage.",
        cookies: [],
        onAccept: function () {
          console.log("accept");
          // Enable Google Analytics
          //   window.dataLayer = window.dataLayer || [];
          //   function gtag() {
          //     dataLayer.push(arguments);
          //   }
          //   gtag("js", new Date());
          //   gtag("config", "${gtag.GA_TRACKING_ID}", {
          //     page_path: window.location.pathname,
          //     cookie_flags: "SameSite=None;Secure",
          //   });

          // Enable Google Tag Manager
          //   (function (w, d, s, l, i) {
          //     w[l] = w[l] || [];
          //     w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
          //     var f = d.getElementsByTagName(s)[0],
          //       j = d.createElement(s),
          //       dl = l != "dataLayer" ? "&l=" + l : "";
          //     j.async = true;
          //     j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
          //     f.parentNode.insertBefore(j, f);
          //   })(window, document, "script", "dataLayer", "GTM-WF28PJS");
        },
        onRevoke: function () {
          console.log("reject");
          // Disable Google Analytics
          //   window["ga-disable-${gtag.GA_TRACKING_ID}"] = true;

          //       // Disable Google Tag Manager
          //       var dataLayer = window.dataLayer || [];
          //       dataLayer.push({
          //         event: "gtm.disable",
          //         "gtm.start": new Date().getTime(),
          //       });
        },
      },
    ],
    // position: "RIGHT",
    // theme: "DARK",
  };

  window?.CookieControl?.load(config);
};
