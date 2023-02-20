import {
  ProDescriptions, ProDescriptionsProps, ProFieldFCRenderProps
} from '@ant-design/pro-components';
import { Card } from 'antd';

export declare type DescriptionsCardProps = ProFieldFCRenderProps & ProDescriptionsProps

export const DescriptionsCard: React.FC<DescriptionsCardProps> = (props) => {
  const { value, title, columns, ...rest } = props
  return (
    <Card title={title} hoverable>
      <ProDescriptions
        // @ts-ignore
        columns={columns}
        dataSource={value}
        {...rest}
      />
    </Card>
  )
}


export const DescriptionsCardRenderFormItem: React.FC<DescriptionsCardProps> = (props) => {
  return <DescriptionsCard  {...props} />
}
export const DescriptionsCardRender: React.FC<DescriptionsCardProps> = (props) => {
  return <DescriptionsCard {...props} />
}