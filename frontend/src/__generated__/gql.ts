/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query PicklistField($fieldID: UUID!) {\n    picklistValues(fieldID: $fieldID) {\n      id\n      value\n    }\n  }\n": types.PicklistFieldDocument,
    "\n  query AddRecordPage($objectID: UUID!, $objectInput: ObjectsInput) {\n    objects(input: $objectInput) {\n      data {\n        id\n        organizationID\n        name\n      }\n    }\n    fields(objectID: $objectID) {\n      id\n      label\n      dataType\n      defaultValue\n      isRequired\n    }\n  }\n": types.AddRecordPageDocument,
    "\n  mutation AddRecordPageSubmit($input: WriteRecordInput!) {\n    storeRecord(input: $input) {\n      id\n    }\n  }\n": types.AddRecordPageSubmitDocument,
    "\n  query ObjectDetailPage($objectInput: ObjectsInput, $objectID: UUID!, $recordsInput: RecordsInput) {\n    objects(input: $objectInput) {\n      data {\n        id\n        organizationID\n        name\n      }\n    }\n    records(objectID: $objectID, input: $recordsInput) {\n      data {\n        id\n        objectID\n        data\n      }\n      paging {\n        currentPage\n        pageSize\n        total\n      }\n    }\n    fields(objectID: $objectID) {\n      label\n      dataType\n    }\n  }\n": types.ObjectDetailPageDocument,
    "\n  query ObjectListPage($input: ObjectsInput) {\n    objects(input: $input) {\n      data {\n        id\n        organizationID\n        name\n      }\n      paging {\n        currentPage\n        pageSize\n        total\n      }\n    }\n  }\n": types.ObjectListPageDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query PicklistField($fieldID: UUID!) {\n    picklistValues(fieldID: $fieldID) {\n      id\n      value\n    }\n  }\n"): (typeof documents)["\n  query PicklistField($fieldID: UUID!) {\n    picklistValues(fieldID: $fieldID) {\n      id\n      value\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query AddRecordPage($objectID: UUID!, $objectInput: ObjectsInput) {\n    objects(input: $objectInput) {\n      data {\n        id\n        organizationID\n        name\n      }\n    }\n    fields(objectID: $objectID) {\n      id\n      label\n      dataType\n      defaultValue\n      isRequired\n    }\n  }\n"): (typeof documents)["\n  query AddRecordPage($objectID: UUID!, $objectInput: ObjectsInput) {\n    objects(input: $objectInput) {\n      data {\n        id\n        organizationID\n        name\n      }\n    }\n    fields(objectID: $objectID) {\n      id\n      label\n      dataType\n      defaultValue\n      isRequired\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AddRecordPageSubmit($input: WriteRecordInput!) {\n    storeRecord(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation AddRecordPageSubmit($input: WriteRecordInput!) {\n    storeRecord(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ObjectDetailPage($objectInput: ObjectsInput, $objectID: UUID!, $recordsInput: RecordsInput) {\n    objects(input: $objectInput) {\n      data {\n        id\n        organizationID\n        name\n      }\n    }\n    records(objectID: $objectID, input: $recordsInput) {\n      data {\n        id\n        objectID\n        data\n      }\n      paging {\n        currentPage\n        pageSize\n        total\n      }\n    }\n    fields(objectID: $objectID) {\n      label\n      dataType\n    }\n  }\n"): (typeof documents)["\n  query ObjectDetailPage($objectInput: ObjectsInput, $objectID: UUID!, $recordsInput: RecordsInput) {\n    objects(input: $objectInput) {\n      data {\n        id\n        organizationID\n        name\n      }\n    }\n    records(objectID: $objectID, input: $recordsInput) {\n      data {\n        id\n        objectID\n        data\n      }\n      paging {\n        currentPage\n        pageSize\n        total\n      }\n    }\n    fields(objectID: $objectID) {\n      label\n      dataType\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ObjectListPage($input: ObjectsInput) {\n    objects(input: $input) {\n      data {\n        id\n        organizationID\n        name\n      }\n      paging {\n        currentPage\n        pageSize\n        total\n      }\n    }\n  }\n"): (typeof documents)["\n  query ObjectListPage($input: ObjectsInput) {\n    objects(input: $input) {\n      data {\n        id\n        organizationID\n        name\n      }\n      paging {\n        currentPage\n        pageSize\n        total\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;