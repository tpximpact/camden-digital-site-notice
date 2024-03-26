import { globalContentRevalidate } from "../../util/actions";

async function ConcernInfo() {
  const globalConfig: any = globalContentRevalidate();
  return <p className="govuk-body">{globalConfig?.concernContent}</p>;
}

export default ConcernInfo;
