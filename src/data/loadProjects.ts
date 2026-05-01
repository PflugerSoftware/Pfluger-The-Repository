import { supabase } from '../config/supabase';
import { getProjectMetadata } from '../services/projects';

export interface ResearchProject {
  id: string;
  title: string;
  researcher: string;
  category: string;
  phase: string;
  description: string;
  position: [number, number];
  partners?: string[];
  startDate?: string;
  completionDate?: string;
  image?: string;
  office?: string;
}

export async function loadProjects(includeConfidential = false): Promise<ResearchProject[]> {
  let query = supabase
    .from('projects')
    .select('id, title, description, category, phase, latitude, longitude, start_date, completion_date, office, image_url')
    .order('start_date', { ascending: false });

  if (!includeConfidential) {
    query = query.eq('is_confidential', false);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error loading projects from Supabase:', error);
    return [];
  }

  return (data || []).map(row => {
    const metadata = getProjectMetadata(row.id);

    return {
      id: row.id,
      title: row.title,
      researcher: metadata?.researcher || '',
      category: row.category,
      phase: row.phase,
      description: row.description,
      position: [parseFloat(row.latitude), parseFloat(row.longitude)] as [number, number],
      startDate: row.start_date || undefined,
      completionDate: row.completion_date || undefined,
      image: row.image_url || undefined,
      office: row.office || undefined,
    };
  });
}
