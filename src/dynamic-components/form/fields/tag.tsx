import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, MinusCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { ProSchemaValueEnumMap } from '@ant-design/pro-components';
import { Space, Tag } from 'antd';

const TagIcon = {
  'success': <CheckCircleOutlined />,
  'processing': <SyncOutlined spin />,
  'error': <CloseCircleOutlined />,
  'warning': <ExclamationCircleOutlined />,
  'waiting': <ClockCircleOutlined />,
  'stop': <MinusCircleOutlined />
}


export declare type TagFieldProps = {
  valueEnum: ProSchemaValueEnumMap
  value?: any;
  onChange?: ((...rest: any[]) => void) | undefined;
}

export const tagField: React.FC<TagFieldProps> = (props) => {
  const { valueEnum, value } = props

  return (
    <Space>
      <Tag color={valueEnum[value].status || 'success'} icon={TagIcon[valueEnum[value].icon] || undefined} key={value}>
        {value}
      </Tag>
    </Space>
  )
}