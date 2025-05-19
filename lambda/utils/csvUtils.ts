export function jsonToCsv (data: Record<string, any>[]): Buffer {
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => Object.values(row).join(',')).join('\n');
  const csv = `${headers}\n${rows}`;

  // Convert the CSV string to a Buffer
  const csvBuffer = Buffer.from(csv, 'utf-8');
  return csvBuffer;
}