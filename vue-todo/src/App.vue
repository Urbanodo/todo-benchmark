<template>
  <div style="max-width:700px;margin:0 auto;padding:24px;font-family:Arial">
    <h1 style="color:#1D9E75">📝 Todo List — Vue</h1>

    <!-- Formulaire ajout -->
    <div style="display:flex;gap:8px;margin-bottom:16px">
      <input v-model="name" placeholder="Nom de la tâche" @keydown.enter="addTask"
        style="flex:1;padding:8px 12px;border-radius:8px;border:1px solid #ccc" />
      <select v-model="priority"
        style="padding:8px 12px;border-radius:8px;border:1px solid #ccc">
        <option v-for="p in PRIORITIES" :key="p">{{ p }}</option>
      </select>
      <button @click="addTask"
        style="background:#1D9E75;color:white;border:none;border-radius:8px;padding:8px 16px;cursor:pointer">
        Ajouter
      </button>
    </div>

    <!-- Benchmark -->
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
      <button v-for="n in [100, 500, 1000]" :key="n" @click="generateTasks(n)"
        style="background:#6366f1;color:white;border:none;border-radius:8px;padding:6px 12px;cursor:pointer">
        Générer {{ n }} tâches
      </button>
      <button @click="updateFifty"
        style="background:#f59e0b;color:white;border:none;border-radius:8px;padding:6px 12px;cursor:pointer">
        Modifier 50
      </button>
      <button @click="deleteFifty"
        style="background:#ef4444;color:white;border:none;border-radius:8px;padding:6px 12px;cursor:pointer">
        Supprimer 50
      </button>
    </div>

    <!-- Métriques -->
    <div v-if="Object.keys(metrics).length > 0"
      style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px;margin-bottom:16px">
      <strong>⏱ Métriques de performance :</strong>
      <div v-for="(v, k) in metrics" :key="k" style="font-size:13px;margin-top:4px">
        <span style="color:#666">{{ k }} : </span>
        <strong style="color:#1D9E75">{{ v }}</strong>
      </div>
    </div>

    <!-- Compteur -->
    <p style="color:#666;font-size:14px">{{ tasks.length }} tâche(s)</p>

    <!-- Liste -->
    <div v-for="task in tasks" :key="task.id"
      style="background:white;border:1px solid #e5e7eb;border-radius:8px;padding:10px 14px;margin-bottom:8px;display:flex;align-items:center;gap:10px">
      <input type="checkbox" v-model="task.done" />
      <template v-if="editId === task.id">
        <input v-model="editName"
          style="flex:1;padding:4px 8px;border-radius:6px;border:1px solid #ccc" />
        <select v-model="editPrio"
          style="padding:4px 8px;border-radius:6px;border:1px solid #ccc">
          <option v-for="p in PRIORITIES" :key="p">{{ p }}</option>
        </select>
        <button @click="saveEdit"
          style="background:#1D9E75;color:white;border:none;border-radius:6px;padding:4px 10px;cursor:pointer">✓</button>
      </template>
      <template v-else>
        <span :style="{ flex:1, textDecoration: task.done ? 'line-through' : 'none', color: task.done ? '#9ca3af' : '#111' }">
          {{ task.name }}
        </span>
        <span :style="{ background: priorityColor(task.priority), color:'white', borderRadius:'12px', padding:'2px 10px', fontSize:'12px' }">
          {{ task.priority }}
        </span>
        <button @click="startEdit(task)"
          style="background:#f59e0b;color:white;border:none;border-radius:6px;padding:4px 10px;cursor:pointer">✏️</button>
        <button @click="deleteTask(task.id)"
          style="background:#ef4444;color:white;border:none;border-radius:6px;padding:4px 10px;cursor:pointer">🗑</button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const PRIORITIES = ['Haute', 'Moyenne', 'Basse']
const tasks    = ref([])
const name     = ref('')
const priority = ref('Moyenne')
const editId   = ref(null)
const editName = ref('')
const editPrio = ref('')
const metrics  = reactive({})

const measure = (label, fn) => {
  const start = performance.now()
  fn()
  const end = performance.now()
  metrics[label] = (end - start).toFixed(3) + ' ms'
}

const priorityColor = (p) =>
  p === 'Haute' ? '#ef4444' : p === 'Moyenne' ? '#f59e0b' : '#22c55e'

const addTask = () => {
  if (!name.value.trim()) return
  measure('Ajout', () => {
    tasks.value.push({ id: Date.now(), name: name.value, priority: priority.value, done: false })
  })
  name.value = ''
}

const deleteTask = (id) => {
  measure('Suppression', () => {
    tasks.value = tasks.value.filter(t => t.id !== id)
  })
}

const startEdit = (task) => {
  editId.value   = task.id
  editName.value = task.name
  editPrio.value = task.priority
}

const saveEdit = () => {
  measure('Modification', () => {
    const t = tasks.value.find(t => t.id === editId.value)
    if (t) { t.name = editName.value; t.priority = editPrio.value }
  })
  editId.value = null
}

const generateTasks = (n) => {
  const start = performance.now()
  tasks.value = Array.from({ length: n }, (_, i) => ({
    id: Date.now() + i,
    name: `Tâche ${i + 1}`,
    priority: PRIORITIES[i % 3],
    done: false
  }))
  const end = performance.now()
  metrics[`Rendu ${n} tâches`] = (end - start).toFixed(3) + ' ms'
}

const updateFifty = () => {
  const start = performance.now()
  tasks.value.slice(0, 50).forEach((t, i) => {
    t.name = `Mise à jour ${i + 1}`
    t.priority = 'Haute'
  })
  const end = performance.now()
  metrics['Mise à jour 50'] = (end - start).toFixed(3) + ' ms'
}

const deleteFifty = () => {
  const start = performance.now()
  tasks.value = tasks.value.slice(50)
  const end = performance.now()
  metrics['Suppression 50'] = (end - start).toFixed(3) + ' ms'
}
</script>