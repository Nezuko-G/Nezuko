'use client'

import { useState } from 'react'

interface Item {
  id: number
  name: string
}

export function ExpensiveComponent() {
  const [count, setCount] = useState(0)
  const [items] = useState<Item[]>([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
  ])

  // React Compiler should auto-memoize this
  const computedValue = items.map(item => ({
    ...item,
    display: `${item.name} - ${count}`,
  }))

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      {computedValue.map(item => (
        <p key={item.id}>{item.display}</p>
      ))}
    </div>
  )
}