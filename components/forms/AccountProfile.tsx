"use client";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { userValidation } from "@/lib/validations/user";
import * as z from "zod";
import { ChangeEvent, useState } from "react";
import { Textarea } from "../ui/textarea";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { updateUser } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

function AccountProfile({ user, btnTitle }: Props) {
  const [photo, setPhoto] = useState<File[]>([]);
  const { startUpload } = useUploadThing("media");
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(userValidation),
    defaultValues: {
      profile_photo: user?.image || "",
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
    },
  });
  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    field: (value: string) => void,
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setPhoto(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imgDataUrl = event.target?.result?.toString() || "";
        field(imgDataUrl);
      };

      // Start reading the file as a data URL
      fileReader.readAsDataURL(file);
    }
  };
  const onSubmit = async (values: z.infer<typeof userValidation>) => {
    const blob = values.profile_photo;
    const hashImageChanged = isBase64Image(blob);

    if (hashImageChanged) {
      const imgRes = await startUpload(photo);

      if (imgRes && imgRes[0].url) {
        values.profile_photo = imgRes[0].url;
      }
    }
    await updateUser({
      username: values.username,
      name: values.name,
      bio: values.bio,
      image: values.profile_photo,
      userId: user.id,
      path: pathname,
    });
    if (pathname === "/profile/edit") {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-10 space-y-8"
      >
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => {
            return (
              <FormItem className="flex items-center gap-4">
                <FormLabel className="account-form_image-label">
                  {field.value ? (
                    <Image
                      src={`${field.value}`}
                      alt="profile photo"
                      width={96}
                      height={96}
                      priority
                      className="rounded-full object-contain"
                    />
                  ) : (
                    <Image
                      src="/assets/profile.svg"
                      alt="profile photo"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    placeholder="Upload a photo"
                    className="account-form_image-input"
                    onChange={(e) => handleImage(e, field.onChange)}
                  />
                </FormControl>
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col gap-3">
                <FormLabel className="text-base-semibold text-light-2">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    className="account-form_input no-focus"
                    type="text"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Username
              </FormLabel>
              <FormControl>
                <Input
                  className="account-form_input no-focus"
                  type="text"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  className="account-form_input no-focus"
                  rows={10}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500">
          Submit
        </Button>
      </form>
    </Form>
  );
}
export default AccountProfile;
