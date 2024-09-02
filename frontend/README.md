# KBSB CRM

## Getting Started

First, run the development server:
```
    docker-compose up -d
```


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Login using Acme Inc. The Blue Sky Inc data has not populated yet.

You can start create record by choosing desired object.

## GQL
You can interact with the application GQL by visiting [http://localhost:8000](http://localhost:8000)
The app identify the organization by using header `x-organization-id`.
For Acme Inc, the organization id is `1`.

### Create Object
Create organization object.

```
mutation StoreObject($input: WriteObjectInput!) {
  storeObject(input: $input) {
    id
    organizationID
    name
    description
  }
}

Variables
{
  "input": {
    "name": "Customer"
  }
}

Headers
{
  "x-organization-id": 1
}
```

### Create Field
You can create field for the object
```
mutation Field($input:WriteFieldInput!) {
  storeField(input:$input) {
    id
    organizationID
    objectID
    label
    dataType
    defaultValue
    isIndexed
    isRequired
  }
}

Variables
{
  "input": {
    "objectID": "1b3505c9-847a-4772-b920-8212dc21731f", // Customer
    "label": "subscription",
    "dataType": "picklist",
    "isIndexed": true,
    "isRequired": true,
    "defaultValue": "Basic",
    "picklistValues": ["Basic", "Standard", "Premium"]
  }
}

Headers
{
  "x-organization-id": 1
}
```

### Create Record
Create object's record
```
mutation StoreRecord($input: WriteRecordInput!) {
  storeRecord(input:$input) {
    id
    objectID
    data
  }
}

Variables
{
  "input": {
    "objectID": "1b3505c9-847a-4772-b920-8212dc21731f", // Customer
    "data": {
      "age": 12,
      "gender": "Female",
      "subscription": "Basic"
    }
  }
}

Headers
{
  "x-organization-id": 1
}
```

### Get and Filter Record
You can get list of records and filter it.
Currently supported filter operation is `EQ`.

```
query Records($objectID: UUID!, $input: RecordsInput) {
  records(objectID: $objectID, input: $input) {
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
}

Variables
{
  "objectID": "1b3505c9-847a-4772-b920-8212dc21731f",
  "input": {
    "paging": {
      "pageSize": 12,
      "currentPage": 1
    },
    "filters": [
      {
        "fieldID": "f1e56d30-5c34-497e-9b7f-401aedf3d8a6",
        "value": "Male"
      },
      {
        "fieldID": "8ad26a42-3743-45d7-989f-726235d3a1e1",
        "value": "Basic"
      },
      {
        "fieldID": "b2d7b0ae-2130-4a1f-ae15-527f5ebd379f",
        "value": "28"
      }
    ]
  }
}

Headers
{
  "x-organization-id": 1
}
```
