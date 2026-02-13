import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { createTaskRequest, updateTaskRequest, getTasksRequest } from './api/tasks';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TaskPage from './pages/TaskPage';

//Context logic
function AppContent() {
  const [tasks, setTasks] = useState([]);
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      if (isAuthenticated) {
        try {
          const res = await getTasksRequest();
          //Syncs with AppContent global status
          setTasks(res.data);
        } catch (error) {
          console.log("Loading Tasks error: ", error);
        }
      }
    };
    fetchTasks();
  }, [isAuthenticated]);

  const handleAddTask = async (taskPayload) => {
    try {
      const res = await createTaskRequest(taskPayload);
      const savedTask = res.data;
      // Updates state, shows immediatly on dashboard
      setTasks(prev => [savedTask, ...prev]);
      return savedTask; 
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      await updateTaskRequest(id, taskData);
      // Updates to avoid re-fetch
      setTasks(prev => prev.map(t => (t._id === id ? { ...t, ...taskData } : t)));
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  };

  if (authLoading) return <div>Cargando sesión...</div>;

  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/tasks" 
        element={
          <TaskPage 
            initialTasks={tasks}
            onAddTask={handleAddTask} 
            onUpdateTask={handleUpdateTask}
          />
        } 
      />
    </Routes>
  );
}

//Root Component
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;