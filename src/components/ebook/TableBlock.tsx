interface TableData {
  headers: string[];
  rows: string[][];
}

interface TableBlockProps {
  data: TableData;
}

export const TableBlock = ({ data }: TableBlockProps) => {
  return (
    <div className="my-8 overflow-x-auto">
      <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
        <thead>
          <tr className="bg-primary text-primary-foreground">
            {data.headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-4 text-left text-sm font-semibold"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-border hover:bg-secondary/50 smooth-transition"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-6 py-4 text-sm text-foreground"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
