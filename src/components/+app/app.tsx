import { useIntl, useMatch } from '@umijs/max';
import { useEffect } from 'react';
import {
  Descriptions,
  DescriptionsLayout,
  List,
  ListLayout,
  PageContainer,
  Table,
  TableLayout,
} from '../kit';
import { appManager, LayoutType } from './manager';

export default () => {
  const match = useMatch('/app/:route/:layout');
  const route = match?.params['route'] as string;

  useEffect(() => {
    appManager.initStores(route); // 挂载 stores
    return () => appManager.clearStores(route); // 清除stores
  });

  const children = () => {
    const layout = match?.params['layout'] as LayoutType; // 布局类型
    const config = appManager.getLayout(route, layout); // 注册配置项
    if (!config) return null;

    const intl = useIntl(); // 国际化组件

    switch (layout) {
      case 'table':
        return <Table {...(config as TableLayout)} intl={intl} />;
      case 'list':
        return <List {...(config as ListLayout)} intl={intl} />;
      case 'descriptions':
        return <Descriptions modal="page" intl={intl} {...(config as DescriptionsLayout)} />;
      default:
        return null;
    }
  };

  return <PageContainer fixedHeader>{children()}</PageContainer>;
};
