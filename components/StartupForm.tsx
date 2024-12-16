'use client';

import React, { useActionState, useState } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import MDEditor from '@uiw/react-md-editor';
import { Button } from './ui/button';
import { Send } from 'lucide-react';
import { formschema } from '@/lib/validation';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createPitch } from '@/lib/action';

const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    category: '',
    link: '',
    pitch: '',
  });
  const { toast } = useToast();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handlePitchChange = (value: string | undefined) => {
    setFormValues((prev) => ({ ...prev, pitch: value || '' }));
  };

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      setErrors({}); // Reset error sebelum validasi
      const formDataValues = {
        title: formValues.title,
        description: formValues.description,
        category: formValues.category,
        link: formValues.link,
        pitch: formValues.pitch,
      };

      await formschema.parseAsync(formDataValues);

      // Kirim formValues, formData, dan pitch ke createPitch
      const result = await createPitch(prevState, formData, formValues.pitch);

      if (result.status === 'SUCCESS') {
        toast({
          title: 'Success',
          description: 'Your startup pitch has been created successfully',
        });
        router.push(`/startup/${result._id}`);
      }
      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);
        toast({
          title: 'Error',
          description: 'Please check your inputs and try again',
          variant: 'destructive',
        });
        return { ...prevState, error: 'Validation failed', status: 'ERROR' };
      }

      toast({
        title: 'Error',
        description: 'An unexpected error has occurred. Please try again later.',
        variant: 'destructive',
      });
      return {
        ...prevState,
        error: 'An unexpected error has occurred',
        status: 'ERROR',
      };
    }
  };

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: '',
    status: 'INITIAL',
  });

  return (
    <form action={formAction} className="startup-form">
      <div>
        <label htmlFor="title" className="startup-form_label">Title</label>
        <Input
          id="title"
          name="title"
          className="startup-form_input"
          required
          placeholder="Startup Title"
          value={formValues.title}
          onChange={handleInputChange}
        />
        {errors.title && <p className="startup-form_error">{errors.title}</p>}
      </div>
      <div>
        <label htmlFor="description" className="startup-form_label">Description</label>
        <Textarea
          id="description"
          name="description"
          className="startup-form_textarea"
          required
          placeholder="Startup Description"
          value={formValues.description}
          onChange={handleInputChange}
        />
        {errors.description && <p className="startup-form_error">{errors.description}</p>}
      </div>
      <div>
        <label htmlFor="category" className="startup-form_label">Category</label>
        <Input
          id="category"
          name="category"
          className="startup-form_input"
          required
          placeholder="Startup Category (Tech, Health, Education)"
          value={formValues.category}
          onChange={handleInputChange}
        />
        {errors.category && <p className="startup-form_error">{errors.category}</p>}
      </div>
      <div>
        <label htmlFor="link" className="startup-form_label">Image URL</label>
        <Input
          id="link"
          name="link"
          className="startup-form_input"
          required
          placeholder="Startup Image URL"
          value={formValues.link}
          onChange={handleInputChange}
        />
        {errors.link && <p className="startup-form_error">{errors.link}</p>}
      </div>
      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label">Pitch</label>
        <MDEditor
          value={formValues.pitch}
          onChange={handlePitchChange}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: 'hidden' }}
          textareaProps={{
            placeholder: 'Briefly describe your idea and what problem it solves',
          }}
          previewOptions={{
            disallowedElements: ['style'],
          }}
        />
        {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
      </div>
      <Button type="submit" className="startup-form_btn text-white" disabled={isPending}>
        {isPending ? 'Submitting...' : 'Submit your Pitch'}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default StartupForm;
