import { gql } from "@/__generated__";
import ObjectDetailPageView from "./ObjectDetailPageView";
import { useQuery } from "@apollo/client";
import Spinner from "@/components/Spinner";
import { useState } from "react";
import { PaginationChangeHandler } from "@/components/Pagination";

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
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery(objectQuery, {
    fetchPolicy: 'cache-and-network',
    variables: {
      objectID: objectID,
      objectInput: { id: objectID },
      recordsInput: {
        paging: {
          currentPage: page,
        }
      }
    }
  });

  const handlePageChange: PaginationChangeHandler = ({ page: pageArg }) => {
    setPage(pageArg);
  };

  return (
    <Spinner visible={loading}>
      <ObjectDetailPageView 
        object={data?.objects?.data?.[0]} 
        fields={data?.fields || []}
        data={data?.records.data || []}
        paging={{
          total: data?.records.paging.total || 0,
          pageSize: data?.records?.paging.pageSize,
          currentPage: data?.records?.paging.currentPage,
          onChange: handlePageChange,
        }}
      />
    </Spinner>
  )
}