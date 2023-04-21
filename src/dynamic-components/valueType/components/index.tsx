
import { valueTypeMapStore } from '../valueTypeMap';
import { AutoCompleteProps, AutoCompleteRender, AutoCompleteRenderFormItem } from './autoComplete';
import { BaiduMapInputProps, BaiduMapInputRender, BaiduMapInputRenderFormItem, BaiduMapProps, BMapRender, BMapRenderFormItem } from './baiduMap';
import { CheckboxsTabsProps, CheckboxsTabsRender, CheckboxsTabsRenderFormItem } from './checkboxsTabs';
import { DescriptionsCardListProps, DescriptionsCardListRender, DescriptionsCardListRenderFormItem, DescriptionsCardProps, DescriptionsCardRender, DescriptionsCardRenderFormItem, FDescriptionsProps, FDescriptionsRender, FDescriptionsRenderFormItem } from './descriptionsCard';
import { EditableTableProps, EditableTableRender, EditableTableRenderFormItem } from './editableTable';
import { ImageUploadProps, ImageUploadRender, ImageUploadRenderFormItem } from './imageUpload';
import {
  MerchandiseListProps, MerchandiseListRender, MerchandiseListRenderFormItem,
  MerchandiseProps, MerchandiseRender, MerchandiseRenderFormItem
} from './merchandise';
import { MonacoEditorProps, MonacoEditorRender, MonacoEditorRenderFormItem } from './monacoEditor';
import { ObjectSelectProps, ObjectSelectRender, ObjectSelectRenderFormItem } from './objectSelect';
import { QuillProps, QuillRender, QuillRenderFormItem } from './quill';
import { StepsFormItem, StepsProps, StepsRender } from './steps';
import { TagProps, TagRender, TagRenderFormItem } from './tag';
import { TransferProps, TransferRender, TransferRenderFormItem } from './transfer';
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
    descriptions: FDescriptionsProps;
    descriptionsCard: DescriptionsCardProps;
    descriptionsCardList: DescriptionsCardListProps;
    editableTable: EditableTableProps;
    autoComplete: AutoCompleteProps;
    checkboxsTabs: CheckboxsTabsProps;
    transfer: TransferProps;
    objectSelect: ObjectSelectProps
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
  descriptions: [FDescriptionsRender, FDescriptionsRenderFormItem],
  descriptionsCard: [DescriptionsCardRender, DescriptionsCardRenderFormItem],
  descriptionsCardList: [DescriptionsCardListRender, DescriptionsCardListRenderFormItem],
  editableTable: [EditableTableRender, EditableTableRenderFormItem],
  autoComplete: [AutoCompleteRender, AutoCompleteRenderFormItem],
  checkboxsTabs: [CheckboxsTabsRender, CheckboxsTabsRenderFormItem],
  transfer: [TransferRender, TransferRenderFormItem],
  objectSelect: [ObjectSelectRender, ObjectSelectRenderFormItem]
};

valueTypeMapStore.registerValueType(valueTypeMap);
