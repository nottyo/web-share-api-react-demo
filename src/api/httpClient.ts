import axios from "axios";

export const getFileBlob = async (url: string) => {
  try {
    const { data } = await axios.get(url, {
      responseType: 'blob',
    });
    return data;
  } catch (error) {
    console.error(`unable to getFileBlob: ${error.message}`);
    throw error;
  }
};
