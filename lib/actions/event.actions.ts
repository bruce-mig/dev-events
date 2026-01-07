"use server"

import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";

export const getSimilarEventsBySlug = async (slug: string) => {
   try {
      await connectDB()

      const event = await Event.findOne({ slug })
      const similarEvents = await Event.find({ _id: { $ne: event._id }, tags: { $in: event.tags } }).lean()

      // Serialize MongoDB objects to plain objects for Client Components
      return JSON.parse(JSON.stringify(similarEvents))

   } catch (e) {
      return [];
   }
}
