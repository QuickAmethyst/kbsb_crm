import { ForwardedRef, forwardRef } from "react";
import Select, { SelectInstance, SelectProps } from "../Select/Select";
import { gql } from "@/__generated__";
import { useQuery } from "@apollo/client";
import Spinner from "../Spinner";

export type SelectFieldInstance = SelectInstance;
export type SelectFieldProps = Omit<SelectProps<string>, 'children'> & {
  fieldID: string;
}

const query = gql(`
  query PicklistField($fieldID: UUID!) {
    picklistValues(fieldID: $fieldID) {
      id
      value
    }
  }
`);

function PicklistField({ fieldID, ...props }: SelectFieldProps, ref: ForwardedRef<SelectInstance>) {
  const { data, loading } = useQuery(query, {
    fetchPolicy: 'cache-and-network',
    variables: {
      fieldID,
    }
  });

  return (
    <Spinner visible={loading}>
      <Select {...props} ref={ref}>
        {data?.picklistValues?.map((v) => (
          <Select.Option key={v.id} value={v.value}>{v.value}</Select.Option>
        ))}
      </Select>
    </Spinner>
  )
}

export default forwardRef(PicklistField);
