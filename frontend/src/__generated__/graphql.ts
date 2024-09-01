/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Any: { input: any; output: any; }
  Map: { input: any; output: any; }
  Time: { input: any; output: any; }
  UUID: { input: any; output: any; }
  Uint: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type Field = {
  __typename?: 'Field';
  dataType: FieldDataType;
  defaultValue?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  isIndexed: Scalars['Boolean']['output'];
  isRequired: Scalars['Boolean']['output'];
  label: Scalars['String']['output'];
  objectID: Scalars['UUID']['output'];
  organizationID: Scalars['Int']['output'];
};

export enum FieldDataType {
  Date = 'date',
  Number = 'number',
  Picklist = 'picklist',
  String = 'string'
}

export type Mutation = {
  __typename?: 'Mutation';
  storeField: Field;
  storeObject: Object;
  storeRecord: Record;
};


export type MutationStoreFieldArgs = {
  input: WriteFieldInput;
};


export type MutationStoreObjectArgs = {
  input: WriteObjectInput;
};


export type MutationStoreRecordArgs = {
  input: WriteRecordInput;
};

export type Object = {
  __typename?: 'Object';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  organizationID: Scalars['Int']['output'];
};

export type ObjectsInput = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  paging?: InputMaybe<PagingInput>;
};

export type ObjectsResult = {
  __typename?: 'ObjectsResult';
  data: Array<Object>;
  paging: Paging;
};

export type Paging = {
  __typename?: 'Paging';
  currentPage: Scalars['Uint']['output'];
  pageSize: Scalars['Uint']['output'];
  total: Scalars['Uint']['output'];
};

export type PagingInput = {
  currentPage?: InputMaybe<Scalars['Uint']['input']>;
  pageSize?: InputMaybe<Scalars['Uint']['input']>;
};

export type PicklistValues = {
  __typename?: 'PicklistValues';
  fieldID: Scalars['UUID']['output'];
  id: Scalars['UUID']['output'];
  value: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  fields: Array<Field>;
  objects: ObjectsResult;
  picklistValues: Array<PicklistValues>;
  records: RecordsResult;
};


export type QueryFieldsArgs = {
  objectID: Scalars['UUID']['input'];
};


export type QueryObjectsArgs = {
  input?: InputMaybe<ObjectsInput>;
};


export type QueryPicklistValuesArgs = {
  fieldID: Scalars['UUID']['input'];
};


export type QueryRecordsArgs = {
  input?: InputMaybe<RecordsInput>;
  objectID: Scalars['UUID']['input'];
};

export type Record = {
  __typename?: 'Record';
  data: Scalars['Map']['output'];
  id: Scalars['UUID']['output'];
  objectID: Scalars['UUID']['output'];
};

export type RecordFilter = {
  fieldID: Scalars['UUID']['input'];
  value: Scalars['String']['input'];
};

export type RecordsInput = {
  filters?: InputMaybe<Array<RecordFilter>>;
  paging?: InputMaybe<PagingInput>;
};

export type RecordsResult = {
  __typename?: 'RecordsResult';
  data: Array<Record>;
  paging: Paging;
};

export type WriteFieldInput = {
  dataType: FieldDataType;
  defaultValue?: InputMaybe<Scalars['String']['input']>;
  isIndexed: Scalars['Boolean']['input'];
  isRequired: Scalars['Boolean']['input'];
  label: Scalars['String']['input'];
  objectID: Scalars['UUID']['input'];
  picklistValues?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type WriteObjectInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type WriteRecordInput = {
  data: Scalars['Map']['input'];
  objectID: Scalars['UUID']['input'];
};

export type PicklistFieldQueryVariables = Exact<{
  fieldID: Scalars['UUID']['input'];
}>;


export type PicklistFieldQuery = { __typename?: 'Query', picklistValues: Array<{ __typename?: 'PicklistValues', id: any, value: string }> };

export type AddRecordPageQueryVariables = Exact<{
  objectID: Scalars['UUID']['input'];
  objectInput?: InputMaybe<ObjectsInput>;
}>;


export type AddRecordPageQuery = { __typename?: 'Query', objects: { __typename?: 'ObjectsResult', data: Array<{ __typename?: 'Object', id: any, organizationID: number, name: string }> }, fields: Array<{ __typename?: 'Field', id: any, label: string, dataType: FieldDataType, defaultValue?: string | null, isRequired: boolean }> };

export type AddRecordPageSubmitMutationVariables = Exact<{
  input: WriteRecordInput;
}>;


export type AddRecordPageSubmitMutation = { __typename?: 'Mutation', storeRecord: { __typename?: 'Record', id: any } };

export type ObjectDetailPageQueryVariables = Exact<{
  objectInput?: InputMaybe<ObjectsInput>;
  objectID: Scalars['UUID']['input'];
  recordsInput?: InputMaybe<RecordsInput>;
}>;


export type ObjectDetailPageQuery = { __typename?: 'Query', objects: { __typename?: 'ObjectsResult', data: Array<{ __typename?: 'Object', id: any, organizationID: number, name: string }> }, records: { __typename?: 'RecordsResult', data: Array<{ __typename?: 'Record', id: any, objectID: any, data: any }>, paging: { __typename?: 'Paging', currentPage: any, pageSize: any, total: any } }, fields: Array<{ __typename?: 'Field', label: string, dataType: FieldDataType }> };

export type ObjectListPageQueryVariables = Exact<{
  input?: InputMaybe<ObjectsInput>;
}>;


export type ObjectListPageQuery = { __typename?: 'Query', objects: { __typename?: 'ObjectsResult', data: Array<{ __typename?: 'Object', id: any, organizationID: number, name: string }>, paging: { __typename?: 'Paging', currentPage: any, pageSize: any, total: any } } };


export const PicklistFieldDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PicklistField"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fieldID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"picklistValues"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"fieldID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fieldID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<PicklistFieldQuery, PicklistFieldQueryVariables>;
export const AddRecordPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AddRecordPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"objectID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"objectInput"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ObjectsInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"objects"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"objectInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organizationID"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objectID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"objectID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"dataType"}},{"kind":"Field","name":{"kind":"Name","value":"defaultValue"}},{"kind":"Field","name":{"kind":"Name","value":"isRequired"}}]}}]}}]} as unknown as DocumentNode<AddRecordPageQuery, AddRecordPageQueryVariables>;
export const AddRecordPageSubmitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddRecordPageSubmit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WriteRecordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storeRecord"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AddRecordPageSubmitMutation, AddRecordPageSubmitMutationVariables>;
export const ObjectDetailPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObjectDetailPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"objectInput"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ObjectsInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"objectID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recordsInput"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"RecordsInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"objects"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"objectInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organizationID"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"records"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objectID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"objectID"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recordsInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"objectID"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paging"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objectID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"objectID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"dataType"}}]}}]}}]} as unknown as DocumentNode<ObjectDetailPageQuery, ObjectDetailPageQueryVariables>;
export const ObjectListPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObjectListPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ObjectsInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"objects"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organizationID"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paging"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<ObjectListPageQuery, ObjectListPageQueryVariables>;