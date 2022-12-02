import { SearchObject } from '@/client';
import { Image, Space, Tag } from 'antd';

export declare type SearchLabelProps = {
  searchObject: SearchObject
}

export const SearchLabel = (props: SearchLabelProps) => {
  const { searchObject } = props
  return (
    <Space>
      {searchObject.img &&
        <Image width={40} src={searchObject.img} />}
      <Space
        direction="vertical"
        size="middle"
        style={{ display: 'flex' }}
      >
        {searchObject.name &&
          <Tag color="magenta">{searchObject.name}</Tag>}
        {searchObject.brand_name &&
          <Tag color="magenta">品牌：{searchObject.brand_name}</Tag>}
        {searchObject.title &&
          <Tag color="magenta">标题：{searchObject.title}</Tag>}
      </Space>
    </Space>
  )
}