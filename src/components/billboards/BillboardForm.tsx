"use client";

import { FC, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { Billboard } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/AlertModal";
import { API, errorToast } from "@/lib/utils";
import { BillboardFormSchema, BillboardFormType } from "@/lib/zodValidators";
import ImageUpload from "@/components/ui/image-upload";

interface BillboardFormProps {
  billboardData: Billboard | null;
}

const BillboardForm: FC<BillboardFormProps> = ({ billboardData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = billboardData ? "Edit billboard" : "Create billboard";
  const description = billboardData
    ? "Edit a billboard."
    : "Add a new billboard";
  const toastMessage = billboardData
    ? "Billboard updated."
    : "Billboard created.";
  const action = billboardData ? "Save changes" : "Create";

  const form = useForm<BillboardFormType>({
    resolver: zodResolver(BillboardFormSchema),
    defaultValues: {
      label: billboardData?.label || "",
      imageData: {
        imageUrl: billboardData?.imageUrl || "",
        imagePublicId: billboardData?.imagePublicId || "",
      },
    },
  });

  const onSubmit = async (data: BillboardFormType) => {
    try {
      setLoading(true);
      if (billboardData) {
        await API.patch(
          `/api/stores/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
      } else {
        await API.post(`/api/stores/${params.storeId}/billboards`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success(toastMessage);
    } catch (error: any) {
      errorToast(error, "Something went wrong!.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await API.delete(
        `/api/stores/${params.storeId}/billboards/${params.billboardId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success("Billboard deleted.");
    } catch (error: any) {
      errorToast(
        error,
        "Make sure you removed all categories using this billboard first."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {billboardData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full"
        >
          <FormField
            control={form.control}
            name="imageData"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Background image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ? [field.value] :[]}
                      disabled={loading}
                      onChange={(value) => field.onChange(value)}
                      onRemove={() =>
                        field.onChange({
                          imageUrl: "",
                          imagePublicId: "",
                        })
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Billboard label"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default BillboardForm;
