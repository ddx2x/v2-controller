import { ActionType } from '@ant-design/pro-components';
import React from 'react';
import { DescriptionsProps, useDescriptions } from '../descriptions';
import { FormProps } from '../form';

// 更多按钮
export declare type RowOperator =
  | ({ kind: 'descriptions' } & DescriptionsProps) // 详情页
  | ({ kind: 'form' } & FormProps) // 表单
  | ({ kind: 'custom' } & {
      implement: (
        event: React.MouseEvent,
        record: any,
        actionRef?: React.MutableRefObject<ActionType | undefined>,
      ) => void;
    }); // 自定义

export const onRowOperate = (func: () => RowOperator): void => {
  const config = func();
  switch (config.kind) {
    case 'descriptions':
      const [description] = useDescriptions({ ...config });
      description;
    case 'form':
    // const [form] = useForm({ ...config })
    // form
    case 'custom':
    default:
      null;
  }
};
