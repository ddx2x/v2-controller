import { Input, Tree as ATree } from 'antd';
import { DataNode, EventDataNode } from 'antd/lib/tree';
import { useState } from 'react';

// 🌲树父节点
const getParentKey = (key: React.Key, tree: DataNode[]): React.Key => {
  let parentKey: React.Key;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey!;
};


export declare type TreeProps = {
  useTreeSearch?: boolean
  treeData: DataNode[]
  onTreeSelect: (node: EventDataNode<DataNode>) => void
}

export const Tree = (props: TreeProps) => {
  const { treeData, onTreeSelect, useTreeSearch } = props;

  const [treeSelectedNode, setTreeSelectedNode] = useState<EventDataNode<DataNode>>()
  const [treeExpandedKeys, setTreeExpandedKeys] = useState<React.Key[]>([]);
  const [treeSearchValue, setTreeSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const treeDataList: { key: React.Key; title: string }[] = [];
  const generateList = (data: DataNode[]) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key } = node;
      treeDataList.push({ key, title: key as string });
      if (node.children) {
        generateList(node.children);
      }
    }
  };

  generateList(treeData || []);

  const onTreeExpand = (newExpandedKeys: React.Key[]) => {
    setTreeExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  }

  const onTreeSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 树搜索框搜索值
    const { value } = e.target;
    const newExpandedKeys = treeDataList.map((item) => {
      if (typeof item.title !== 'string') return null
      if (item.title.indexOf(value) > -1) {
        return getParentKey(item.key, treeData || []);
      }
      return null;
    })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setTreeExpandedKeys(newExpandedKeys as React.Key[]);
    setTreeSearchValue(value);
    setAutoExpandParent(true);
  };

  return (
    <>
      {useTreeSearch && <Input style={{ marginBottom: 8 }} placeholder="搜索" onChange={onTreeSearchChange} /> }
      <ATree
        blockNode
        showLine
        treeData={treeData}
        onExpand={onTreeExpand}
        expandedKeys={treeExpandedKeys}
        autoExpandParent={autoExpandParent}
        onSelect={(_: any, { node }) => {
          setTreeSelectedNode(node);
          onTreeSelect(node);
        }}
      />
    </>
  )
}