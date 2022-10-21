import { useIntl } from '@umijs/max';
import PageContainer from '../../kit/container';
import PDescriptions from '../../kit/descriptions';

export const Descriptions = (props: {}) => {
  const intl = useIntl();

  return (
    <PageContainer>
      <PDescriptions modal="page" intl={intl} />
    </PageContainer>
  );
};
