import { useIntl } from '@umijs/max';
import { Container } from '../../kit/container';
import PDescriptions from '../../kit/descriptions';

export const Descriptions = (props: {}) => {
  const intl = useIntl();

  return (
    <Container>
      <PDescriptions modal="page" intl={intl} />
    </Container>
  );
};
