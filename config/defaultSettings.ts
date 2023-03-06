import { Settings as LayoutSettings } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  title: '汇有科技',
  navTheme: 'light',
  colorPrimary: '#FA541C',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  pwa: true,
  logo: '/2C5D4E47-6205-4f3a-9517-1D8751F727FD.png',
  splitMenus: false,
  siderMenuType: 'group',
  footerRender: false,
  menuHeaderRender: false,
};

export default Settings;
