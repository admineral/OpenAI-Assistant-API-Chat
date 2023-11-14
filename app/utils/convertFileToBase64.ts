// utils.ts
export const convertFileToBase64 = (file: any) => new Promise((resolve, reject) => {
    console.log('converting image to Base64');
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    console.log('image CONVERTED');
  });