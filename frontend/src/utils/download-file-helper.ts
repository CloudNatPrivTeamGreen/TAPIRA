export function downloadFile(
  blob: Blob,
  filename: string = 'downloaded-specs'
) {
  const blobUrl = URL.createObjectURL(blob);

  // Set link's href to point to the Blob URL
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);

  // Dispatch click event on the link
  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  );

  URL.revokeObjectURL(blobUrl);

  document.body.removeChild(link);
}
