<script>
  const PRIORITIES = ['Haute', 'Moyenne', 'Basse']
  let tasks    = []
  let name     = ''
  let priority = 'Moyenne'
  let editId   = null
  let editName = ''
  let editPrio = ''
  let metrics  = {}

  const measure = (label, fn) => {
    const start = performance.now()
    fn()
    const end = performance.now()
    metrics = { ...metrics, [label]: (end - start).toFixed(3) + ' ms' }
  }

  const priorityColor = (p) =>
    p === 'Haute' ? '#ef4444' : p === 'Moyenne' ? '#f59e0b' : '#22c55e'

  const addTask = () => {
    if (!name.trim()) return
    measure('Ajout', () => {
      tasks = [...tasks, { id: Date.now(), name, priority, done: false }]
    })
    name = ''
  }

  const deleteTask = (id) => {
    measure('Suppression', () => {
      tasks = tasks.filter(t => t.id !== id)
    })
  }

  const startEdit = (task) => {
    editId   = task.id
    editName = task.name
    editPrio = task.priority
  }

  const saveEdit = () => {
    measure('Modification', () => {
      tasks = tasks.map(t => t.id === editId
        ? { ...t, name: editName, priority: editPrio }
        : t
      )
    })
    editId = null
  }

  const generateTasks = (n) => {
    const start = performance.now()
    tasks = Array.from({ length: n }, (_, i) => ({
      id: Date.now() + i,
      name: `Tâche ${i + 1}`,
      priority: PRIORITIES[i % 3],
      done: false
    }))
    const end = performance.now()
    metrics = { ...metrics, [`Rendu ${n} tâches`]: (end - start).toFixed(3) + ' ms' }
  }

  const updateFifty = () => {
    const start = performance.now()
    tasks = tasks.map((t, i) =>
      i < 50 ? { ...t, name: `Mise à jour ${i + 1}`, priority: 'Haute' } : t
    )
    const end = performance.now()
    metrics = { ...metrics, 'Mise à jour 50': (end - start).toFixed(3) + ' ms' }
  }

  const deleteFifty = () => {
    const start = performance.now()
    tasks = tasks.slice(50)
    const end = performance.now()
    metrics = { ...metrics, 'Suppression 50': (end - start).toFixed(3) + ' ms' }
  }
</script>

<div style="max-width:700px;margin:0 auto;padding:24px;font-family:Arial">
  <h1 style="color:#1D9E75">📝 Todo List — Svelte</h1>

  <!-- Formulaire ajout -->
  <div style="display:flex;gap:8px;margin-bottom:16px">
    <input bind:value={name} placeholder="Nom de la tâche"
      on:keydown={e => e.key === 'Enter' && addTask()}
      style="flex:1;padding:8px 12px;border-radius:8px;border:1px solid #ccc" />
    <select bind:value={priority}
      style="padding:8px 12px;border-radius:8px;border:1px solid #ccc">
      {#each PRIORITIES as p}
        <option>{p}</option>
      {/each}
    </select>
    <button on:click={addTask}
      style="background:#1D9E75;color:white;border:none;border-radius:8px;padding:8px 16px;cursor:pointer">
      Ajouter
    </button>
  </div>

  <!-- Benchmark -->
  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
    {#each [100, 500, 1000] as n}
      <button on:click={() => generateTasks(n)}
        style="background:#6366f1;color:white;border:none;border-radius:8px;padding:6px 12px;cursor:pointer">
        Générer {n} tâches
      </button>
    {/each}
    <button on:click={updateFifty}
      style="background:#f59e0b;color:white;border:none;border-radius:8px;padding:6px 12px;cursor:pointer">
      Modifier 50
    </button>
    <button on:click={deleteFifty}
      style="background:#ef4444;color:white;border:none;border-radius:8px;padding:6px 12px;cursor:pointer">
      Supprimer 50
    </button>
  </div>

  <!-- Métriques -->
  {#if Object.keys(metrics).length > 0}
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px;margin-bottom:16px">
      <strong>⏱ Métriques de performance :</strong>
      {#each Object.entries(metrics) as [k, v]}
        <div style="font-size:13px;margin-top:4px">
          <span style="color:#666">{k} : </span>
          <strong style="color:#1D9E75">{v}</strong>
        </div>
      {/each}
    </div>
  {/if}

  <!-- Compteur -->
  <p style="color:#666;font-size:14px">{tasks.length} tâche(s)</p>

  <!-- Liste -->
  {#each tasks as task (task.id)}
    <div style="background:white;border:1px solid #e5e7eb;border-radius:8px;padding:10px 14px;margin-bottom:8px;display:flex;align-items:center;gap:10px">
      <input type="checkbox" bind:checked={task.done} />
      {#if editId === task.id}
        <input bind:value={editName}
          style="flex:1;padding:4px 8px;border-radius:6px;border:1px solid #ccc" />
        <select bind:value={editPrio}
          style="padding:4px 8px;border-radius:6px;border:1px solid #ccc">
          {#each PRIORITIES as p}
            <option>{p}</option>
          {/each}
        </select>
        <button on:click={saveEdit}
          style="background:#1D9E75;color:white;border:none;border-radius:6px;padding:4px 10px;cursor:pointer">✓</button>
      {:else}
        <span style="flex:1;text-decoration:{task.done ? 'line-through' : 'none'};color:{task.done ? '#9ca3af' : '#111'}">
          {task.name}
        </span>
        <span style="background:{priorityColor(task.priority)};color:white;border-radius:12px;padding:2px 10px;font-size:12px">
          {task.priority}
        </span>
        <button on:click={() => startEdit(task)}
          style="background:#f59e0b;color:white;border:none;border-radius:6px;padding:4px 10px;cursor:pointer">✏️</button>
        <button on:click={() => deleteTask(task.id)}
          style="background:#ef4444;color:white;border:none;border-radius:6px;padding:4px 10px;cursor:pointer">🗑</button>
      {/if}
    </div>
  {/each}
</div>