import { ProFieldFCRenderProps } from '@ant-design/pro-components'
import { Transfer as AntdTransfer, TransferProps as AntdTransferProps } from 'antd'

export declare type TransferProps = ProFieldFCRenderProps & AntdTransferProps<any>

export const Transfer = (props: TransferProps) => {
  const { value, ...rest } = props

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <AntdTransfer
        style={{ margin: '0 auto' }}
        listStyle={{
          width: 250,
          height: 300,
        }}
        targetKeys={value || []}
        render={(item) => item.title}
        {...rest}
      />

    </div>
  )
}

export const TransferRender: React.FC<TransferProps> = (props) => {
  return <Transfer {...props} />
}

export const TransferRenderFormItem: React.FC<TransferProps> = (props) => {
  return <Transfer {...props} />
}