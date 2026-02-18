import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Plus, Search, CheckCircle2, Circle, LayoutGrid, LogOut, 
  X, Loader2, PlayCircle, Ban, AlertCircle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

//Domain Constants
const TASK_STATUS = {
  PENDING: "Pending",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled"
};

const PRIORITIES = ["Low", "Medium", "High"];

const STATUS_CONFIG = {
  [TASK_STATUS.PENDING]: { label: "Pending", color: "text-slate-400", bg: "bg-slate-100", icon: Circle },
  [TASK_STATUS.IN_PROGRESS]: { label: "In progress", color: "text-blue-500", bg: "bg-blue-50", icon: PlayCircle },
  [TASK_STATUS.COMPLETED]: { label: "Completed", color: "text-green-500", bg: "bg-green-50", icon: CheckCircle2 },
  [TASK_STATUS.CANCELLED]: { label: "Cancelled", color: "text-red-400", bg: "bg-red-50", icon: Ban },
};

const TaskPage = ({
  initialTasks = [],
  onAddTask,
  onUpdateTask,
}) => {
  // States
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { logout } = useAuth();

  const [newTask, setNewTask] = useState({ 
    title: "", 
    description: "", 
    priority: "Medium"
  });

  // References
  const prevInitialTasksRef = useRef(initialTasks);

  //Prop syncs (Deep Compare using JSON)
  useEffect(() => {
    const currentInitialStr = JSON.stringify(initialTasks);
    if (currentInitialStr !== JSON.stringify(prevInitialTasksRef.current)) {
      setTasks(initialTasks);
      prevInitialTasksRef.current = initialTasks;
    }
  }, [initialTasks]);

  // Bussiness logic
  const filteredTasks = useMemo(() => {
    return tasks
      .map((t, i) => ({ ...t, stableId: t._id || t.id || `task-${i}` }))
      .filter((task) => {
        const matchesFilter = filter === "all" || task.status === filter;
        const matchesSearch = (task.title || "").toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
      });
  }, [tasks, filter, searchQuery]);

  //Handlers

  const handleCreateTask = async (e) => {
    // Prevents default browser
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setErrorMessage("");
    console.log("Submit disparado: Validando datos...");

    //Validation
    const cleanTitle = newTask.title.trim();
    if (!cleanTitle) {
      setErrorMessage("Title is required.");
      return;
    }

    if (isSubmitting) return;

    //Payload
    setIsSubmitting(true);
    const taskPayload = {
      title: cleanTitle,
      description: (newTask.description || "").trim(),
      priority: newTask.priority
    };

    //Temp ID 
    const tempId = `temp-${Date.now()}`;
    const optimisticTask = { ...taskPayload, _id: tempId, status: TASK_STATUS.PENDING };

    try {
      console.log("Sending to API...", taskPayload);
      
      //Visual update
      setTasks(prev => [optimisticTask, ...prev]);

      // Callback with security timeout
      if (typeof onAddTask !== 'function') {
        throw new Error("onAddTask not defined or not a function.");
      }

      const response = await onAddTask(taskPayload);
      console.log("OK response");

      //Replaces temp task with server task
      const savedTask = response?.data || response;
      setTasks(prev => prev.map(t => t._id === tempId ? { ...optimisticTask, ...savedTask } : t));

      //State reset
      setNewTask({ title: "", description: "", priority: "Medium" });
      setIsModalOpen(false);
      
    } catch (error) {
      console.error("Create error:", error);
      setErrorMessage("Server connection error. Try again.");
      // Rollback state
      setTasks(prev => prev.filter(t => t._id !== tempId));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    setTasks(prev => prev.map(t => (t._id || t.id) === taskId ? { ...t, status: newStatus } : t));
    try {
      if (onUpdateTask) await onUpdateTask(taskId, { status: newStatus });
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-100 hidden lg:flex flex-col">
        <div className="p-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg">T</div>
          <h1 className="text-2xl font-black tracking-tighter text-slate-800">Taskly</h1>
        </div>
        <nav className="flex-1 px-6 space-y-2">
          <button className="w-full flex items-center gap-3 px-6 py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-bold text-sm">
            <LayoutGrid className="w-4 h-4" /> Dashboard
          </button>
        </nav>
        <div className="p-8">
          <button onClick={logout} className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-emerald-700 transition-all">
            <LogOut className="w-4 h-4 inline mr-2" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-24 bg-slate-300 border-b border-slate-100 flex items-center justify-between px-12 shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Tasks</h2>
            <p className="text-[10px] text-slate-800 font-bold uppercase tracking-widest mt-1">
              {filteredTasks.length} Tasks Found
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-800" />
              <input 
                type="text" 
                placeholder="Search tasks by title..." 
                className="bg-slate-50 border-none pl-12 pr-6 py-3 rounded-2xl text-sm w-64 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              type="button"
              onClick={() => { setErrorMessage(""); setIsModalOpen(true); }}
              className="bg-indigo-600 hover:bg-emerald-700 text-slate-800 px-8 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 flex items-center gap-2 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" /> Create Task
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-12 bg-slate-50/40">
          <div className="flex gap-2 mb-10 overflow-x-auto pb-2">
            <button 
              onClick={() => setFilter("all")} 
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === "all" ? "bg-slate-800 text-white" : "bg-white text-slate-400 border border-slate-200"}`}
            >
              All
            </button>
            {Object.values(TASK_STATUS).map(s => (
              <button 
                key={s} 
                onClick={() => setFilter(s)} 
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === s ? "bg-slate-800 text-white" : "bg-white text-slate-400 border border-slate-200"}`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredTasks.map((task) => {
              const config = STATUS_CONFIG[task.status] || STATUS_CONFIG[TASK_STATUS.PENDING];
              const StatusIcon = config.icon;
              return (
                <div key={task.stableId} className="bg-white border border-slate-200 p-8 rounded-[2.5rem] hover:shadow-xl transition-all group flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`px-4 py-1.5 rounded-full ${config.bg} ${config.color} text-[10px] font-black uppercase flex items-center gap-2`}>
                      <StatusIcon className="w-3.5 h-3.5" /> {config.label}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{task.title}</h3>
                  <p className="text-slate-800 text-sm leading-relaxed mb-8 flex-1">{task.description || "No description provided."}</p>
                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex gap-1.5">
                      {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                        <button 
                          key={`${task.stableId}-upd-${key}`}
                          onClick={() => handleUpdateStatus(task.stableId, key)}
                          title={val.label}
                          className={`p-2 rounded-xl transition-all ${task.status === key ? `${val.bg} ${val.color} ring-1 ring-current` : "bg-slate-50 text-slate-200 hover:text-emerald-700"}`}
                        >
                          <val.icon className="w-4 h-4" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] w-full max-w-lg p-12 relative shadow-2xl overflow-hidden">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-10 right-10 text-slate-300 hover:text-slate-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h3 className="text-3xl font-black mb-2 text-slate-900 tracking-tighter">New Task</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-10">Add New Task</p>

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold animate-pulse">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errorMessage}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleCreateTask} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Task Title</label>
                <input 
                  required
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-slate-700"
                  placeholder=""
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Description</label>
                <textarea 
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium min-h-[100px] resize-none"
                  placeholder="Description..."
                  value={newTask.description}
                  onChange={e => setNewTask({...newTask, description: e.target.value})}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Priority</label>
                <div className="flex gap-2">
                  {PRIORITIES.map(p => (
                    <button 
                      key={p}
                      type="button"
                      onClick={() => setNewTask({...newTask, priority: p})}
                      disabled={isSubmitting}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${
                        newTask.priority === p 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                        : 'bg-slate-50 text-slate-400 hover:bg-emerald-700'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting || !newTask.title.trim()}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm mt-4 flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    LOADING...
                  </>
                ) : (
                  <>
                    CREATE TASK
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskPage;