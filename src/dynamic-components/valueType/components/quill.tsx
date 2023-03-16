
import { ProFieldFCRenderProps } from '@ant-design/pro-components';
import ReactQuill, { ReactQuillProps } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const toolbarOptions = [
	['bold', 'italic', 'underline', 'strike'],
	[{ 'size': ['small', false, 'large', 'huge'] }],
	[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
	[{ 'list': 'ordered' }, { 'list': 'bullet' }],
	['link', 'image'],
	[{ 'align': [] }],
	['clean']
];

export declare type QuillProps = ProFieldFCRenderProps & ReactQuillProps

export const Quill: React.FC<QuillProps> = (props) => {
	const { value, onChange, ...rest } = props;
	return (
		<ReactQuill
			theme="snow"
			value={value}
			onChange={onChange}
			{...rest}
		/>
	)
}

export const QuillRender: React.FC<QuillProps> = (props) => {
	return <Quill {...props} readOnly modules={{ toolbar: [] }} />
}

export const QuillRenderFormItem: React.FC<QuillProps> = (props) => {
	return <Quill  {...props} modules={{ toolbar: toolbarOptions }} />
}