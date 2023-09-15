"use client";

import { CldUploadWidget } from "next-cloudinary";
import { FC } from "react";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ImagePlus, Trash } from "lucide-react";
import ClientOnly from "../ClientOnly";
import cloudinary from "@/lib/cloudinary";
import { API } from "@/lib/utils";

type imageData = { imageUrl: string; imagePublicId: string };

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: imageData) => void;
  onRemove: (value: imageData) => void;
  value: imageData[];
}

const ImageUpload: FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const onUpload = (result: any) => {
    const { secure_url, public_id } = result.info;
    onChange({ imageUrl: secure_url, imagePublicId: public_id });
  };

  const onRemoveImage = async (data : imageData) => {
    onRemove(data)
    await API.get(`/api/delete-image?imagePublicId=${data.imagePublicId}`);
  }

  return (
    <ClientOnly>
      <div className="mb-4 flex items-center gap-4">
        {value.map(
          (data) =>
            data.imageUrl && (
              <div
                key={data.imagePublicId}
                className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
              >
                <div className="z-10 absolute top-2 right-2">
                  <Button
                    type="button"
                    onClick={() => onRemoveImage(data)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                <Image
                  fill
                  className="object-cover"
                  alt="Image"
                  src={data.imageUrl}
                />
              </div>
            )
        )}
      </div>

      <CldUploadWidget onUpload={onUpload} uploadPreset="xx3ycoef">
        {({ open }) => {
          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={() => open()}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </ClientOnly>
  );
};

export default ImageUpload;
