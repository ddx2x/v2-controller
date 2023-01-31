import { ProSchemaValueEnumMap } from '@ant-design/pro-components';
import { Space, Tag } from 'antd';


export declare type TagFieldProps = {
  valueEnum: ProSchemaValueEnumMap
  value?: any;
  onChange?: ((...rest: any[]) => void) | undefined;
}

export const tagField: React.FC<TagFieldProps> = (props) => {
  const { valueEnum, value } = props

  return (
    <Space>
      <Tag color={valueEnum[value].status || 'success'} key={value}>
        {value}
      </Tag>
    </Space>
  )
}