import { useIntl, useLocation } from '@umijs/max';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { randomKey } from '../#';
import { PageContainer } from '../container';
import type { DescriptionsProps } from '../descriptions';
import { Descriptions } from '../descriptions';
import type { FormProps, StepFormProps } from '../form';
import { Form, StepForm } from '../form';
import type { ListProps } from '../list';
import { List } from '../list';
import type { TableProps } from '../table';
import { Table } from '../table';
import type { View } from './manager';
import { pageManager } from './manager';

export default observer(() => {

  const routeKey = useLocation()
    .pathname.split('/')
    .filter((item) => item)
    .join('.');

  const schema = pageManager.page(routeKey); // 注册配置项
  if (!schema) return null;

  const intl = useIntl(); // 国际化组件

  useEffect(() => {
    pageManager.init(routeKey); // 挂载 stores
    return () => pageManager.clear(routeKey); // 清除stores
  });

  const page = (() => {
    return (
      <>
        {schema?.view && schema.view.map((config: View) => {
          const { kind, ...props } = config;
          props['key'] = randomKey(8, { numbers: false })

          switch (kind) {
            case 'table':
              return <Table {...props as TableProps} intl={intl} />;
            case 'list':
              return <List {...props as ListProps} intl={intl} />;
            case 'form':
              return <Form {...props as FormProps} intl={intl} />;
            case 'stepForm':
              return <StepForm {...props as StepFormProps} modal="Form" intl={intl} />;
            case 'descriptions':
              return <Descriptions modal="Page" {...props as DescriptionsProps} intl={intl} />;
          }
          
        })}
      </>
    );
  })();

  return <PageContainer {...schema.container}>{page}</PageContainer>;
});
