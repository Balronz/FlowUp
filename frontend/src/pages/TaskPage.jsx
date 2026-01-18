import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  LayoutGrid,
  List as ListIcon,
  LogOut,
  AlertCircle,
  X,
} from "lucide-react";

/**
 * @description TaskPage Component
 * He corregido la firma de la función para desestructurar las props correctamente.
 * También he implementado el modal de creación que estaba pendiente.
 */
const TaskPage = ({
  initialTasks = [],
  onAddTask,
  onDeleteTask,
  onToggleTask,
  user = { displayName: "Admin User", email: "admin@flowup.com" }, // Fallback para desarrollo
  logout = () => console.log("Logout clicked"),
}) => {
  // --- Estados de la Interfaz ---
  const [tasks, setTasks] = useState(initialTasks);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  // Estados para el Modal (Nuevas Tareas)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "low",
  });

  // Sincronización: Si las tareas vienen de una API externa (props), actualizamos el estado local
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  // --- Lógica de Filtrado (Memoizada implícitamente en el render) ---
  const filteredTasks = (Array.isArray(tasks) ? tasks : []).filter((task) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "completed"
        ? task.status === "completed"
        : task.status === "pending";

    const matchesSearch = task.title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // --- Handlers (Manejadores de Eventos) ---

  const handleToggle = async (id) => {
    // Si existe una función externa (ej. Firebase/API), la usamos
    if (onToggleTask) {
      await onToggleTask(id);
    } else {
      // Si no, actualizamos el estado local (Modo demo)
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                status: t.status === "completed" ? "pending" : "completed",
              }
            : t
        )
      );
    }
  };

  const handleDelete = async (id) => {
    if (onDeleteTask) {
      await onDeleteTask(id);
    } else {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const taskToCreate = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    if (onAddTask) {
      onAddTask(taskToCreate);
    } else {
      setTasks((prev) => [taskToCreate, ...prev]);
    }

    // Reset y cierre
    setNewTask({ title: "", description: "", priority: "low" });
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar - Navegación Izquierda */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-50 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white font-black text-xl w-10 h-10 flex items-center justify-center">
            F
          </div>
          <span className="font-black text-slate-800 text-xl tracking-tighter">
            FlowUp
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm">
            <LayoutGrid className="w-4 h-4" /> My Tasks
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-50 rounded-xl font-bold text-sm transition-colors">
            <Clock className="w-4 h-4" /> Recents
          </button>
        </nav>

        <div className="p-4 border-t border-slate-50">
          <div className="bg-slate-900 rounded-3xl p-4 text-white shadow-lg">
            <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">
              Active Session
            </p>
            <p className="text-sm font-bold truncate mb-3">
              {user?.displayName || user?.email}
            </p>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 rounded-lg text-[10px] font-black uppercase transition-all border border-red-500/20"
            >
              <LogOut className="w-3 h-3" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header - Búsqueda y Acción */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              Dashboard
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
              Track your daily progress
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none w-64 transition-all"
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2 font-bold text-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Task</span>
            </button>
          </div>
        </header>

        {/* Filtros y Vista de Tareas */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Filtros de Estado */}
            <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              {["all", "pending", "completed"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-tighter transition-all ${
                    filter === type
                      ? "bg-slate-900 text-white shadow-md"
                      : "text-slate-400 hover:bg-slate-50"
                  }`}
                >
                  {type === "all"
                    ? "All"
                    : type === "pending"
                    ? "Pending"
                    : "Done"}
                </button>
              ))}
            </div>

            {/* Alternar Vista Grid/List */}
            <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-slate-100 text-blue-600"
                    : "text-slate-400"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-slate-100 text-blue-600"
                    : "text-slate-400"
                }`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Lista de Tareas */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Synchronizing tasks...
                </p>
              </div>
            </div>
          ) : filteredTasks.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-3"
              }
            >
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`bg-white border group transition-all duration-300 ${
                    viewMode === "grid"
                      ? "p-6 rounded-[2.5rem] hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1"
                      : "p-4 rounded-2xl flex items-center justify-between"
                  } ${
                    task.status === "completed"
                      ? "border-green-100 bg-green-50/10"
                      : "border-slate-100 hover:border-blue-200"
                  }`}
                >
                  <div
                    className={
                      viewMode === "list"
                        ? "flex items-center gap-4 flex-1"
                        : ""
                    }
                  >
                    <button
                      onClick={() => handleToggle(task.id)}
                      className="transition-transform active:scale-125 shrink-0"
                    >
                      {task.status === "completed" ? (
                        <CheckCircle2 className="w-7 h-7 text-green-500 fill-white shadow-sm" />
                      ) : (
                        <Circle className="w-7 h-7 text-slate-200 hover:text-blue-500 transition-colors" />
                      )}
                    </button>

                    <div
                      className={viewMode === "grid" ? "mt-4" : "flex-1 ml-2"}
                    >
                      <h3
                        className={`font-bold text-slate-800 tracking-tight ${
                          task.status === "completed"
                            ? "line-through text-slate-400"
                            : ""
                        }`}
                      >
                        {task.title}
                      </h3>
                      {viewMode === "grid" && (
                        <p className="text-slate-500 text-[13px] mt-2 line-clamp-2 font-medium leading-relaxed">
                          {task.description ||
                            "No additional information provided."}
                        </p>
                      )}
                    </div>
                  </div>

                  <div
                    className={
                      viewMode === "grid"
                        ? "mt-6 pt-5 border-t border-slate-50 flex items-center justify-between"
                        : "flex items-center gap-4"
                    }
                  >
                    <span
                      className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border ${
                        task.priority === "high"
                          ? "bg-red-50 text-red-500 border-red-100"
                          : task.priority === "medium"
                          ? "bg-amber-50 text-amber-500 border-amber-100"
                          : "bg-blue-50 text-blue-500 border-blue-100"
                      }`}
                    >
                      {task.priority || "medium"}
                    </span>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
              <div className="bg-slate-50 p-8 rounded-full mb-6">
                <AlertCircle className="w-12 h-12 text-slate-300" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                No tasks found
              </h3>
              <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-2">
                All caught up!
              </p>
            </div>
          )}
        </div>
      </main>

      {/* MODAL - Crear Nueva Tarea */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                Create Task
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                  Title
                </label>
                <input
                  autoFocus
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all mt-1"
                  placeholder="What needs to be done?"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                  Description
                </label>
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all mt-1 min-h-[100px]"
                  placeholder="Add some details..."
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                  Priority
                </label>
                <div className="flex gap-2 mt-1">
                  {["low", "medium", "high"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewTask({ ...newTask, priority: p })}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${
                        newTask.priority === p
                          ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                          : "bg-white text-slate-400 border-slate-100 hover:bg-slate-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-95 mt-4"
              >
                SAVE TASK
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskPage;
