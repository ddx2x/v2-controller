
import { ProFieldFCRenderProps } from '@ant-design/pro-components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

var toolbarOptions = [['bold', 'italic', 'underline', 'strike'	], ['link', 'image']];

export declare type QuillProps = ProFieldFCRenderProps & {
	theme?: string
}

export const Quill: React.FC<QuillProps> = (props) => {
	const { theme, value, onChange } = props;
	return (
		<>	
		<ReactQuill 
			theme= "snow" 
			value = { value } 
			onChange = { onChange } 
			modules = {{ toolbar : toolbarOptions}} />
		</>
  )
}	

export const QuillRender: React.FC<QuillProps> = (props) => {
	return <Quill { ...props } />
}

export const QuillRenderFormItem: React.FC<QuillProps> = (props) => {
	return <Quill { ...props } />
}