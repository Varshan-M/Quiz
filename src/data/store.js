import { db, storage } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const getQuestions = async (subjectId) => {
  try {
    const docRef = doc(db, 'subjects', subjectId);
    const docSnap = await getDoc(docRef);
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
        const uniqueName = Date.now() + '-' + q.imageFile.name;
        const storageRef = ref(storage, `uploads/${subjectId}/${uniqueName}`);
        await uploadBytes(storageRef, q.imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      finalQuestions.push({
        id: q.id,
        hint: q.hint,
        image: imageUrl
      });
    }

    const docRef = doc(db, 'subjects', subjectId);
    await setDoc(docRef, { questions: finalQuestions });
    
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
