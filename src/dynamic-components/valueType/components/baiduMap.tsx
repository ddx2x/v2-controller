import { ProFieldFCRenderProps } from '@ant-design/pro-components';
import { Input, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { AutoComplete, Map, MapApiLoaderHOC, ZoomControl } from 'react-bmapgl/dist';
import _ from 'lodash'

const AK = 'AGebOLVNCIHGqMAWHyMNl4HVjhdFSvfn';

export function mapGeocoder(
  map: any,
  address: string,
  handle: (point: any) => void,
) {
  let myGeo = new BMapGL.Geocoder();
  const markLayerList = new Array();
  // 将地址解析结果显示在地图上，并调整地图视野
  myGeo.getPoint(
    address,
    function (point) {
      if (point) {
        map.clearOverlays();
        map.centerAndZoom(point, 16);
        markLayerList.forEach((item) => {
          map.removeOverlay(item);
        });
        let marker = new BMapGL.Marker(point, { title: address, enableClicking: true });
        marker.addEventListener('click', () => {
          map.removeOverlay(marker);
          markLayerList.splice(markLayerList.indexOf(marker), 1);
        });
        marker.setLabel(new BMapGL.Label(address));
        map.addOverlay(marker);
        markLayerList.push(marker);
        handle && handle(point);
      } else {
        message.info('您选择的地址没有解析到结果！');
      }
    },
    '',
  );
}

export declare type BaiduMapProps = ProFieldFCRenderProps & {
  useSearchInput?: boolean;
  height?: number | string;
  width?: number | string;
};

export const BaiduMapComponent: React.FC<BaiduMapProps> = (props) => {
  const mapRef = useRef<any>(null);
  const [inputValue, setInputValue] = useState({address: '', point: {}});

  const { useSearchInput, height, width, value, onChange } = props;

  useEffect(() => {
    value && 
    mapGeocoder(mapRef.current.map, value.address, (point) => { 
      if (_.isEqual(point, value.point)) return
      let _value = {address: value.address, point: point}
      onChange && onChange(_value);
    });
  }, [value, mapRef?.current?.map]);

  return (
    <Map
      ref={mapRef}
      style={{ height: height || 280, width: width || '100%', borderStyle: 'groove' }}
      center={new BMapGL.Point(116.404449, 39.914889)}
      zoom={10}
    >
      {useSearchInput && (
        <>
          <Input
            size="small"
            id="locatoinSearch"
            value={inputValue.address || ''}
            onChange={(e) => setInputValue({address: e.target.value, point: []})}
            placeholder="请搜索并选择地址"
            style={{ position: 'absolute', top: '15px', left: '10px', width: '50%', zIndex: 50 }}
          />
          <AutoComplete
            input={'locatoinSearch'}
            onConfirm={(e: any) => {
              const c = e?.item.value;
              const l = [c.province, c.city, c.district, c.business, c.street, c.streetNumber].join(
                '',
              );
              mapGeocoder(mapRef.current.map, l, (point) => {
                let value = {address: l, point: point }
                setInputValue(value)
                onChange && onChange(value);
              });
            }}
          />
        </>
      )}
      <ZoomControl map={mapRef?.current?.map} />
    </Map>
  );
};

export declare type BaiduMapInputProps = ProFieldFCRenderProps;

export const BaiduMapInputComponent: React.FC<BaiduMapInputProps> = (props) => {
  const { value, onChange } = props;

  // console.log('value', value);

  return (
    <>
      <Input
        id="locatoinSearch"
        autoFocus
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder="请搜索并选择地址"
      />
      <AutoComplete
        input={'locatoinSearch'}
        onConfirm={(e: any) => {
          const c = e?.item.value;
          console.log(c);

          const l = [c.province, c.city, c.district, c.business, c.street, c.streetNumber].join('');
        }}
      />
    </>
  );
};

export const BMap = MapApiLoaderHOC({ ak: AK })(BaiduMapComponent);
export const BaiduMapInput = MapApiLoaderHOC({ ak: AK })(BaiduMapInputComponent);

export const BMapRenderFormItem: React.FC<BaiduMapProps> = (props) => {
  return <BMap {...props} />;
};

export const BMapRender: React.FC<BaiduMapProps> = (props) => {
  return <BMap {...props} />;
};

export const BaiduMapInputRenderFormItem: React.FC<BaiduMapInputProps> = (props) => {
  return <BaiduMapInput {...props} />;
};
export const BaiduMapInputRender: React.FC<BaiduMapInputProps> = (props) => {
  return <BaiduMapInput {...props} />;
};
