'use client';

type BatchAnalyticsSingleChartProps = {
  product: string;
  batchNumber: string;
};

export default function BatchAnalyticsSingleChart({
  product,
  batchNumber,
}: BatchAnalyticsSingleChartProps) {
  return (
    <div className='text-xs text-gray-800 space-y-4'>
      {/* Header Info - 2 column grid */}
      <h2 className='text-sm font-bold text-gray-500'>Key Statistics</h2>

      <div className='grid grid-cols-2 gap-y-1 gap-x-4 text-sm'>
        <div>
          <span className='font-semibold'>Part Number:</span> {product}
        </div>
        <div>
          <span className='font-semibold'>Batch Number:</span> {batchNumber}
        </div>
        <div>
          <span className='font-semibold'>Quantity Ordered:</span> 100
        </div>
        <div>
          <span className='font-semibold'>Quantity Manufactured:</span> 80
        </div>
        <div>
          <span className='font-semibold'>Mfg Date:</span> Jul 24, 2025
        </div>
      </div>

      {/* Table */}
      <div>
        <div className='text-sm font-semibold mb-2 text-orange-500'>
          Non-Conformance Summary
        </div>
        <table className='w-full text-left border border-gray-300'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='border border-gray-300 px-2 py-1'>Page</th>
              <th className='border border-gray-300 px-2 py-1'>Section</th>
              <th className='border border-gray-300 px-2 py-1'>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='border border-gray-300 px-2 py-1'>7, 8, 9</td>
              <td className='border border-gray-300 px-2 py-1'>4.2</td>
              <td className='border border-gray-300 px-2 py-1'>PO Mismatch</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
