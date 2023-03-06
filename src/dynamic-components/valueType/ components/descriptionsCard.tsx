import { Descriptions, DescriptionsProps } from '@/dynamic-components/descriptions';
import {
  ProDescriptions, ProDescriptionsProps, ProFieldFCRenderProps
} from '@ant-design/pro-components';
import { Card } from 'antd';


export declare type FDescriptionsProps = ProFieldFCRenderProps & DescriptionsProps

export const FDescriptions: React.FC<FDescriptionsProps> = (props) => {
  const { value, title, columns, ...rest } = props
  console.log(columns, value);

  return (
    <Descriptions columns={columns} dataSource={value} {...rest} />
  )
}

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

export declare type DescriptionsCardListProps = ProFieldFCRenderProps & ProDescriptionsProps & {
  cardTitle?: string
}

export const DescriptionsCardList: React.FC<DescriptionsCardListProps> = (props) => {
  const { cardTitle, value, title, columns, ...rest } = props
  if (!Array.isArray(value)) return null;
  return (
    <Card bordered={true} title={cardTitle} style={{ width: '100%' }}>
      {value.map(item =>
        <div style={{ margin: '1rem 0' }}>
          <DescriptionsCard value={item} columns={columns} title={title} {...rest} />
        </div>)}
    </Card>
  )
}

export const FDescriptionsRenderFormItem: React.FC<FDescriptionsProps> = (props) => {
  return <FDescriptions  {...props} />
}
export const FDescriptionsRender: React.FC<FDescriptionsProps> = (props) => {
  return <FDescriptions {...props} />
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