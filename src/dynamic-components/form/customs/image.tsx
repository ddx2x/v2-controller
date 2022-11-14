import { PlusOutlined } from '@ant-design/icons';
import { ProFieldFCRenderProps, ProRenderFieldPropsType } from '@ant-design/pro-components';
import { Modal, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useState } from 'react';
import { getBase64, handleBeforeUpload } from './$';

export interface ImageUploadProps extends ProFieldFCRenderProps {
  fieldProps: UploadProps & {
    buttonText?: string;
    maxNumber?: number | null;
  };
}

const ImageUpload: React.FC<ImageUploadProps> = (props: any) => {
  const { fieldProps } = props;
  const { buttonText, name, listType, maxNumber, value, onChange, ...uploadProps } = fieldProps;

  const fileList = value?.fileList || [];

  // 图片预览
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const handlePreviewCancel = () => setPreviewOpen(false);

  const onImagePreview = async (file: UploadFile) => {
    if (file.originFileObj) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage((file.preview as string) || file.url || '');
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/')));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = (info) => {
    let fileList = info.fileList;
    fileList
      .filter((item) => item.uid == info.file.uid)
      .map((item) => (item.url = '/media/file/' + item.name));
    onChange({ fileList: fileList });
  };

  // 按钮
  const button = (
    <div>
      <PlusOutlined />
      <div id={'ant-form-uploader'} style={{ marginTop: 8 }}>
        {buttonText || '上传图片'}
      </div>
    </div>
  );

  return (
    <>
      <ImgCrop rotate>
        <Upload
          name={name || 'file'}
          listType={listType || 'picture-card'}
          fileList={fileList}
          beforeUpload={handleBeforeUpload}
          onPreview={onImagePreview}
          onChange={handleChange}
          {...uploadProps}
        >
          {typeof maxNumber == 'number' && fileList.length >= maxNumber ? null : button}
        </Upload>
      </ImgCrop>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handlePreviewCancel}>
        <img style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export const imageUpload: ProRenderFieldPropsType = {
  render: (text, props, dom) => {
    return <ImageUpload {...props} {...props.fieldProps} />;
  },
  renderFormItem: (text, props, dom) => {
    return <ImageUpload {...props} {...props.fieldProps} />;
  },
};
