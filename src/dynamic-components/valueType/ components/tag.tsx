import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, MinusCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { ProFieldFCRenderProps } from '@ant-design/pro-components';
import { Space, Tag } from 'antd';

const TagIcon = {
  'success': <CheckCircleOutlined />,
  'processing': <SyncOutlined spin />,
  'error': <CloseCircleOutlined />,
  'warning': <ExclamationCircleOutlined />,
  'waiting': <ClockCircleOutlined />,
  'stop': <MinusCircleOutlined />
}

export declare type TagProps = ProFieldFCRenderProps & {
  value?: any;
  onChange?: ((...rest: any[]) => void) | undefined;
}

// 编辑
export const TagRenderFormItem: React.FC<TagProps> = (props) => {
  return null
}

// 只读
export const TagRender: React.FC<TagProps> = (props) => {
  const { valueEnum, value } = props
  if (!valueEnum) return null
  if (!valueEnum[value]) return null

  return (
    <Space>
      <Tag color={valueEnum[value]?.status || 'success'} icon={TagIcon[valueEnum[value]?.icon] || undefined} key={value}>
        {value}
      </Tag>
    </Space>
  )
}