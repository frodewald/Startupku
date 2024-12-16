import { auth } from '@/auth'
import StartupUpdateForm from '@/components/StartupUpdateForm';
import { client } from '@/sanity/lib/client';
import { STARTUP_BY_ID_QUERY } from '@/sanity/lib/queries';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async ({ params }: { params: Promise<{ id: string }>}) => {
  const id = (await params).id;
  const session = await auth();

  if(!session) redirect('/');

  const post = await client.fetch(STARTUP_BY_ID_QUERY, {id})

  return (
    <>
      <section className='pink_container !min-h-[230px]'>
        <h1 className='heading'>Submit Your Startup</h1>
      </section>

      <StartupUpdateForm post={post} />
    </>
  )
}

export default page