import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/database/event.model"
import ImageKit from "imagekit";

// Initialize ImageKit instance for server-side uploads
const imagekit = new ImageKit({
   publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
   privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
   urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT as string,
});


export async function POST(req: NextRequest) {
   try {
      await connectDB()

      const formData = await req.formData();

      let event;

      try {
         event = Object.fromEntries(formData.entries());
      } catch (e) {
         return NextResponse.json({ message: 'Invalid JSON data format' }, { status: 400 })
      }

      const file = formData.get('image') as unknown as File;

      if (!file) {
         return NextResponse.json({ message: 'Image file is required' }, { status: 400 })
      }

      let tags = JSON.parse(formData.get('tags') as string)
      let agenda = JSON.parse(formData.get('agenda') as string)

      // Convert file to buffer for ImageKit upload
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to ImageKit using server-side SDK
      try {
         const uploadResponse = await imagekit.upload({
            file: buffer,
            fileName: file.name,
            folder: '/events',
         });

         if (!uploadResponse.url) {
            return NextResponse.json({ message: 'Image upload failed - no URL returned' }, { status: 500 });
         }

         event.image = uploadResponse.url;

         console.log("Upload response:", uploadResponse);

      } catch (error: any) {
         console.error("Upload error:", error);
         const errorMessage = error?.message || error?.help || JSON.stringify(error);
         return NextResponse.json({ message: 'Image upload failed', error: errorMessage }, { status: 500 });
      }

      const createdEvent = await Event.create({
         ...event,
         tags: tags,
         agenda: agenda
      })

      return NextResponse.json({ message: 'Event Created Successfully', event: createdEvent }, { status: 201 })

   } catch (e) {
      console.error(e)
      return NextResponse.json({ message: 'Event Creation Failed', error: e instanceof Error ? e.message : 'Unknown' }, { status: 500 })
   }

}

export async function GET() {
   try {
      await connectDB()
      const events = await Event.find().sort({ createdAt: -1 })  // Sort by createdAt in descending order
      return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 })

   } catch (r) {
      return NextResponse.json({ message: 'Failed to fetch events', error: r instanceof Error ? r.message : 'Unknown' }, { status: 500 })
   }
}
