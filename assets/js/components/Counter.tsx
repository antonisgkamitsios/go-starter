import { useState } from 'react';

export default function Counter({ name }: { name: string }) {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount((old) => old + 1);
  };

  return (
    <div className="border border-blue-500 bg-blue-50 p-4">
      <p>This is a react rendered component</p>
      <p>Hello: {name}</p>
      <p>the count is: {count}</p>
      <button className="border border-red-300 p-1" onClick={handleClick}>Increment</button>
    </div>
  );
}
