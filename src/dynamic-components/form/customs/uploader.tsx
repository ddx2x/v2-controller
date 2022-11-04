import { PlusOutlined } from '@ant-design/icons';
import { ProFieldFCRenderProps, ProRenderFieldPropsType } from '@ant-design/pro-components';
import { Modal, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import { useState } from 'react';

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const Uploader: React.FC<ProFieldFCRenderProps> = (props) => {
  const { fieldProps } = props;

  const fileList = fieldProps.value?.fileList || [];
  const max = fieldProps?.max || null;

  // 预览
  const uploadType = fieldProps?.uploadType || 'image';

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const handlePreviewCancel = () => setPreviewOpen(false);

  const onImagePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/')));
    setPreviewOpen(true);
  };

  // 按钮
  const button = (
    <div>
      <PlusOutlined />
      <div id={'ant-form-uploader'} style={{ marginTop: 8 }}>
        Upload
      </div>
    </div>
  );

  if (uploadType == 'image') {
    return (
      <>
        <ImgCrop rotate>
          <Upload
            name="file"
            listType="picture-card"
            fileList={fileList}
            onPreview={onImagePreview}
            {...fieldProps}
          >
            {typeof max == 'number' && fileList.length >= max ? null : button}
          </Upload>
        </ImgCrop>
        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handlePreviewCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }

  return (
    <Upload name="file" listType="picture-card" fileList={fileList} {...fieldProps}>
      {typeof max == 'number' && fileList.length >= max ? null : button}
    </Upload>
  );
};

Uploader.defaultProps = {
  fieldProps: {
    uploadType: 'image',
  },
};

export const uploader: ProRenderFieldPropsType = {
  render: (text, props, dom) => {
    return <Uploader {...props} />;
  },
  renderFormItem: (text, props, dom) => {
    return <Uploader {...props} />;
  },
};
