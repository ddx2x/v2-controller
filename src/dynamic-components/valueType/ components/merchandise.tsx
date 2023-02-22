import { ProFieldFCRenderProps } from '@ant-design/pro-components';
import { Card, Divider, Image } from 'antd';

export declare type MerchandiseProps = ProFieldFCRenderProps & {
}

export const Merchandise: React.FC<MerchandiseListProps> = (props) => {
  const { value } = props
  const { image, title, attrs } = value

  return (
    <div style={{ width: '100%', display: 'flex' }}>
      <div
        style={{ position: 'relative', width: '28%', overflow: 'hidden' }}
      >
        <Image
          src={image}
          style={{
            width: '100%',
            // height: '133%',
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexFlow: 'column nowrap',
          flexGrow: 1,
          WebkitBoxFlex: 1,
          WebkitBoxOrient: 'vertical',
          WebkitBoxDirection: 'normal',
          WebkitBoxPack: 'justify',
          // justifyContent: 'space-between',
          padding: '0% 3% 3% 4%',
          width: '78%'
        }}
      >
        {title && <><div style={{ fontWeight: 700 }}>{title}</div></>}
        {attrs && Object.entries(attrs).map(([key, value]) => <div>{key}: {value}</div>)}
      </div>
    </div>
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
      {Array.isArray(value) && value.map((item: any) => (
        <>
          <Merchandise text='' mode='read' value={item} />
          <Divider style={{ marginTop: '0' }} />
        </>
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