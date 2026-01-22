import React, { useEffect, useState } from 'react';
import API from '../api/api';

export default function Profile(){
  const [user, setUser] = useState(null);
  useEffect(()=> {
    (async ()=> {
      const res = await API.get('/auth/me');
      setUser(res.data);
    })()
  },[]);
  return (
    <div>
      <h2>Profile</h2>
      {user && <div>
        <div>Name: {user.name}</div>
        <div>Email: {user.email}</div>
      </div>}
    </div>
  );
}
