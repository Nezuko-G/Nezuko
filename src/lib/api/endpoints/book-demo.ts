"use client";

import { postRequest } from '@/lib/axios/dist/requests';
import { apis } from '../config';
import { BookDemoPayload } from '@/app/book-demo/types/book-demo.types';

export async function bookDemo(payload: BookDemoPayload) {
  return postRequest({
    api: apis.book_demo,
    body: payload,
  });
}
