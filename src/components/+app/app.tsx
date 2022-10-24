import { useIntl, useMatch } from '@umijs/max';
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
  const match = useMatch('/app/:router/:layout');

  const layout = match?.params['layout'] as LayoutType; // 布局类型
  const config = appManager.get(match?.params['router'] as string, layout); // 注册配置项

  const children = () => {
    if (!config) return null;
    const intl = useIntl(); // 国际化
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

  return <PageContainer>{children()}</PageContainer>;
};
