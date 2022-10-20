import { ProDescriptions, ProDescriptionsItemProps } from '@ant-design/pro-components';
import React from 'react';

export interface DescriptionsItem extends ProDescriptionsItemProps {
  value?: React.ReactNode | null | undefined;
}

export const descriptionsItems = (items: DescriptionsItem[] | undefined) => {
  if (!items) return null;
  return (
    <>
      {items.map((item) => {
        const { value, ...rest } = item;
        return <ProDescriptions.Item {...rest}>{value}</ProDescriptions.Item>;
      })}
    </>
  );
};
