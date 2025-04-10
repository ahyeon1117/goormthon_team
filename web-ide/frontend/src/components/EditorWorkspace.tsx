import { useState } from 'react'
import { EditorCell } from '../components/EditorCell';
import { Cell } from '../types/cell';
import { nanoid } from 'nanoid';

function EditorWorkspace () {
  const [cells, setCells] = useState<Cell[]>([]);

  const handleChange = (id: string, content: string) => {
    setCells(prev =>
      prev.map(cell => cell.id === id ? {...cell, content} : cell,)
    )
  }

  const addCell = (index: number, type: 'code' | 'markdown') => {
    const newCell: Cell ={
      id: nanoid(),
      type,
      content: '',
    };
    const newCells = [...cells];
    newCells.splice(index + 1, 0, newCell);
    setCells(newCells);
  }

  return (
  <div className='p-4 space-y-4'>
    {cells.map((cell, i) => (
      <div key={cell.id}>
        <EditorCell cell={cell} onChange={handleChange} />
        <div className='flex gap-2 mt-2'>
          <button onClick={() => addCell(i, 'code')}> + Code </button>
          <button onClick={() => addCell(i, 'markdown')}> + Markdown </button>
        </div>
      </div>
    ))}

    {cells.length === 0 && (
      <button onClick={() => addCell(-1, 'code')}>+ New Code Cell</button>
    )}
    </div>
  )
}

export default EditorWorkspace
