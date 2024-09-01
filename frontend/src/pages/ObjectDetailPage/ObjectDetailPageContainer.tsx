import { gql } from "@/__generated__";
import ObjectDetailPageView from "./ObjectDetailPageView";
import { useQuery } from "@apollo/client";
import Spinner from "@/components/Spinner";

export type ObjectDetailPageContainerProps = {
  objectID: string;
}

const objectQuery = gql(`
  query ObjectDetailPage($objectInput: ObjectsInput, $objectID: UUID!, $recordsInput: RecordsInput) {
    objects(input: $objectInput) {
      data {
        id
        organizationID
        name
      }
    }
    records(objectID: $objectID, input: $recordsInput) {
      data {
        id
        objectID
        data
      }
      paging {
        currentPage
        pageSize
        total
      }
    }
    fields(objectID: $objectID) {
      label
      dataType
    }
  }
`);

export default function ObjectDetailPageContainer({
  objectID
}: ObjectDetailPageContainerProps) {
  const { data, loading } = useQuery(objectQuery, {
    variables: {
      objectID: objectID,
      objectInput: { id: objectID },
    }
  });


  return (
    <Spinner visible={loading}>
      <ObjectDetailPageView 
        object={data?.objects?.data?.[0]} 
        fields={data?.fields || []}
        data={data?.records.data || []}
      />
    </Spinner>
  )
}