import { globalContentRevalidate } from "@/app/actions/actions";

const CookiePolicyPage = async () => {
  const globalConfig: any = await globalContentRevalidate();
  return <p className="govuk-body">{globalConfig?.cookiePolicyContent}</p>;
};

export default CookiePolicyPage;
