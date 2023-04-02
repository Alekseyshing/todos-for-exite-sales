export const importFromJsonFile = (file) => {
  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      localStorage.setItem('state', JSON.stringify(data));
      console.log('Data imported successfully');
    } catch (error) {
      console.error('Error parsing JSON data');
    }
  };

  reader.readAsText(file);
}