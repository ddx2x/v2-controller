/* eslint-disable react-hooks/exhaustive-deps */
import type { RouteContextType } from '@ant-design/pro-layout';
import { useStyle } from '@ant-design/pro-layout/lib/components/FooterToolbar/style';
import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import omit from 'omit.js';
import type { ReactNode } from 'react';
import React, { useContext, useEffect, useMemo } from 'react';

export type FooterToolbarProps = {
  extra?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  renderContent?: (
    props: FooterToolbarProps & RouteContextType & { leftWidth?: string },
    dom: JSX.Element,
  ) => ReactNode;
  prefixCls?: string;
  children?: React.ReactNode;
  routeContext: RouteContextType;
  right?: boolean
};

export const FooterToolbar: React.FC<FooterToolbarProps> = (props) => {
  const { children, className, extra, style, renderContent, routeContext, right, ...restProps } = props;
  const { getPrefixCls, getTargetContainer } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = props.prefixCls || getPrefixCls('pro');
  const baseClassName = `${prefixCls}-footer-bar`;
  const { wrapSSR, hashId } = useStyle(baseClassName);

  const width = useMemo(() => {
    const { hasSiderMenu, isMobile, siderWidth } = routeContext;
    if (!hasSiderMenu) {
      return undefined;
    }
    // 0 or undefined
    if (!siderWidth) {
      return '100%';
    }
    return isMobile ? '100%' : `calc(100% - ${siderWidth}px)`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeContext.collapsed, routeContext.hasSiderMenu, routeContext.isMobile, routeContext.siderWidth]);

  const dom = (
    <>
      <div className={`${baseClassName}-left ${hashId}`}>{extra}</div> 
      <div className={`${baseClassName}-right ${hashId}`}>{children}</div>
    </>
  );

  /** 告诉 props 是否存在 footerBar */
  useEffect(() => {
    if (!routeContext || !routeContext?.setHasFooterToolbar) {
      return () => { };
    }
    routeContext?.setHasFooterToolbar(true);
    return () => {
      routeContext?.setHasFooterToolbar?.(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderDom = (
    <div
      className={classNames(className, hashId, baseClassName)}
      style={{ width, ...style }}
      {...omit(restProps, ['prefixCls'])}
    >
      {renderContent
        ? renderContent(
          {
            ...props,
            ...routeContext,
            leftWidth: width,
          },
          dom,
        )
        : dom}
    </div>
  );

  return renderDom

};


