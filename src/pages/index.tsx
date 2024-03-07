import { useEffect, useState, useContext } from "react";
import PlanningApplications from "../components/planning-application";
import Pagination from "../components/pagination";
import Input from "@/components/input";
import { Button } from "@/components/button";
import { ArrowIcon } from "../../public/assets/icons";
import {
  getActiveApplications,
  getActiveApplicationsPagination,
} from "../../util/client";
import { PaginationType, Data } from "../../util/type";
import { getLocationFromPostcode } from "../../util/geolocation";
import Link from "next/link";
import { getLocalStorage } from "../../util/helpLocalStorage";

export const itemsPerPage = 6;

export async function getStaticProps() {
  const dataId = await getActiveApplications();
  const data = await getActiveApplicationsPagination({ itemsPerPage });

  return {
    props: {
      dataId,
      data,
    },
  };
}

const Home = ({ dataId, data }: PaginationType) => {
  const [globalContent, setGlobalContent] = useState<any>();
  const [postcode, setPostcode] = useState("");
  const [location, setLocation] = useState<any>();
  const [locationNotFound, setLocationNotFound] = useState<boolean>(false);
  const [displayData, setDisplayData] = useState<Data[]>();

  useEffect(() => {
    setDisplayData(data);
    const globalInfoStorage = getLocalStorage({
      key: "globalInfo",
      defaultValue: {},
    });
    setGlobalContent(globalInfoStorage);
  }, [dataId, data]);

  async function onSelectPage({ _id }: any) {
    const res = await getActiveApplicationsPagination({
      _id,
      itemsPerPage,
      location,
    });
    setDisplayData(res);
  }

  const onSearchPostCode = async () => {
    let location;

    if (postcode != null) {
      setLocationNotFound(false);
      location = await getLocationFromPostcode(postcode);

      if (location == null) {
        setLocationNotFound(true);
      }
    }

    setLocation(location);
    const res = await getActiveApplicationsPagination({
      itemsPerPage,
      location,
    });
    setDisplayData(res);
  };

  return (
    <div className="wrap-home">
      <h1
        className="govuk-heading-xl"
        role="heading"
        style={{ display: "inline-block" }}
      >
        Find planning applications near you
      </h1>
      <p className="govuk-body-m">
        Find, review and leave your comments on planning applications in{" "}
        {globalContent?.councilName}
      </p>
      <section className="search-grid">
        <Input
          label="Enter a postcode to find planning applications nearby"
          type="text"
          value={postcode}
          onChange={(e) => setPostcode(e)}
          isError={locationNotFound}
          messageError="Please enter a valid postcode"
        />
        <Button
          className="grid-button-search"
          content="Search"
          icon={<ArrowIcon />}
          onClick={() => onSearchPostCode()}
        />
        {globalContent?.signUpUrl && (
          <Link
            className="govuk-button grid-button-signup govuk-button--secondary"
            target="_blank"
            style={{ textDecoration: "none" }}
            href={`${globalContent?.signUpUrl}`}
          >
            Sign up for alerts on applications near you
          </Link>
        )}
      </section>
      {displayData && (
        <PlanningApplications data={displayData} searchLocation={location} />
      )}

      {dataId?.length > itemsPerPage && (
        <Pagination
          data={dataId}
          onSelectPage={(value: any) => onSelectPage(value)}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
};

export default Home;
