"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
const PostPoint = ({ userId: string }) => {
  return <div>PostPoint</div>;
};

export default PostPoint;
