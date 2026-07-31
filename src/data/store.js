import { db, storage } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const withTimeout = (promise, ms, errorMsg) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(errorMsg)), ms))
  ]);
};

export const getQuestions = async (subjectId) => {
  try {
    const docRef = doc(db, 'subjects', subjectId);
    console.log("Fetching questions from Firestore...");
    const docSnap = await withTimeout(getDoc(docRef), 15000, "FIRESTORE FETCH TIMED OUT.");
    if (docSnap.exists()) {
      return docSnap.data().questions || [];
    }
    return [];
  } catch (err) {
    console.error('Error fetching questions:', err);
    return [];
  }
};

export const saveQuestions = async (subjectId, questionsForm) => {
  try {
    const finalQuestions = [];

    for (let i = 0; i < questionsForm.length; i++) {
      const q = questionsForm[i];
      let imageUrl = q.image; // Keep existing image if not changed

      if (q.imageFile) {
        console.log(`Uploading image ${i+1}... Size: ${(q.imageFile.size / 1024).toFixed(2)} KB`);
        const uniqueName = Date.now() + '-' + q.imageFile.name;
        const storageRef = ref(storage, `uploads/${subjectId}/${uniqueName}`);
        await withTimeout(uploadBytes(storageRef, q.imageFile), 60000, "STORAGE UPLOAD TIMED OUT AFTER 60 SECONDS. IS YOUR INTERNET SLOW?");
        console.log(`Upload complete. Getting URL...`);
        imageUrl = await getDownloadURL(storageRef);
      }

      finalQuestions.push({
        id: q.id,
        hint: q.hint,
        image: imageUrl
      });
    }

    console.log("Saving data to Firestore...");
    const docRef = doc(db, 'subjects', subjectId);
    await withTimeout(setDoc(docRef, { questions: finalQuestions }), 30000, "FIRESTORE IS NOT RESPONDING. DID YOU CLICK 'CREATE DATABASE' IN FIREBASE?");
    
    return true;
  } catch (err) {
    console.error('Error saving questions to Firebase:', err);
    return err.message || false;
  }
};

export const clearQuestions = async (subjectId) => {
  try {
    await localforage.removeItem(`questions_${subjectId}`);
  } catch (err) {
    console.error('Error clearing questions:', err);
  }
};
