import { useState, useCallback } from 'react'

const PRIORITIES = ['Haute', 'Moyenne', 'Basse']

function App() {
  const [tasks,    setTasks]    = useState([])
  const [name,     setName]     = useState('')
  const [priority, setPriority] = useState('Moyenne')
  const [editId,   setEditId]   = useState(null)
  const [editName, setEditName] = useState('')
  const [editPrio, setEditPrio] = useState('')
  const [metrics,  setMetrics]  = useState({})

  // Mesure de performance
  const measure = (label, fn) => {
    const start = performance.now()
    fn()
    const end = performance.now()
    setMetrics(m => ({ ...m, [label]: (end - start).toFixed(3) + ' ms' }))
  }

  const addTask = useCallback(() => {
    if (!name.trim()) return
    measure('Ajout', () => {
      setTasks(t => [...t, { id: Date.now(), name, priority, done: false }])
    })
    setName('')
  }, [name, priority])

  const deleteTask = useCallback((id) => {
    measure('Suppression', () => setTasks(t => t.filter(t => t.id !== id)))
  }, [])

  const startEdit = (task) => {
    setEditId(task.id)
    setEditName(task.name)
    setEditPrio(task.priority)
  }

  const saveEdit = useCallback(() => {
    measure('Modification', () => {
      setTasks(t => t.map(t => t.id === editId
        ? { ...t, name: editName, priority: editPrio }
        : t
      ))
    })
    setEditId(null)
  }, [editId, editName, editPrio])

  const toggleDone = (id) => {
    setTasks(t => t.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  // Benchmark : générer N tâches
  const generateTasks = (n) => {
    const start = performance.now()
    const newTasks = Array.from({ length: n }, (_, i) => ({
      id: Date.now() + i,
      name: `Tâche ${i + 1}`,
      priority: PRIORITIES[i % 3],
      done: false
    }))
    setTasks(newTasks)
    const end = performance.now()
    setMetrics(m => ({ ...m, [`Rendu ${n} tâches`]: (end - start).toFixed(3) + ' ms' }))
  }

  const updateFifty = () => {
    const start = performance.now()
    setTasks(t => t.map((task, i) =>
      i < 50 ? { ...task, name: `Mise à jour ${i + 1}`, priority: 'Haute' } : task
    ))
    const end = performance.now()
    setMetrics(m => ({ ...m, 'Mise à jour 50': (end - start).toFixed(3) + ' ms' }))
  }

  const deleteFifty = () => {
    const start = performance.now()
    setTasks(t => t.slice(50))
    const end = performance.now()
    setMetrics(m => ({ ...m, 'Suppression 50': (end - start).toFixed(3) + ' ms' }))
  }

  const priorityColor = (p) =>
    p === 'Haute' ? '#ef4444' : p === 'Moyenne' ? '#f59e0b' : '#22c55e'

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24, fontFamily: 'Arial' }}>
      <h1 style={{ color: '#1D9E75' }}>📝 Todo List — React</h1>

      {/* Formulaire ajout */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input value={name} onChange={e => setName(e.target.value)}
          placeholder="Nom de la tâche" onKeyDown={e => e.key === 'Enter' && addTask()}
          style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #ccc' }}
        />
        <select value={priority} onChange={e => setPriority(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ccc' }}>
          {PRIORITIES.map(p => <option key={p}>{p}</option>)}
        </select>
        <button onClick={addTask}
          style={{ background: '#1D9E75', color: 'white', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer' }}>
          Ajouter
        </button>
      </div>

      {/* Benchmark */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {[100, 500, 1000].map(n => (
          <button key={n} onClick={() => generateTasks(n)}
            style={{ background: '#6366f1', color: 'white', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
            Générer {n} tâches
          </button>
        ))}
        <button onClick={updateFifty}
          style={{ background: '#f59e0b', color: 'white', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
          Modifier 50
        </button>
        <button onClick={deleteFifty}
          style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
          Supprimer 50
        </button>
      </div>

      {/* Métriques */}
      {Object.keys(metrics).length > 0 && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: 12, marginBottom: 16 }}>
          <strong>⏱ Métriques de performance :</strong>
          {Object.entries(metrics).map(([k, v]) => (
            <div key={k} style={{ fontSize: 13, marginTop: 4 }}>
              <span style={{ color: '#666' }}>{k} : </span>
              <strong style={{ color: '#1D9E75' }}>{v}</strong>
            </div>
          ))}
        </div>
      )}

      {/* Compteur */}
      <p style={{ color: '#666', fontSize: 14 }}>{tasks.length} tâche(s)</p>

      {/* Liste */}
      {tasks.map(task => (
        <div key={task.id} style={{
          background: 'white', border: '1px solid #e5e7eb', borderRadius: 8,
          padding: '10px 14px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10
        }}>
          <input type="checkbox" checked={task.done} onChange={() => toggleDone(task.id)} />
          {editId === task.id ? (
            <>
              <input value={editName} onChange={e => setEditName(e.target.value)}
                style={{ flex: 1, padding: '4px 8px', borderRadius: 6, border: '1px solid #ccc' }} />
              <select value={editPrio} onChange={e => setEditPrio(e.target.value)}
                style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #ccc' }}>
                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
              </select>
              <button onClick={saveEdit}
                style={{ background: '#1D9E75', color: 'white', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>
                ✓
              </button>
            </>
          ) : (
            <>
              <span style={{ flex: 1, textDecoration: task.done ? 'line-through' : 'none', color: task.done ? '#9ca3af' : '#111' }}>
                {task.name}
              </span>
              <span style={{ background: priorityColor(task.priority), color: 'white', borderRadius: 12, padding: '2px 10px', fontSize: 12 }}>
                {task.priority}
              </span>
              <button onClick={() => startEdit(task)}
                style={{ background: '#f59e0b', color: 'white', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>
                ✏️
              </button>
              <button onClick={() => deleteTask(task.id)}
                style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>
                🗑
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  )
}

export default App