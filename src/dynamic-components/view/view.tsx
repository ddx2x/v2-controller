import { useIntl, useMatch } from '@umijs/max';
import { useEffect } from 'react';
import PageContainer from '../container';
import Descriptions, { DescriptionsProps } from '../descriptions';
import Form, { FormProps, StepForm, StepFormProps } from '../form';
import List, { ListProps } from '../list';
import Table, { TableProps } from '../table';

import { LayoutType, templateManager } from './manager';

export default () => {
  const match = useMatch('/:route/:layout');

  const route = match?.params['route'] as string;
  const layout = match?.params['layout'] as LayoutType; // 布局类型
  const config = templateManager.getLayout(route, layout) || null; // 注册配置项

  if (!config) return null;

  const intl = useIntl(); // 国际化组件
  let { pageContainer, ...rest } = config;

  useEffect(() => {
    templateManager.initStores(route); // 挂载 stores
    return () => templateManager.clearStores(route); // 清除stores
  });

  if (layout == 'form' || layout == 'step-form') {
    pageContainer = { ...pageContainer, keepAlive: false };
  }

  const _ = (() => {
    switch (layout) {
      case 'table':
        return <Table {...(rest as TableProps)} intl={intl} />;
      case 'list':
        return <List {...(rest as ListProps)} intl={intl} />;
      case 'form':
        return <Form {...(rest as FormProps)} modal="Form" intl={intl} />;
      case 'step-form':
        return <StepForm {...(rest as StepFormProps)} modal="Form" intl={intl} />;
      case 'descriptions':
        return <Descriptions modal="page" {...(rest as DescriptionsProps)} intl={intl} />;
      default:
        return null;
    }
  })();

  return (
    <PageContainer fixedHeader {...pageContainer}>
      {_}
    </PageContainer>
  );
};
