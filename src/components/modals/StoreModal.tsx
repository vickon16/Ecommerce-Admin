"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useStoreModal } from "@/hooks/useStoreModal";
import { Button } from "@/components/ui/button";
import { FormNameSchema, StoreFormType } from "@/lib/zodValidators";
import { API, errorToast } from "@/lib/utils";

export const StoreModal = () => {
  const storeModal = useStoreModal();

  const [loading, setLoading] = useState(false);

  const form = useForm<StoreFormType>({
    resolver: zodResolver(FormNameSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: StoreFormType) => {
    try {
      setLoading(true);
      const {data} = await API.post("/api/stores", values);
      window.location.assign(`/${data.id}`); // better for full page reload;
      form.reset();
    } catch (error) {
      errorToast(error, "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create store"
      description="Add a new store to manage products and categories."
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div className="space-y-2 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="E-Commerce"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button
                disabled={loading}
                variant="outline"
                onClick={storeModal.onClose}
              >
                Cancel
              </Button>
              <Button disabled={loading} type="submit">
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
