import { motion } from 'framer-motion';
import type { ComparisonTableData } from './types';

interface ComparisonTableBlockProps {
  data: ComparisonTableData;
}

export function ComparisonTableBlock({ data }: ComparisonTableBlockProps) {
  const { headers, rows } = data;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-card">
            {headers.map((header, i) => (
              <th
                key={header}
                className={`py-3 px-4 text-sm font-medium text-gray-500 ${
                  i === 0 ? 'text-left' : 'text-center'
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <motion.tr
              key={row.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: rowIndex * 0.03 }}
              className={`border-b border-card ${
                row.highlight ? 'bg-white/5' : ''
              }`}
            >
              <td className="py-3 px-4 text-sm font-medium text-white">
                {row.label}
              </td>
              {row.values.map((value, i) => (
                <td
                  key={i}
                  className="py-3 px-4 text-sm text-gray-400 text-center"
                >
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
