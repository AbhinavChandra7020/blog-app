// app/_components/RichTextEditor.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div className="bg-dark_green border border-fern_green rounded-md p-4 min-h-[200px] flex items-center justify-center">
    <span className="text-moss_green">Loading editor...</span>
  </div>
})

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder = "Write your post content..." }: RichTextEditorProps) {
  const quillRef = useRef<any>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      ['clean']
    ],
  }

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background',
    'align', 'direction',
    'script', 'code-block'
  ]

  // Don't render anything until component is mounted on client
  if (!isMounted) {
    return (
      <div className="bg-dark_green border border-fern_green rounded-md p-4 min-h-[200px] flex items-center justify-center">
        <span className="text-moss_green">Loading editor...</span>
      </div>
    )
  }

  return (
    <div className="rich-text-editor">
      <style jsx global>{`
        .ql-toolbar {
          background: #31572c !important;
          border: 1px solid #4f772d !important;
          border-bottom: none !important;
          border-radius: 0.375rem 0.375rem 0 0 !important;
        }
        
        .ql-container {
          background: #132a13 !important;
          border: 1px solid #4f772d !important;
          border-top: none !important;
          border-radius: 0 0 0.375rem 0.375rem !important;
          color: #ecf39e !important;
        }
        
        .ql-editor {
          color: #ecf39e !important;
          min-height: 200px;
        }
        
        .ql-editor.ql-blank::before {
          color: #90a955 !important;
          font-style: italic;
        }
        
        .ql-toolbar .ql-stroke {
          stroke: #ecf39e !important;
        }
        
        .ql-toolbar .ql-fill {
          fill: #ecf39e !important;
        }
        
        .ql-toolbar button:hover,
        .ql-toolbar button:focus {
          background: #4f772d !important;
        }
        
        .ql-toolbar button.ql-active {
          background: #4f772d !important;
        }
        
        .ql-picker-label {
          color: #ecf39e !important;
        }
        
        .ql-picker-options {
          background: #31572c !important;
          border: 1px solid #4f772d !important;
        }
        
        .ql-picker-item:hover {
          background: #4f772d !important;
          color: #ecf39e !important;
        }
      `}</style>
      
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  )
}