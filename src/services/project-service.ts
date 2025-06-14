
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useCallback } from "react"; // Added useCallback

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

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .order('name');

      if (fetchError) throw fetchError;
      setProjects(data || []);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setError(err.message || 'Failed to fetch projects');
      setProjects([]); // Clear projects on error
    } finally {
      setLoading(false);
    }
  }, []); // Dependencies: setLoading, setError, setProjects are stable

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]); // Depend on memoized fetchProjects

  const addProject = useCallback(async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single();

      if (insertError) throw insertError;
      
      await fetchProjects(); // Refresh the list
      return data as Project;
    } catch (err: any) {
      console.error('Error adding project:', err);
      throw err; // Re-throw for the caller to handle
    }
  }, [fetchProjects]);

  const updateProject = useCallback(async (projectData: Project) => {
    try {
      const { error: updateError } = await supabase
        .from('projects')
        .update({
          name: projectData.name,
          description: projectData.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectData.id);

      if (updateError) throw updateError;
      
      await fetchProjects(); // Refresh the list
      return true;
    } catch (err: any) {
      console.error('Error updating project:', err);
      // Consider re-throwing or returning a more specific error object
      return false;
    }
  }, [fetchProjects]);

  const deleteProject = useCallback(async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      await fetchProjects(); // Refresh the list
      return true;
    } catch (err: any) {
      console.error('Error deleting project:', err);
      // Consider re-throwing or returning a more specific error object
      return false;
    }
  }, [fetchProjects]);

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

