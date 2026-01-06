import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/database/event.model"
import {
   ImageKitAbortError,
   ImageKitInvalidRequestError,
   ImageKitServerError,
   ImageKitUploadNetworkError,
   upload,
} from "@imagekit/next";


// Create an AbortController instance to provide an option to cancel the upload if needed.
const abortController = new AbortController();

/**
 * Authenticates and retrieves the necessary upload credentials from the server.
 *
 * This function calls the authentication API endpoint to receive upload parameters like signature,
 * expire time, token, and publicKey.
 *
 * @returns {Promise<{signature: string, expire: string, token: string, publicKey: string}>} The authentication parameters.
 * @throws {Error} Throws an error if the authentication request fails.
 */
const authenticator = async (req: NextRequest): Promise<{ signature: string; expire: number; token: string; publicKey: string; }> => {
   try {
      // Build absolute URL for the authentication endpoint
      const baseUrl = new URL(req.url).origin;
      const response = await fetch(`${baseUrl}/api/upload-auth`);
      if (!response.ok) {
         // If the server response is not successful, extract the error text for debugging.
         const errorText = await response.text();
         throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }

      // Parse and destructure the response JSON for upload credentials.
      const data = await response.json();
      const { signature, expire, token, publicKey } = data;
      return { signature, expire, token, publicKey };
   } catch (error) {
      // Log the original error for debugging before rethrowing a new error.
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
   }
};



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

      const file = formData.get('image') as File;

      if (!file) {
         return NextResponse.json({ message: 'Image file is required' }, { status: 400 })
      }

      // const arrayBuffer = await file.arrayBuffer();
      // const buffer = Buffer.from(arrayBuffer);

      // Retrieve authentication parameters for the upload.
      let authParams;
      try {
         authParams = await authenticator(req);
      } catch (authError) {
         console.error("Failed to authenticate for upload:", authError);
         return NextResponse.json({ message: 'Failed to authenticate for image upload' }, { status: 500 });
      }
      const { signature, expire, token, publicKey } = authParams;

      // Call the ImageKit SDK upload function with the required parameters and callbacks.
      try {
         const uploadResponse = await upload({
            // Authentication parameters
            expire,
            token,
            signature,
            publicKey,
            file,
            fileName: file.name, // Optionally set a custom file name
            // Abort signal to allow cancellation of the upload if needed.
            abortSignal: abortController.signal,
         });

         if (!uploadResponse.url) {
            return NextResponse.json({ message: 'Image upload failed - no URL returned' }, { status: 500 });
         }

         event.image = uploadResponse.url;

         console.log("Upload response:", uploadResponse);

      } catch (error) {
         // Handle specific error types provided by the ImageKit SDK.
         if (error instanceof ImageKitAbortError) {
            console.error("Upload aborted:", error.reason);
         } else if (error instanceof ImageKitInvalidRequestError) {
            console.error("Invalid request:", error.message);
         } else if (error instanceof ImageKitUploadNetworkError) {
            console.error("Network error:", error.message);
         } else if (error instanceof ImageKitServerError) {
            console.error("Server error:", error.message);
         } else {
            // Handle any other errors that may occur.
            console.error("Upload error:", error);
         }
      }

      const createdEvent = await Event.create(event)

      return NextResponse.json({ message: 'Event Created Successfully', event: createdEvent }, { status: 201 })

   } catch (e) {
      console.error(e)
      return NextResponse.json({ message: 'Event Creation Failed', error: e instanceof Error ? e.message : 'Unknown' }, { status: 500 })
   }

}
