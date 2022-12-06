import { ProCard, ProCardProps } from '@ant-design/pro-components';

export const useCard = (props: ProCardProps): [React.ReactNode, {}] => {
  return [<ProCard {...props} />, {}];
};
