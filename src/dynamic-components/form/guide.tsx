import { Affix, Card, Steps } from 'antd';
import { useState } from 'react';
import Draggable from 'react-draggable';
import './guide.scss';

const top = 160;
const left = 20;

export const Guide = (props: any) => {
  const [data, setData] = useState(props.columns || []);

  const content = () => {
    return (
      data && (
        <Card className="guide-card" style={{ left: left }}>
          <div className="drag"> <div className="before" /></div>
          <div style={{ height: 400, width: 110, overflow: 'auto' }}>
            <Steps
              size="small"
              progressDot
              direction="vertical"
              current={data.length}
              onChange={(value) => props.onSelected && props.onSelected(data[value])}
              items={data}
            />
          </div>
        </Card>
      )
    );
  };

  return (
    <Affix style={{ position: 'absolute', top: top, left: left }}>
      {/* @ts-ignore */}
      <Draggable handle=".drag">{content()}</Draggable>
    </Affix>
  );
};
