import { Settings as LayoutSettings } from '@ant-design/pro-components';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  colorPrimary: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'v2xx',
  pwa: true,
  logo: '/giraffe-svgrepo-com.svg',
  iconfontUrl: '',
};

export default Settings;

// {
//   "navTheme": "light",
//   "colorPrimary": "#1677FF",
//   "layout": "mix",
//   "contentWidth": "Fluid",
//   "fixedHeader": true,
//   "fixSiderbar": true,
//   "pwa": false,
//   "logo": "https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg",
//   "siderMenuType": "sub",
//   "splitMenus": false
// }
