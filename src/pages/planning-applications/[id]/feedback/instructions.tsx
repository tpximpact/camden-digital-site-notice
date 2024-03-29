/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { ContextApplication } from "@/context";
import { urlFor } from "../../../../../util/client";
import { getLocalStorage } from "../../../../../util/helpLocalStorage";
import { Data } from "../../../../../util/type";

function Instructions() {
  const { globalConfig } = useContext(ContextApplication);
  const councilName = globalConfig?.councilName;
  const [application, setApplication] = useState<Data>();

  useEffect(() => {
    const getStorage = getLocalStorage({
      key: "application",
      defaultValue: {},
    });
    setApplication(getStorage);
  }, []);

  return (
    <section className="wrap-feedback">
      <h1 className="govuk-heading-l">Tell us what you think</h1>
      <div className="wrap-image-legend-feedback">
        {application?.image_head && (
          <Image
            width={80}
            height={57}
            alt="Development image"
            src={urlFor(application?.image_head)?.url()}
          />
        )}
        <div>
          <h3 className="govuk-heading-s">{application?.address}</h3>
          <p className="govuk-body">{application?.applicationNumber}</p>
        </div>
      </div>
      <p className="govuk-body">
        Your feedback helps us improve developments so they meet the needs of
        people in {councilName}. It's important you let us know what you think.
      </p>
    </section>
  );
}

export default Instructions;
