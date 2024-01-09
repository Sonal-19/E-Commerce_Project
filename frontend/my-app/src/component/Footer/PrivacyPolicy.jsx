import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';

export default function PrivacyPolicy() {
  useEffect(()=>{
    function setPageTitle(pageName){
      document.title= `${pageName}`;
    }
    setPageTitle('PrivacyPolicy');
  })
    const [content, setContent] = useState('');

    useEffect(() => {
      axios.get('http://localhost:3059/users/api/getCustomerPolicy?type=0')
        .then(response => setContent(response.data.content.description||""))
        .catch(error => console.error(error));
    }, []);
  
    const handleSave = () => {
      const token = localStorage.getItem("token");
      axios.post('http://localhost:3059/users/api/addCustomerPolicy', 
      {   type:0, 
        description: content }, {
          headers: {Authorization: `Bearer ${token}`,},
        })
        .then(response => {
          if (response.data.success) {
            console.log('Terms And Conditions updated successfully!');
          } else {
            console.error('Failed to update Terms And Conditions.');
          }
        })
        .catch(error => console.error(error));
    };

  return (
    <>
    <div className='container m-3'>
      <h1 className="text-bold font-monospace text-center mt-4 mb-3">Privacy Policy Editor</h1>
      <CKEditor
        editor={ClassicEditor}
        data={content}
        onChange={(event, editor) => setContent(editor.getData())}
      />
      <div className='text-center m-3'>
      <button onClick={handleSave} className='btn btn-secondary w-20 '>
        Save</button>
      </div>
    </div>
    </>
  );
}
