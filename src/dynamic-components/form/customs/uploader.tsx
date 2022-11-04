import { PlusOutlined } from '@ant-design/icons';
import { ProFieldFCRenderProps, ProRenderFieldPropsType } from '@ant-design/pro-components';
import { Modal, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useState } from 'react';

function dataURItoBlob(dataURI: string) {
  var byteString = atob(dataURI.split(',')[1]);
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const Uploader: React.FC<ProFieldFCRenderProps> = (props: any) => {
  const { name, listType, maxNumber, buttonText, uploadType, value, onChange } = props;

  const fileList = value?.fileList || [];

  // 图片预览
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

  const handleBeforeUpload: UploadProps['beforeUpload'] = (file: RcFile) => {
    return new Promise((resolve) => {
      let timeStamp = new Date().getTime();
      let fileName = file.name.split('.');
      let newName = fileName[0] + '_' + timeStamp + '.' + fileName[1];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        // 重命名文件名称 + 时间戳
        const blob = dataURItoBlob(reader.result as string);
        const { type } = file;
        const newFile = new File([blob], newName, { type: type });
        resolve(newFile);
      };
    });
  };

  const handleChange: UploadProps['onChange'] = (info) => {
    let newFileList = [...info.fileList];
    onChange({ fileList: newFileList });
  };

  // 按钮
  const button = (
    <div>
      <PlusOutlined />
      <div id={'ant-form-uploader'} style={{ marginTop: 8 }}>
        {buttonText || '上传'}
      </div>
    </div>
  );

  if (!uploadType || uploadType == 'image') {
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
          >
            {typeof maxNumber == 'number' && fileList.length >= maxNumber ? null : button}
          </Upload>
        </ImgCrop>
        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handlePreviewCancel}>
          <img style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }

  return (
    <Upload
      name={name || 'file'}
      listType={listType || 'picture-card'}
      fileList={fileList}
      beforeUpload={handleBeforeUpload}
      onChange={handleChange}
    >
      {typeof maxNumber == 'number' && fileList.length >= maxNumber ? null : button}
    </Upload>
  );
};

export const uploader: ProRenderFieldPropsType = {
  render: (text, props, dom) => {
    return <Uploader {...props} />;
  },
  renderFormItem: (text, props, dom) => {
    return <Uploader {...props} {...props.fieldProps} />;
  },
};
