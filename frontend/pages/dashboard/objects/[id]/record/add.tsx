import AddRecordPage from "@/pages/AddRecordPage";
import routes from "@/utils/routes";
import { useRouter } from "next/router";

export default function Page() {
  const { query, isReady, replace } = useRouter();

  if (!isReady) return;

  if (!!!query.id) {
    replace(routes.dashboard.index);
    return;
  }

  return <AddRecordPage objectID={query.id?.toString() || ''} />
}