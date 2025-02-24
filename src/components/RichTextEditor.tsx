import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Editortype {
  setpdf: React.Dispatch<React.SetStateAction<string>>;
  pdf: string
}

export function Editor({ setpdf, pdf }:Editortype) {
  
  return <ReactQuill theme="snow" value={pdf} onChange={setpdf} />;
}