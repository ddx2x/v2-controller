import { RightOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import { useSet } from '../utils/hook';
import './index.less';

const { TabPane } = Tabs;

export const Settings = () => {

  const [state, setState] = useSet({
    tabsKey: 'globalSettings',
    showRight: true,
    showItemSettings: false,
  });
  const { tabsKey, showRight, showItemSettings } = state;
  const toggleRight = () => setState({ showRight: !showRight });

  const ToggleIcon = () => (
    <div
      className="absolute top-0 left-0 pointer"
      style={{ height: 30, width: 30, padding: '8px 0 0 8px' }}
      onClick={toggleRight}
    >
      <RightOutlined style={{ color: '#666' }} />
    </div>
  );

  const HideRightArrow = () => (
    <div
      className="absolute right-0 top-0 h2 flex-center"
      style={{ width: 40, transform: 'rotate(180deg)' }}
    >
      <ToggleIcon />
    </div>
  );

  return showRight ? (
    <div className="right-layout relative pl2">
      <ToggleIcon />
    </div>) :
    <HideRightArrow />
}