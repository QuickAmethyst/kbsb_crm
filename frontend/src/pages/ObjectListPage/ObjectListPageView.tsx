import DefaultTemplate from "@/templates/DefaultTemplate";
import Text from '@/components/Text';
import Space from "@/components/Space";
import Divider from "@/components/Divider";
import { ObjectsResult } from "@/__generated__/graphql";
import Spinner from "@/components/Spinner";
import theme from "@/utils/theme";
import Pagination, { PaginationProps } from "@/components/Pagination";

export type ObjectListPageViewProps = {
  loading?: boolean;
  data?: Array<ObjectsResult['data'][number]>
  paging?: PaginationProps;
}

export default function ObjectListPageView({
  loading,
  data,
  paging,
}: ObjectListPageViewProps) {
  return (
    <DefaultTemplate>
      <div className='container'>
        <div className='wrapper'>
          <Space fullWidth direction='vertical' size={[0, 24]}>
            <Text as="h2" size={24} weight={600}>Objects</Text>
            <Divider />

            <Spinner visible={loading}>
              <Space fullWidth direction='vertical'>
                {!!!data && <Text weight={400}>No Data</Text>}
                {data?.map((v) => (
                  <div key={v.id} className="item">
                    <Text size={16} color="#0000EE">{v.name}</Text>
                    <Text>{v.description}</Text>
                  </div>
                ))}
              </Space>
            </Spinner>

            <Space fullWidth justify='end' style={{ paddingRight: 10 }}>
              <Pagination {...paging} />
            </Space>
          </Space>
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

            .item {
              width: 100%;
              padding: 8px 0;
              display: flex;
              flex-direction: column;
              border-bottom: 1px dashed ${theme.color.grey[2]};
            }

            .item:last-child {
              border-bottom: none;
            }
          `}
        </style>
      </div>
    </DefaultTemplate>
  )
}