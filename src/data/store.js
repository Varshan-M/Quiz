import localforage from 'localforage';

localforage.config({
  name: 'UndergroundQuiz',
  storeName: 'quiz_data'
});

export const getQuestions = async (subjectId) => {
  try {
    const data = await localforage.getItem(`questions_${subjectId}`);
    return data || [];
  } catch (err) {
    console.error('Error fetching questions:', err);
    return [];
  }
};

export const saveQuestions = async (subjectId, questions) => {
  try {
    await localforage.setItem(`questions_${subjectId}`, questions);
  } catch (err) {
    console.error('Error saving questions:', err);
  }
};

export const clearQuestions = async (subjectId) => {
  try {
    await localforage.removeItem(`questions_${subjectId}`);
  } catch (err) {
    console.error('Error clearing questions:', err);
  }
};
