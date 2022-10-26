import { useIntl, useMatch } from '@umijs/max';
import { useEffect } from 'react';
import {
  Descriptions,
  DescriptionsLayout,
  Form,
  FormConfig,
  List,
  ListLayout,
  PageContainer,
  StepForm,
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
    const args = appManager.getLayout(route, layout) || null; // 注册配置项

    if (!args) return null;

    const intl = useIntl(); // 国际化组件

    switch (layout) {
      case 'table':
        return <Table {...(args as TableLayout)} intl={intl} />;
      case 'list':
        return <List {...(args as ListLayout)} intl={intl} />;
      case 'form':
        return <Form {...(args as FormConfig)} modal="Form" intl={intl} />;
      case 'step-form':
        return <StepForm {...(args as FormConfig)} modal="Form" intl={intl} />;
      case 'descriptions':
        return <Descriptions modal="page" intl={intl} {...(args as DescriptionsLayout)} />;
      default:
        return null;
    }
  };

  return <PageContainer fixedHeader>{children()}</PageContainer>;
};
