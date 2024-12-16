"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";
import slugify from 'slugify';
import { writeClient } from "@/sanity/lib/write-client";
import { client } from "@/sanity/lib/client"; 

export const createPitch = async (state: any, form: FormData, pitch: string) => {
  const session = await auth();

  if(!session) return parseServerActionResponse({ 
    error: "Not signed in", 
    status: "ERROR"
  });

  const {title, description, category, link } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== 'pitch' )
  )

  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    const startup = {
      title,
      description,
      category,
      image: link,
      slug: {
        _type: slug,
        current: slug,
      },
      author: {
        _type: 'reference',
        _ref: session?.id
      },
      pitch,
    };

    const result = await writeClient.create({_type: "startup", ...startup});

    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    })

  } catch(error) {
    console.log(error);

    return parseServerActionResponse({ 
      error: JSON.stringify(error),
      status: "ERROR"
    })
  }
}

export const updatePitch = async (id: string, state: any, form: FormData, pitch: string) => {
  const session = await auth();

  if(!session) return parseServerActionResponse({ 
    error: "Not signed in", 
    status: "ERROR"
  });

  const {title, description, category, link } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== 'pitch' )
  )

  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    const updateStartup = {
      title,
      description,
      category,
      image: link,
      slug: {
        _type: slug,
        current: slug,
      },
      pitch,
    };

    const result = await writeClient
      .patch(id)
      .set(updateStartup)
      .commit()

    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    })

  } catch(error) {
    console.log(error);

    return parseServerActionResponse({ 
      error: JSON.stringify(error),
      status: "ERROR"
    })
  }
}

export const deletePitch = async (id: string) => {
  try {
    const getSelectPlaylist = await client.fetch(`
      *[_type == "playlist" && references("${id}")][0] {
        _id,
        title,
        slug,
        select
      }
    `)
  
    if(getSelectPlaylist) {
      await writeClient.patch('fb8561fc-a207-4b08-82a8-13a49d67bda4')
        .unset([`select[_ref == "${id}"]`])
        .commit();
    }

    await writeClient.patch(id)
      .unset(['author'])
      .commit();

    await writeClient.delete(id);

    return parseServerActionResponse({
      error: "",
      status: "SUCCESS",
    })
  } catch (error) {
    return parseServerActionResponse({ 
      error: JSON.stringify(error),
      status: "ERROR"
    })
  }
}