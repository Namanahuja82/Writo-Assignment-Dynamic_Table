import DynamicTable from './components/DynamicTable';
import { Column, Row } from './types';

const initialColumns: Column[] = [
  { name: 'Name', type: 'string' },
  { name: 'Age', type: 'number' },
  { name: 'Hobbies', type: 'string' },
];

const initialData: Row[] = [
  { Name: 'Alice', Age: 30, Hobbies: ['Reading', 'Painting'] },
  { Name: 'Bob', Age: 25, Hobbies: ['Sports', 'Music'] },
  { Name: 'Charlie', Age: 35, Hobbies: ['Cooking', 'Traveling'] },
];

export default function Home() {
  return (
    <main className="min-h-screen p-6 md:p-24">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Dynamic Table</h1>
      <DynamicTable initialColumns={initialColumns} initialData={initialData} />
    </main>
  );
}