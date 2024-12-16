'use client';

import { Trash } from 'lucide-react';
import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { deletePitch } from '@/lib/action';
import { redirect } from 'next/navigation';

const DeleteStartup = ({ id }: { id: string }) => {
  const MySwal = withReactContent(Swal);

  const handleDelete = async () => {
    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const response = await deletePitch(id); // Panggil fungsi deletePitch
        if (response.status === 'SUCCESS') {
          await MySwal.fire({
            title: 'Deleted!',
            text: 'Your startup has been deleted.',
            icon: 'success',
          });

          // Redirect setelah sukses
          redirect('/');
        } else {
          throw new Error(response.error || 'Something went wrong');
        }
      } catch (error) {
        console.error(error);
        await MySwal.fire({
          title: 'Error!',
          text: 'Failed to delete the startup. Please try again later.',
          icon: 'error',
        });
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-400 rounded-2xl text-white p-2 text-center flex items-center"
    >
      <Trash />
      <p className="text-action ml-1">Delete</p>
    </button>
  );
};

export default DeleteStartup;
