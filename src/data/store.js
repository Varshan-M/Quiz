import { db } from '../firebase';
import { doc, getDocs, setDoc, collection } from 'firebase/firestore';

const withTimeout = (promise, ms, errorMsg) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(errorMsg)), ms))
  ]);
};

export const getQuestions = async (subjectId) => {
  try {
    console.log("Fetching questions from Firestore...");
    const qsRef = collection(db, 'subjects', subjectId, 'questions');
    const qsSnap = await withTimeout(getDocs(qsRef), 15000, "FIRESTORE FETCH TIMED OUT.");
    
    if (!qsSnap.empty) {
      const questions = qsSnap.docs.map(doc => doc.data());
      // Sort by original ID to maintain order
      return questions.sort((a, b) => a.id - b.id);
    }
    return [];
  } catch (err) {
    console.error('Error fetching questions:', err);
    return [];
  }
};

export const saveQuestions = async (subjectId, questionsForm) => {
  try {
    console.log("Saving data directly to Firestore...");
    
    for (let i = 0; i < questionsForm.length; i++) {
      const q = questionsForm[i];
      const docRef = doc(db, 'subjects', subjectId, 'questions', String(q.id));
      
      const safeData = {
        id: q.id,
        hint: q.hint,
        image: q.image // This is now a highly compressed base64 string
      };

      await withTimeout(setDoc(docRef, safeData), 15000, "FIRESTORE IS NOT RESPONDING. DID YOU CLICK 'CREATE DATABASE' IN FIREBASE?");
    }
    
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
