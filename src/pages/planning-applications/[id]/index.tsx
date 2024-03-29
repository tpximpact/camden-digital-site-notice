import { useEffect, useState } from "react";
import Breadcrumbs from "@/components/breadcrumbs";
import About from "../../../components/about";
import Impact from "../../../components/impact";
import Process from "../../../components/process";
import { DataDetails } from "../../../../util/type";
import {
  getActiveApplications,
  getApplicationById,
} from "../../../../util/client";
import moment from "moment";

export async function getStaticProps(context: any) {
  const { id } = context.params;
  const data = await getApplicationById(id);

  if (!data || data.length === 0) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
  return {
    props: {
      data: data[0],
    },
  };
}

export async function getStaticPaths() {
  const data = await getActiveApplications();
  if (!data || !Array.isArray(data) || data.length === 0) {
    return { paths: [], fallback: "blocking" };
  } else {
    return {
      paths: data.map((doc: any) => ({ params: { data: doc, id: doc._id } })),
      fallback: "blocking",
    };
  }
}

const Application = ({ data }: { data: DataDetails }) => {
  const [consultationDeadline, setConsultationDeadline] = useState<string>("");

  useEffect(() => {
    let deadlineTime;

    if (data?.enableComments) {
      const deadline = moment(data?.consultationDeadline);
      const today = moment().hour(0).minute(0).second(0);
      deadlineTime = moment.duration(deadline.diff(today)).asDays().toFixed(0);
      setConsultationDeadline(deadlineTime);
    }

    localStorage.setItem(
      "application",
      JSON.stringify({
        address: data?.address,
        image_head: data?.image_head,
        image_gallery: data?.image_gallery,
        deadline: data?.consultationDeadline,
        name: data?.name,
        _id: data?._id,
        applicationNumber: data?.applicationNumber,
        applicationStage: data?.applicationStage,
        applicationUpdatesUrl: data?.applicationUpdatesUrl,
      }),
    );
  }, [data, consultationDeadline]);

  const breadcrumbs_array = [
    { name: "Planning applications", href: "/" },
    { name: data?.name || data?.address, href: "" },
  ];

  const {
    showAccess,
    showCarbon,
    showHealthcare,
    showHousing,
    showJobs,
    showOpenSpace,
  } = data || {};
  return (
    <>
      <Breadcrumbs breadcrumbs_info={breadcrumbs_array} />
      <About data={data} />
      {(showAccess ||
        showCarbon ||
        showHealthcare ||
        showHousing ||
        showJobs ||
        showOpenSpace) && <Impact data={data} />}
      <Process data={data} consultationDeadline={consultationDeadline} />
    </>
  );
};

export default Application;
