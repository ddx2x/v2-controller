import { valueTypeMapStore } from '../valueTypeMap';
import { BaiduMapInputProps, BaiduMapInputRender, BaiduMapInputRenderFormItem, BaiduMapProps, BMapRender, BMapRenderFormItem } from './baiduMap';
import { DescriptionsCardProps, DescriptionsCardRender, DescriptionsCardRenderFormItem, DescriptionsCardListProps, DescriptionsCardListRender, DescriptionsCardListRenderFormItem } from './descriptionsCard';
import { EditableTableProps, EditableTableRender, EditableTableRenderFormItem } from './editableTable';
import { ImageUploadProps, ImageUploadRender, ImageUploadRenderFormItem } from './imageUpload';
import {
  MerchandiseListProps, MerchandiseListRender, MerchandiseListRenderFormItem,
  MerchandiseProps, MerchandiseRender, MerchandiseRenderFormItem
} from './merchandise';
import { MonacoEditorProps, MonacoEditorRender, MonacoEditorRenderFormItem } from './monacoEditor';
import { QuillProps, QuillRender, QuillRenderFormItem } from './quill';
import { StepsFormItem, StepsProps, StepsRender } from './steps';
import { TagProps, TagRender, TagRenderFormItem } from './tag';
import { VideoUploadProps, VideoUploadRender, VideoUploadRenderFormItem } from './videoUpload';

declare module '@ant-design/pro-utils' {
  interface ProFieldValueTypeWithFieldProps {
    tag: TagProps;
    map: BaiduMapProps;
    mapInput: BaiduMapInputProps;
    imageUpload: ImageUploadProps;
    videoUpload: VideoUploadProps;
    monacoEditor: MonacoEditorProps;
    merchandise: MerchandiseProps;
    merchandiseList: MerchandiseListProps
    quill: QuillProps;
    steps: StepsProps;
    descriptionsCard: DescriptionsCardProps;
    descriptionsCardList: DescriptionsCardListProps;
    editableTable: EditableTableProps;
  }
}

// 注册两种主件 第一项为只读渲染 Render  第二项为编辑渲染组件RenderFormItem
const valueTypeMap = {
  tag: [TagRender, TagRenderFormItem],
  map: [BMapRender, BMapRenderFormItem],
  mapInput: [BaiduMapInputRender, BaiduMapInputRenderFormItem],
  imageUpload: [ImageUploadRender, ImageUploadRenderFormItem],
  videoUpload: [VideoUploadRender, VideoUploadRenderFormItem],
  monacoEditor: [MonacoEditorRender, MonacoEditorRenderFormItem],
  quill: [QuillRender, QuillRenderFormItem],
  merchandise: [MerchandiseRender, MerchandiseRenderFormItem],
  merchandiseList: [MerchandiseListRender, MerchandiseListRenderFormItem],
  steps: [StepsRender, StepsFormItem],
  descriptionsCard: [DescriptionsCardRender, DescriptionsCardRenderFormItem],
  descriptionsCardList: [DescriptionsCardListRender, DescriptionsCardListRenderFormItem],
  editableTable: [EditableTableRender, EditableTableRenderFormItem]
};

valueTypeMapStore.registerValueType(valueTypeMap);
