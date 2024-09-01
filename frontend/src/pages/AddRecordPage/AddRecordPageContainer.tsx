import { gql } from "@/__generated__";
import AddRecordPageView, { AddRecordPageSubmitHandler } from "./AddRecordPageView";
import { useMutation, useQuery } from "@apollo/client";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/router";
import routes from "@/utils/routes";

export type AddRecordPageContainerProps = {
  objectID: string;
}

const query = gql(`
  query AddRecordPage($objectID: UUID!, $objectInput: ObjectsInput) {
    objects(input: $objectInput) {
      data {
        id
        organizationID
        name
      }
    }
    fields(objectID: $objectID) {
      id
      label
      dataType
      defaultValue
      isRequired
    }
  }
`)

const mutation = gql(`
  mutation AddRecordPageSubmit($input: WriteRecordInput!) {
    storeRecord(input: $input) {
      id
    }
  }
`)

export default function AddRecordPageContainer({ objectID }: AddRecordPageContainerProps) {
  const { push } = useRouter();

  const { loading: getLoading, data } = useQuery(query, {
    variables: {
      objectID,
      objectInput: {
        id: objectID,
      }
    },
  });

  const [createRecord, { loading: mutationLoading }] = useMutation(mutation, {
    onCompleted: () => {
      push(routes.dashboard.objects.detail(objectID).index);
    }
  })

  const handleValid: AddRecordPageSubmitHandler = (values) => {
    createRecord({
      variables: {
        input: {
          objectID,
          data: values,
        }
      }
    })
  }

  const loading = mutationLoading || getLoading;

  return (
    <Spinner visible={loading}>
      <AddRecordPageView
        object={data?.objects.data[0]}
        fields={data?.fields || []}
        onValid={handleValid}
      />
    </Spinner>
  )
}