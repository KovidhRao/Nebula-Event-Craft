// src/lib/firebaseStorageService.ts

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// 🟢 CORRECTED: Go up one level (..) to find firebase.ts in the src folder
import { storage } from '../firebase'; 

/**
 * Uploads a File object to Firebase Storage, gets its public URL, and returns it.
 * @returns The public download URL of the uploaded file.
 */
export async function uploadFileToFirebase(file: File, eventId: string): Promise<string> {
    
    // Create a unique path in storage (e.g., 'events/event_ID/filename.jpg')
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `events/${eventId}/${uniqueFileName}`);

    try {
        // 1. Upload the file data
        const snapshot = await uploadBytes(storageRef, file);

        // 2. Get the publicly accessible URL
        const downloadUrl = await getDownloadURL(snapshot.ref);
        
        return downloadUrl;
    } catch (error) {
        console.error("Firebase Storage Upload Error:", error);
        throw new Error("Failed to upload image to Firebase Storage.");
    }
}