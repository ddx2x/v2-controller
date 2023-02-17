import { ProFieldFCRenderProps } from '@ant-design/pro-components';
import { Input, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { AutoComplete, Map, MapApiLoaderHOC, ZoomControl } from 'react-bmapgl/dist';

const AK = 'AGebOLVNCIHGqMAWHyMNl4HVjhdFSvfn';

export function mapGeocoder(map: any, address: string, handle?: () => void) {
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
        handle && handle();
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

export const BaiduMapCompoent: React.FC<BaiduMapProps> = (props) => {
  const mapRef = useRef<any>(null);
  const [inputValue, setInputValue] = useState('');

  const { useSearchInput, height, width, value, onChange } = props;

  useEffect(() => {
    value && mapGeocoder(mapRef.current.map, value)
  }, [value, mapRef?.current?.map])

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
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="请搜索并选择地址"
            style={{ position: 'absolute', top: '15px', left: '10px', width: '50%', zIndex: 50 }}
          />
          <AutoComplete
            input={'locatoinSearch'}
            onConfirm={(e: any) => {
              const c = e?.item.value;
              const l = [c.province, c.city, c.district, c.business, c.street, c.streetNumber].join('');
              mapGeocoder(mapRef.current.map, l, () => {
                setInputValue(l);
                onChange && onChange(l);
              });
            }}
          />
        </>
      )
      }
      <ZoomControl map={mapRef?.current?.map} />
    </Map>
  );
};

export declare type BaiduMapInputProps = ProFieldFCRenderProps 

export const BaiduMapInputCompoent: React.FC<BaiduMapInputProps> = (props) => { 
  const { value, onChange } = props;

  // console.log('value', value);
  

  return (
    <>
      <Input
        id="locatoinSearch"
        autoFocus
        value={value}
        onChange={(e) => onChange && onChange(e.target.value) }
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
}

export const BMap = MapApiLoaderHOC({ ak: AK })(BaiduMapCompoent);
export const BaiduMapInput = MapApiLoaderHOC({ ak: AK })(BaiduMapInputCompoent);


export const BMapRenderFormItem: React.FC<BaiduMapProps> = (props) => {
  return <BMap  {...props} />
}

export const BMapRender: React.FC<BaiduMapProps> = (props) => {
  return <BMap {...props} />
}

export const BaiduMapInputRenderFormItem: React.FC<BaiduMapInputProps> = (props) => {
  return <BaiduMapInput  {...props} />
}
export const BaiduMapInputRender: React.FC<BaiduMapInputProps> = (props) => {
  return <BaiduMapInput {...props} />
}