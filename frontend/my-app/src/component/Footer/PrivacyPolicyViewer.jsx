import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PrivacyPolicyViewer() {
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

  return (
    <>
    <div className='container mt-3'>
      <h1 className="text-bold font-monospace text-center mt-4 mb-3">Privacy Policy</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
    </>
  );
}
