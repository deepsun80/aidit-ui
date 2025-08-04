'use client';

export default function BatchRecordLoader() {
  return (
    <div className='space-y-3'>
      {[...Array(8)].map((_, idx) => (
        <div
          key={idx}
          className='animate-pulse bg-gray-200 h-5 rounded w-full'
        />
      ))}
    </div>
  );
}
