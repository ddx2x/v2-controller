import { useIntl, useLocation } from '@umijs/max';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { isCachingNode, PageContainer } from '../dynamic-components/container';
import type { DescriptionsProps } from '../dynamic-components/descriptions';
import { Descriptions } from '../dynamic-components/descriptions';
import type { FormProps, StepFormProps } from '../dynamic-components/form';
import { Form, StepForm } from '../dynamic-components/form';
import type { ListProps } from '../dynamic-components/list';
import { List } from '../dynamic-components/list';
import type { TableProps } from '../dynamic-components/table';
import { Table } from '../dynamic-components/table';
import { eventEmitter } from './event';
import { pageManager } from './manager';
import { View } from './typing';

const trRouterKey = (path: string) => {
  return path.split('/')
    .filter((item) => item)
    .join('.');
}

export default observer(() => {

  eventEmitter.on('pageManagerClear', (path: string) => {
    pageManager.clear(trRouterKey(path));
  })

  const location = useLocation()
  const routeKey = trRouterKey(location.pathname)

  const schema = pageManager.page(routeKey); // 注册配置项
  if (!schema) return null;

  const intl = useIntl(); // 国际化组件
  const isCaching = isCachingNode(location.pathname)

  useEffect(() => {
    !isCaching && pageManager.init(routeKey); // 挂载 stores
    // return () => { isCaching && pageManager.clear(routeKey); } // 清除stores
  }, []);

  const page = (() => {
    return (
      <>
        {schema?.view && schema.view.map((config: View, index) => {
          const { kind, ...props } = config;
          props['location'] = location
          props['key'] = index

          switch (kind) {
            case 'table':
              return <Table {...props as TableProps} intl={intl} />;
            case 'list':
              return <List  {...props as ListProps} intl={intl} />;
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
