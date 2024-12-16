'use client';
import React from 'react'
import Form from 'next/form'
import SearchFormReset from '@/components/SearchFormReset'
import { Search } from 'lucide-react'
import { useState, useEffect } from 'react';

const SearchForm = ({ query }: {query?: string}) => {
  const [storeQuery, setStoreQuery] = useState(query);

  useEffect(() => {
    // Perbarui storeQuery saat nilai props query berubah
    setStoreQuery(query || '');
  }, [query]);

  return (
    <Form action="/" scroll={false} className='search-form'>
      <input 
        name='query' 
        value={storeQuery} 
        onChange={e => setStoreQuery(e.target.value)}
        className='search-input' 
        placeholder='Cari Startup'
      />

      <div className='flex gap-2'>
        {query && (<SearchFormReset />)}
        <button type='submit' className='search-btn text-white'>
          <Search className='size-5'/>
        </button>
      </div>
    </Form>
  )
}

export default SearchForm