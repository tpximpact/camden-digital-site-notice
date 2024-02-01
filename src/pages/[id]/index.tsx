import { useContext, useEffect, useState } from "react";
import { ContextApplication } from "@/context";
import Breadcrumbs from "@/components/breadcrumbs";
import About from "./components/about";
import Impact from "./components/impact";
import Process from "./components/process";
import { DataDetails } from "../../../util/type";
import { getActiveApplications, getApplicationById } from "../../../util/client";
import moment from 'moment'


export async function getStaticProps(context: any) {
  const {id} = context.params;
  const data = await getApplicationById(id)
  return {
    props: {
      data: data[0]
    },
  };
}

export async function getStaticPaths() {
  const data = await getActiveApplications();
  
  return {
  paths: data.map((doc: any) => ({params: {data: doc, id: doc._id}})),
  fallback: true,
  }
}


const Application = ({data}: {data: DataDetails} ) => {
  const {setDataApplication, setQuestion} = useContext(ContextApplication)
  const [commentDeadline, setCommentDeadline] = useState('')

  useEffect(() => {
    setQuestion(0)
    const deadline = moment(data?.valid_from_date).add(21, 'days')
    const today = moment().hour(0).minute(0).second(0)
    const deadlineTime = moment.duration(today.diff(deadline)).asDays().toFixed(0)
    setCommentDeadline(deadlineTime)
    setDataApplication({...data, commentDeadline: deadlineTime})
    localStorage.setItem("application", JSON.stringify({
      'address': data?.address,
      'image_head': data?.image_head,
      'image_gallery': data?.image_gallery,
      'deadline': data?.commentDeadline,
      'name': data?.name,
      'id': data?._id,
      'system_status': data?.system_status,
      'application_number': data?.applicationNumber
    }))
  },[data, setDataApplication, setQuestion, commentDeadline])
  

const breadcrumbs_array = [{name: "Planning applications", href: "/"}, {name: data?.name, href:""}]


    return (
        <>
        <Breadcrumbs breadcrumbs_info={breadcrumbs_array}/>
        <About data={data}/>
        <Impact data={data}/>
        <Process id={data?._id} commentDeadline={data?.commentDeadline} system_status={data?.system_status}/>
        </>
    )
}

export default Application;

