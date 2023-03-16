import { ProFieldFCRenderProps } from '@ant-design/pro-components';
import { Card, Col, Descriptions, Divider, Image, Row } from 'antd';

export declare type MerchandiseProps = ProFieldFCRenderProps & {
}

export const Merchandise: React.FC<MerchandiseListProps> = (props) => {
  const { value } = props
  const { image, title, attrs } = value

  return (
    <Row justify="space-around" align="top">
      <Col span={8} style={{ paddingTop: '3%' }} >
        <Image src={image} width={'100%'} />
      </Col>
      <Col span={13}>
        <Descriptions column={1} title={title} size={'small'} style={{ marginBottom: 0 }}>
          {attrs && Object.entries(attrs).map(([key, value], index) =>
            <Descriptions.Item
              key={'attrs-descriptions' + index}
              style={{ paddingBottom: 1 }}
              label={key}>
              {value}
            </Descriptions.Item>
          )}
        </Descriptions>

      </Col>
    </Row>
  )
}

export const MerchandiseRenderFormItem: React.FC<MerchandiseListProps> = (props) => {
  return <Merchandise  {...props} />
}
export const MerchandiseRender: React.FC<MerchandiseListProps> = (props) => {
  return <Merchandise {...props} />
}

export declare type MerchandiseListProps = ProFieldFCRenderProps & {
}

export const MerchandiseList: React.FC<MerchandiseListProps> = (props) => {
  const { value } = props
  return (
    <Card hoverable>
      {Array.isArray(value) && value.map((item: any, index) => (
        <div key={'merchandise' + index}>
          <Merchandise key={'merchandise-' + index} text='' mode='read' value={item} />
          <Divider style={{ marginTop: 5, marginBottom: 5 }} />
        </div>
      ))}
    </Card>
  )
}

export const MerchandiseListRenderFormItem: React.FC<MerchandiseListProps> = (props) => {
  return <MerchandiseList  {...props} />
}
export const MerchandiseListRender: React.FC<MerchandiseListProps> = (props) => {
  return <MerchandiseList {...props} />
}