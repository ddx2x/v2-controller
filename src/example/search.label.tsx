import { SearchObject } from '@/client'
import { Space } from 'antd'
import { Image } from 'antd';

export declare type SearchLabelProps = {
  searchObject: SearchObject
}

export const SearchLabel = (props: SearchLabelProps) => {
  const { searchObject } = props
  return (
    <Space>
      <Image width={40} src={'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'} />
      {searchObject.brand_name}
      {searchObject.name}
      {searchObject.title}
    </Space>
  )
}