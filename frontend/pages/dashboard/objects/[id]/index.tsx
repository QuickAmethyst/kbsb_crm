import ObjectDetailPage from "@/pages/ObjectDetailPage";
import routes from "@/utils/routes";
import { useRouter } from "next/router";

export default function Page() {
  const { query, replace, isReady } = useRouter();
  const objectID = query?.id?.toString();

  if (!isReady) return;

  if (!!!objectID) {
    replace(routes.dashboard.index)
    return;
  }
  
  return <ObjectDetailPage objectID={objectID} />
}