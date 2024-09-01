import Divider from "@/components/Divider";
import Space from "@/components/Space";
import DefaultTemplate from "@/templates/DefaultTemplate";
import Text from '@/components/Text';
import DataGrid, { DataGridColumn } from "@/components/DataGrid";
import { Field, ObjectDetailPageQuery, ObjectsResult, RecordsResult } from "@/__generated__/graphql";
import Button from "@/components/Button";
import AddIcon from "@/components/Icon/icons/AddIcon";
import Link from "next/link";
import routes from "@/utils/routes";
import Pagination, { PaginationProps } from "@/components/Pagination";

type ObjectDetailPageViewProps = {
  object?: ObjectsResult['data'][number],
  data: Array<RecordsResult['data'][number]>
  fields: Array<ObjectDetailPageQuery['fields'][number]>;
  paging: PaginationProps;
}

function ObjectDetailPageView({
  object,
  data,
  fields,
  paging,
}: ObjectDetailPageViewProps) {
  const columns = fields.map((f) => ({
    key: f.label,
    dataIndex: f.label,
    title: f.label,
  }));

  return (
    <DefaultTemplate>
      <div className='container'>
        <div className='wrapper'>
          <Space fullWidth direction='vertical' size={[0, 24]}>
            <Space fullWidth justify="between">
              <Text as="h3" size={24} weight={600}>{object?.name}</Text>

              <Link legacyBehavior passHref href={routes.dashboard.objects.detail(object?.id).addRecord}>
                <Button>
                  <AddIcon size={18} />&nbsp;Record
                </Button>
              </Link>
            </Space>
  
            <Divider />

            <Space fullWidth direction="vertical" size={[0, 12]}>
              <DataGrid columns={columns} data={data.map((v) => v.data)} />
            </Space>

            <Space fullWidth justify='between' style={{ paddingRight: 10 }}>
              <Link legacyBehavior passHref href={routes.dashboard.index}>
                <Button color='secondary'>Back</Button>
              </Link>
              <Pagination {...paging} />
            </Space>
          </Space>
        </div>
      </div>

      <style jsx>
        {`
          .container {
            padding: 64px 0;
            display: flex;
            justify-content: center;
          }

          .wrapper {
            width: 60%;
            max-width: 1148px;
          }
        `}
      </style>
    </DefaultTemplate>
  )
}

export default ObjectDetailPageView;