import { UploadProps } from 'antd';
import { RcFile } from 'antd/lib/upload';

export function dataURItoBlob(dataURI: string) {
  var byteString = atob(dataURI.split(',')[1]);
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

export const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const handleBeforeUpload: UploadProps['beforeUpload'] = (file: RcFile) => {
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
