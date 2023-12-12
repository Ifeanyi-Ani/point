"use server";
import { revalidatePath } from "next/cache";
import { connectToDB } from "../mongoose";

import User from "../models/user.models";
import Point from "../models/point.model";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createPoint({ text, author, communityId, path }: Params) {
  try {
    connectToDB();
    const newPoint = await Point.create({ text, author });
  } catch (error: any) {
    throw new Error(`Failed create Point ${error.message}`);
  }
}
