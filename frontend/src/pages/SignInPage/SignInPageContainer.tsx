import { setOrganizationCookie } from "@/utils/cookies/organization";
import SignInPageView, { SignInPageValidHandler } from "./SignInPageView";
import { useRouter } from "next/router";
import routes from "@/utils/routes";

export default function SignInPageContainer() {
  const { replace } = useRouter();

  const handleValid: SignInPageValidHandler = (values) => {
    setOrganizationCookie({ id: values.organizationID });
    replace(routes.dashboard.index)
  }

  return <SignInPageView onValid={handleValid} />
}