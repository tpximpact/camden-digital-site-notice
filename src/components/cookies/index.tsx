"use client";
import Link from "next/link";
import { createCookies } from "@/app/actions/actions";

const CookiesBanner = () => {
  return (
    <div
      className="govuk-cookie-banner"
      data-nosnippet
      role="region"
      aria-label="Cookies"
    >
      <div className="govuk-cookie-banner__message govuk-width-container">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <h2 className="govuk-cookie-banner__heading govuk-heading-m">
              Essential Cookies
            </h2>
            <div className="govuk-cookie-banner__content">
              <p className="govuk-body">
                We use some essential cookies to make this service work.
              </p>
              <p className="govuk-body">
                We’d also like to use analytics cookies so we can understand how
                you use the service and make improvements.
              </p>
            </div>
          </div>
        </div>
        <div className="govuk-button-group">
          <button
            type="button"
            className="govuk-button"
            data-module="govuk-button"
            onClick={() => {
              createCookies(true);
            }}
          >
            Accept analytics cookies
          </button>
          <button
            type="button"
            className="govuk-button"
            data-module="govuk-button"
            onClick={() => {
              createCookies(false);
            }}
          >
            Reject analytics cookies
          </button>
          <Link className="govuk-link" href="/cookie-policy" target="_blank">
            View cookies
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CookiesBanner;
