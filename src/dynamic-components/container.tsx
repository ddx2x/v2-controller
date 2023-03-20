import {
  PageContainer as ProPageContainer, PageContainerProps as ProPageContainerProps,
  ProCard, RouteContext, RouteContextType
} from '@ant-design/pro-components';
import { KeepAlive as UmiKeepAlive, useAliveController, useLocation } from '@umijs/max';
import type { BreadcrumbProps } from 'antd';
import classNames from 'classnames';
import { Children, useContext, useState } from 'react';
import type { CachingNode } from 'react-activation';
import './container.scss';


export declare type KeepAliveProps = {
  path?: string | null;
};

export const KeepAlive: React.FC<KeepAliveProps> = (props) => {
  const path = props.path ? props.path : useLocation().pathname;
  return (
    // @ts-ignore
    <UmiKeepAlive name={path} cacheKey={path} id={path} saveScrollPosition="screen">
      {props.children}
    </UmiKeepAlive>
  );
};

// 获取所有 keep alive 缓存节点
export const cachingNodes = (): CachingNode[] => {
  const { getCachingNodes } = useAliveController();
  return getCachingNodes();
};

// 节点是否缓存
export const isCachingNode = (path: string | undefined): boolean => {
  const nodes = cachingNodes();
  return nodes.filter((node) => node.name == path).length > 0;
};

export declare type ContainerProps = ProPageContainerProps & {

  defaultTabActiveKey?: string
  useBreadcrumb?: boolean;
  context?: RouteContextType | null;
};

export const Container: React.FC<ContainerProps> = (props) => {
  const { useBreadcrumb, context, breadcrumb, header, ...rest } = props;

  const [tabActiveKey, setTabActiveKey] = useState(props.defaultTabActiveKey)

  const headerBreadcrumb = (): BreadcrumbProps | undefined => {
    // 面包屑🍞
    // 开启 useBreadcrumb 后如果不传值, 可根据 layout context 动态获取到自动根据路由计算的面包屑
    if (!useBreadcrumb) return undefined;
    if (!context) {
      console.warn(
        'Did not get the context of pro layout. / 没有获取到 layout context : ',
        context,
      );
      return undefined;
    }
    if (breadcrumb) return breadcrumb;
    // 面包屑第一项为当前页
    (context.breadcrumb?.routes || []).
      map((item, index) => {
        if (index == 0) { item.path = '#' }
        return item
      })

    return context.breadcrumb;
  };

  let children = props.children?.props.children as any

  const content = () => {
    if (Children.count(children) <= 1) return children
    if (rest['tabList']) {
      let _index = rest['tabList'].findIndex(item => item.key === tabActiveKey) || 0
      return children.map((item, index) =>
        <ProCard ghost
          className={classNames({ 'hidden_children': _index === index })}>
          {item}
        </ProCard>)
    }
    return (
      <ProCard direction="column" ghost gutter={[0, 16]}>
        {children.map(item => <ProCard ghost>{item}</ProCard>)}
      </ProCard>)
  }

  return (
    <ProPageContainer
      className='page-container'
      header={{ breadcrumb: headerBreadcrumb(), ...header }}
      affixProps={{ offsetTop: 56 }}
      tabActiveKey={tabActiveKey}
      onTabChange={(k) => setTabActiveKey(k)}
      {...rest}
    >
      {content()}
    </ProPageContainer>
  );
};

Container.defaultProps = {
  useBreadcrumb: true,
  context: null,
  fixedHeader: true,
};

export declare type PageContainerProps = KeepAliveProps &
  ContainerProps & {
    keepAlive?: boolean;
  };

export const PageContainer: React.FC<PageContainerProps> = (props) => {
  const { keepAlive, path, children, ...rest } = props;

  const container = () => {
    // 获取 layout 上下文
    const context = useContext(RouteContext);
    return (
      <Container context={context} {...rest}>
        {children}
      </Container>
    );
  };

  if (!keepAlive) return container();
  return <KeepAlive path={path}>{container()}</KeepAlive>;
};

PageContainer.defaultProps = {
  keepAlive: true,
};
