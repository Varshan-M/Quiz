const API_URL = 'http://localhost:3001/api/questions';

export const getQuestions = async (subjectId) => {
  try {
    const res = await fetch(`${API_URL}/${subjectId}`);
    const data = await res.json();
    return data || [];
  } catch (err) {
    console.error('Error fetching questions:', err);
    return [];
  }
};

export const saveQuestions = async (subjectId, formData) => {
  try {
    const res = await fetch(`${API_URL}/${subjectId}`, {
      method: 'POST',
      body: formData
    });
    const result = await res.json();
    return result.success;
  } catch (err) {
    console.error('Error saving questions:', err);
    return false;
  }
};

export const clearQuestions = async (subjectId) => {
  try {
    await localforage.removeItem(`questions_${subjectId}`);
  } catch (err) {
    console.error('Error clearing questions:', err);
  }
};
