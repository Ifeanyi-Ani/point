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
    await User.findByIdAndUpdate(author, {
      $push: { points: newPoint._id },
    });
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed create Point ${error.message}`);
  }
}
export async function fetchPoints(pageNumber = 1, pageSize = 20) {
  try {
    connectToDB();
    const skipAmount = (pageNumber - 1) * pageSize;

    const pointQuery = Point.find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "author", model: "User" });

    const totalPointCount = await Point.countDocuments({
      parentId: { $in: [null, undefined] },
    });
    const points = await pointQuery.exec();
    const isNext = totalPointCount > skipAmount + points.length;
  } catch (error: any) {
    throw new Error(`Error fetching Points ${error.message}`);
  }
}
