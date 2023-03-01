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

export declare type DescriptionsCardListProps = ProFieldFCRenderProps & ProDescriptionsProps

export const DescriptionsCardList: React.FC<DescriptionsCardListProps> = (props) => {
  const { value, title, columns, ...rest } = props
  if (!Array.isArray(value)) return null;
  return (
    <Card bordered={true} title='列表'>
      {value.map(item =>
        <div style={{ margin: '1rem 0' }}>
          <DescriptionsCard value={item} columns={columns} title={title} {...rest} />
        </div>)}
    </Card>
  )

}

export const DescriptionsCardRenderFormItem: React.FC<DescriptionsCardProps> = (props) => {
  return <DescriptionsCard  {...props} />
}
export const DescriptionsCardRender: React.FC<DescriptionsCardProps> = (props) => {
  return <DescriptionsCard {...props} />
}

export const DescriptionsCardListRenderFormItem: React.FC<DescriptionsCardListProps> = (props) => {
  return <DescriptionsCardList  {...props} />
}
export const DescriptionsCardListRender: React.FC<DescriptionsCardListProps> = (props) => {
  return <DescriptionsCardList {...props} />
}