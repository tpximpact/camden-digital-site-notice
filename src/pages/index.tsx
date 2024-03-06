import { useEffect, useState, useContext } from "react";
import PlanningApplications from "../components/planning-application";
import { SanityClient } from "../lib/sanityClient";
import { PaginationType, Data } from "../../util/type";
import { ContextApplication } from "@/context";
import { DataClient } from "../lib/dataService";
import { OpenDataClient } from "../lib/openDataClient";
import ReactPaginate from "react-paginate";
import { NextIcon } from "../../public/assets/icons";
import { PreviewIcon } from "../../public/assets/icons";
import Input from "@/components/input";
import { Button } from "@/components/button";
import { ArrowIcon } from "../../public/assets/icons";
import Link from "next/link";
import { getLocationFromPostcode } from "../../util/geolocation";
import { getGlobalContent } from "../../util/client";
import { getDistance, convertDistance } from "geolib";

export const itemsPerPage = 6;
const dataClient = new DataClient(new SanityClient(), new OpenDataClient());

export async function getStaticProps() {
  const data = await dataClient.getAllSiteNotices(itemsPerPage, 0);
  return {
    props: {
      data: data.results,
      resultsTotal: data.total,
    },
  };
}

const Home = ({ data, globalContent, resultsTotal }: PaginationType) => {
  const { setGlobalInfo } = useContext(ContextApplication);
  const [postcode, setPostcode] = useState("");
  const [location, setLocation] = useState<any>();
  const [locationNotFound, setLocationNotFound] = useState<boolean>(false);
  const [displayData, setDisplayData] = useState<Data[]>();

  useEffect(() => {
    setDisplayData(data as Data[]);
    setGlobalInfo(globalContent);
    localStorage.setItem("globalInfo", JSON.stringify(globalContent));
  }, [data, globalContent, setGlobalInfo]);

  const pageCount = Math.ceil(resultsTotal / itemsPerPage);

  const handlePageClick = async (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % resultsTotal;
    const newTotalPagecount = resultsTotal - newOffset;
    const totalPage =
      newTotalPagecount >= itemsPerPage ? itemsPerPage : newTotalPagecount;

    const newData = await dataClient.getAllSiteNotices(totalPage, newOffset);
    setDisplayData(newData.results as Data[]);
  };

  // this needs to be refactored once data is held in Sanity
  const onSearchPostCode = async () => {
    let location: any;

    if (postcode != null) {
      setLocationNotFound(false);
      location = await getLocationFromPostcode(postcode);

      if (location == null) {
        setLocationNotFound(true);
      }
    }
    setLocation(location);

    if (location) {
      //remove any data elements that dont have a location or location.lat location.lng, keep the elements so i can attache them to the end of the array
      const dataWithoutLocation = data.filter((el) => !el.location);
      dataWithoutLocation.forEach((el) => {
        const index = data.indexOf(el);
        if (index !== -1) {
          data.splice(index, 1);
        }
      });

      const sortedData = data.sort((a, b) => {
        if (!a.location || !b.location) {
          return -1;
        }
        const distanceA = getDistance(
          { latitude: location.latitude, longitude: location.longitude },
          { latitude: a.location.lat, longitude: a.location.lng },
        );
        const distanceB = getDistance(
          { latitude: location.latitude, longitude: location.longitude },
          { latitude: b.location.lat, longitude: b.location.lng },
        );
        //adds the distance to the object
        a.distance = convertDistance(distanceA, "mi").toFixed(2);
        return distanceA - distanceB;
      });
      //adds the data without location to the end of the array
      sortedData.push(...dataWithoutLocation);
      setDisplayData(sortedData as Data[]);
    }
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

      <div className="wrap-pagination">
        <ReactPaginate
          breakLabel="..."
          nextLabel={<NextIcon />}
          onPageChange={handlePageClick}
          pageRangeDisplayed={2}
          marginPagesDisplayed={1}
          pageCount={pageCount}
          previousLabel={<PreviewIcon />}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination govuk-body"
          activeClassName="active"
          renderOnZeroPageCount={null}
        />
      </div>
    </div>
  );
};

export default Home;
