import { ProFieldFCRenderProps } from '@ant-design/pro-components';
import { Card, Checkbox, Collapse, Spin, Tabs, TabsProps } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import type { DataNode, TreeProps } from 'antd/es/tree';
import Tree from 'antd/lib/tree';
import { useEffect, useState } from 'react';
const { Panel } = Collapse;
const CheckboxGroup = Checkbox.Group;

import './index.scss';

// 折叠面板
export const collapsePanel = (
  defaultCheckedList: any[],
  node: DataNode,
  index: number,
  onSelect: (list: CheckboxValueType[]) => void
) => {

  let plainOptions = node.children?.map(item => {
    return { label: item.title, value: item.key }
  }) || []

  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>(defaultCheckedList || []);
  const [indeterminate, setIndeterminate] = useState(
    !!defaultCheckedList.length && defaultCheckedList.length < plainOptions.length);
  const [checkAll, setCheckAll] = useState(
    defaultCheckedList.length === plainOptions.length);

  const onChange = (list: CheckboxValueType[]) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
    onSelect && onSelect(list)
  };

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    let list = e.target.checked ? plainOptions?.map(item => item.value) : []
    e.stopPropagation()
    setCheckedList(list);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    onSelect && onSelect(list)
  };

  return (
    <Panel
      header={
        <div onClick={e => e.stopPropagation()}>
          <Checkbox
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}
            key={node.key}
          >
            {node.title}
          </Checkbox>
        </div>
      }
      key={index}>
      <CheckboxGroup
        options={plainOptions}
        value={checkedList}
        onChange={onChange}
      />
    </Panel>
  )
}

export declare type SelectCollapseProps = {
  treeData: DataNode[] | undefined
  defaultCheckedList: any[]
  onChange: (checkedList: any[]) => void
}

export const SelectCollapse = (props: SelectCollapseProps) => {
  const { treeData, defaultCheckedList, onChange } = props

  const onSelect = (list: CheckboxValueType[], keys: CheckboxValueType[], parentKey: CheckboxValueType) => {
    if (list.length == keys.length) {
      list.push(parentKey)
    } else {
      keys.push(parentKey)
    }
    let _over = keys.filter(_ => !list.includes(_)) || []
    let _list = [...new Set(defaultCheckedList.concat(list || []))].filter(_ => !_over.includes(_))
    onChange && onChange(_list)
  }

  return (
    <Collapse accordion>
      {treeData?.map((item, index) => {
        let checkedList = item.children
          ?.filter(_ => defaultCheckedList.includes(_.key))
          .map(_ => _.key) || []
        let keys = item.children?.map(_ => _.key) || []
        return collapsePanel(checkedList, item, index, (list) => onSelect(list, keys, item.key))
      })}
    </Collapse>
  )
}

// 树
export declare type SelectTreeProps = TreeProps & {
  defaultCheckedList: any[]
  onChange: (checkedList: any[]) => void
}

export const SelectTree = (props: SelectTreeProps) => {

  const { defaultCheckedList, onChange } = props
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(defaultCheckedList || []);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue: React.Key[]) => {
    setCheckedKeys(checkedKeysValue);
    onChange && onChange(checkedKeysValue)
  };

  const onSelect = (selectedKeysValue: React.Key[], info: any) => {
    setSelectedKeys(selectedKeysValue);
  };

  return (
    <Tree
      checkable
      onExpand={onExpand}
      expandedKeys={expandedKeys}
      autoExpandParent={autoExpandParent}
      // @ts-ignore
      onCheck={onCheck}
      checkedKeys={checkedKeys}
      onSelect={onSelect}
      selectedKeys={selectedKeys}
      {...props}
    />
  )
}

export declare type NodeProps = {
  tabTitle: string
  valueType: 'tree' | 'collapse',
  dataNode: DataNode[]
}[]


export declare type CheckboxsTabsProps = ProFieldFCRenderProps & TabsProps & {
  initNode?: () => Promise<NodeProps>
};

//
export const CheckboxsTabs: React.FC<CheckboxsTabsProps> = (props) => {

  const [_node, setNode] = useState<NodeProps>([])
  const [loading, setLoading] = useState(true)

  const { initNode, value, onChange, fieldProps, ...rest } = props

  let _value = Array.isArray(value) ? value : _node.map(_ => [])

  useEffect(() => {
    if (!initNode) return
    initNode()
      .then(res => { setNode(res); setLoading(false) })
      .catch(() => { setNode([]); setLoading(false) })
  }, [])

  if (loading) return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <Spin tip='配置加载中....' />
    </div>
  )

  const onSelected = (index: number, checkedList: any[]) => {
    _value[index] = checkedList || []
    onChange && onChange(_value)
  }


  return (
    <Card>
      <Tabs
        tabPosition='left'
        // centered
        defaultActiveKey="1"
        type="card"
        tabBarGutter={4}
        {...rest}
        items={_node.map((item, i) => {
          const id = String(i + 1);
          let defaultCheckedList = _value[i] || []
          return {
            label: item.tabTitle,
            key: id,
            children: (
              <Card title={item.tabTitle} style={{ borderRadius: 6 }}>
                {item.valueType == 'collapse' ?
                  <SelectCollapse
                    treeData={item.dataNode}
                    defaultCheckedList={defaultCheckedList}
                    onChange={(checkedList) => onSelected(i, checkedList)}
                  /> :
                  <SelectTree
                    treeData={item.dataNode}
                    defaultCheckedList={defaultCheckedList}
                    onChange={(checkedList) => onSelected(i, checkedList)}
                  />}
              </Card>
            ),
          };
        })}
      />
    </Card>
  )
}


export const CheckboxsTabsRender: React.FC<CheckboxsTabsProps> = (props) => {
  return <CheckboxsTabs {...props} />
}

export const CheckboxsTabsRenderFormItem: React.FC<CheckboxsTabsProps> = (props) => {
  return <CheckboxsTabs {...props} />
}