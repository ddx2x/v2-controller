import { useIntl, useMatch } from '@umijs/max';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import PageContainer from '../container';
import Descriptions from '../descriptions';
import Form, { StepForm } from '../form';
import List from '../list';
import Table from '../table';
import { LayoutType } from '../typing';
import { templateManager } from './manager';

export default observer(() => {
  const match = useMatch('/:route/:layout');

  const route = match?.params['route'] as string;
  const layout = match?.params['layout'] as LayoutType; // 布局类型
  const config = templateManager.layout(route, layout) || null; // 注册配置项

  if (!config) return null;

  const intl = useIntl(); // 国际化组件
  let { pageContainer, ...rest } = config;

  useEffect(() => {
    templateManager.init(route); // 挂载 stores
    return () => templateManager.clear(route); // 清除stores
  });

  const _ = (() => {
    if (layout == 'form' || layout == 'step-form') {
      pageContainer = { ...pageContainer, keepAlive: false };
    }

    switch (layout) {
      case 'table':
        return <Table {...rest} intl={intl} />;
      case 'list':
        return <List {...rest} intl={intl} />;
      case 'form':
        return <Form {...rest} layoutType="Form" intl={intl} />;
      case 'step-form':
        return <StepForm {...rest} modal="Form" intl={intl} />;
      case 'descriptions':
        return <Descriptions modal="Page" {...rest} intl={intl} />;
      default:
        return null;
    }
  })();

  return (
    <PageContainer fixedHeader {...pageContainer}>
      {_}
    </PageContainer>
  );
});
