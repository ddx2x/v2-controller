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

export declare type TagProps = ProFieldFCRenderProps

// 编辑
export const TagRenderFormItem: React.FC<TagProps> = (props) => {
  return null
}

// 只读
export const TagRender: React.FC<TagProps> = (props) => {
  const { valueEnum, value } = props
  if (!valueEnum) return null
  // @ts-ignore
  const obj = valueEnum.hasOwnProperty(value) ? valueEnum[value] : {}
  const status = obj?.status || 'success'
  // @ts-ignore
  const icon = obj?.icon ? TagIcon[obj?.icon] : undefined

  return (
    <Space>
      <Tag color={status} icon={icon} key={value}>
        {value}
      </Tag>
    </Space>
  )
}