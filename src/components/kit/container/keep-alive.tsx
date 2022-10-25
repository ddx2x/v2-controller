import { KeepAlive as UmiKeepAlive, useAliveController, useLocation } from '@umijs/max';
import { CachingNode } from 'react-activation';

export interface KeepAliveProps {
  path?: string | null;
}

export const KeepAlive: React.FC<KeepAliveProps> = (props) => {
  let path = props.path ? props.path : useLocation().pathname;

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
