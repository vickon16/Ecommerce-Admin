import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";
import * as z from "zod";
import toast from "react-hot-toast";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const API = axios.create({
  baseURL: process.env.NEXTAUTH_URL,
});

export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});


export const errorToast = (error: unknown, message: string) => {
  if (error instanceof z.ZodError) {
    return toast.error(`${message}. ${error.message}`);
  }
  if (error instanceof AxiosError) {
    return toast.error(`${message}. ${error.response?.data || error.message}`);
  }
  if (error instanceof Error) {
    return toast.error(`${error.message}`);
  }
  return toast.error(message);
};

export const errorResponse = (
  name : string,
  error: unknown,
  status: number
) => {
  console.log(name, error);

  if (error instanceof z.ZodError) {
    return new NextResponse(`${error.message}`, { status });
  }
  
  if (error instanceof AxiosError) {
    return new NextResponse(
      `${error.response?.data || error.message}`,
      { status }
    );
  }
  if (error instanceof Error) {
    return new NextResponse(`${error.message}`, { status });
  }

  return new NextResponse(`Internal Server Error`, { status: 500 });
};
