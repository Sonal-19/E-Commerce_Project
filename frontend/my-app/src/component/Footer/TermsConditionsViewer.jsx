import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TermsConditionsViewer() {
  useEffect(()=>{
    function setPageTitle(pageName){
      document.title= `${pageName}`;
    }
    setPageTitle('T&C');
  })
    const [content, setContent] = useState('');

    useEffect(() => {
      axios.get('http://localhost:3059/users/api/getCustomerPolicy?type=1')
        .then(response => setContent(response.data.content.description||""))
        .catch(error => console.error(error));
    }, []);

  return (
    <>
    <div className='container mt-3'>
      <h1 className="text-bold font-monospace text-center mt-4 mb-3">Terms And Conditions</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
    </>
  );
}
