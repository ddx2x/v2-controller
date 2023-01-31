import { Table } from '@/dynamic-components/table';
import { Form, FormProps } from '../form';
import { valueTypeMapStore } from '../valueTypeMap';
import { bMap } from './baiduMap';
import { cardField, CardFieldProps } from './card';
import { imageUploadField, ImageUploadFieldProps } from './imageUpload';
import { monacoEditorField, MonacoEditorFieldProps } from './monacoEditor';
import { tagField } from './tag';
import { videoUploadField, VideoUploadFieldProps } from './videoUpload';

declare module '@ant-design/pro-utils' {
  interface ProFieldValueTypeWithFieldProps {
    card: CardFieldProps;
    imageUpload: ImageUploadFieldProps;
    videoUpload: VideoUploadFieldProps;
    monacoEditor: MonacoEditorFieldProps;
    form: FormProps;
    map: any;
    tag: any;
  }
}

// 注册两种主件 第一项为只读 第二项为编辑组件
const valueTypeMap = {
  card: [cardField, cardField],
  imageUpload: [imageUploadField, imageUploadField],
  videoUpload: [videoUploadField, videoUploadField],
  monacoEditor: [monacoEditorField, monacoEditorField],
  table: [Table, Table],
  form: [Form, Form],
  map: [bMap, bMap],
  tag: [tagField, tagField]
};

valueTypeMapStore.registerValueType(valueTypeMap);
