
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

export interface Project {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('name');

      if (error) throw error;
      setProjects(data || []);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setError(err.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const addProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single();

      if (error) throw error;
      
      setProjects(prev => [...prev, data]);
      return data;
    } catch (err: any) {
      console.error('Error adding project:', err);
      throw err;
    }
  };

  const updateProject = async (projectData: Project) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          name: projectData.name,
          description: projectData.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectData.id);

      if (error) throw error;
      
      setProjects(prev => 
        prev.map(p => p.id === projectData.id ? {...p, ...projectData} : p)
      );
      
      return true;
    } catch (err: any) {
      console.error('Error updating project:', err);
      return false;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProjects(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err: any) {
      console.error('Error deleting project:', err);
      return false;
    }
  };

  return {
    projects,
    loading,
    error,
    fetchProjects,
    addProject,
    updateProject,
    deleteProject
  };
};
