import { gql } from "@/__generated__";
import { useQuery } from "@apollo/client";
import ObjectListPageView from "./ObjectListPageView";
import { useState } from "react";


const query = gql(`
  query ObjectListPage($input: ObjectsInput) {
    objects(input: $input) {
      data {
        id
        organizationID
        name
      }
      paging {
        currentPage
        pageSize
        total
      }
    }
  }
`)

export default function ObjectListPageContainer() {
  const [page, setPage] = useState(1);
  const { previousData, data, loading } = useQuery(query, {
    variables: { input: { paging: { currentPage: page, pageSize: 12 } } },
  });

  const actualData = loading ? previousData?.objects.data : data?.objects.data

  return (
    <ObjectListPageView 
      loading={loading}
      data={actualData || []} 
      paging={{
        ...data?.objects?.paging,
        onChange: ({ page: nextPage }) => {
          setPage(nextPage);
        },
      }}
    />
  )
}