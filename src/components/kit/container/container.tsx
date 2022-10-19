import { PageContainer, RouteContext } from '@ant-design/pro-components';
import { useLocation } from '@umijs/max';
import { useContext } from 'react';
import { CachingNode } from 'react-activation';
import { KeepAlive, useAliveController } from 'umi';

interface ContainerProps {
  keepAlive?: boolean;
  path?: string | null;
  useBreadcrumb?: boolean; // 开启面包屑
  fixedHeader?: boolean;
  tabList?: { key: string; tab: React.ReactNode }[];
  tabActiveKey?: string;
  onTabChange?: (key: string) => void;
}

export const Container: React.FC<ContainerProps> = (props) => {
  const location = useLocation();
  // 获取 layout 上下文
  let path = props.path ? props.path : location.pathname;
  const context = useContext(RouteContext);

  const container = () => {
    return (
      <PageContainer
        header={{ breadcrumb: props.useBreadcrumb ? context.breadcrumb : undefined }}
        fixedHeader={props.fixedHeader}
        // tab
        tabList={props.tabList}
        tabActiveKey={props.tabActiveKey}
        onTabChange={props.onTabChange}
      >
        {props.children}
      </PageContainer>
    );
  };

  if (!props.keepAlive) return container();
  return (
    // @ts-ignore
    <KeepAlive name={path} cacheKey={path} id={path} saveScrollPosition="screen">
      {container()}
    </KeepAlive>
  );
};

Container.defaultProps = {
  keepAlive: true,
  useBreadcrumb: true,
  fixedHeader: true,
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
