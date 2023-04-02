export const exportLocalStorageToJson = (fileName) => {
  const data = JSON.parse(localStorage.getItem('state'));

  const jsonData = JSON.stringify(data);

  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
