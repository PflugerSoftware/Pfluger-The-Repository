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

function getCategoryImage(category: string): string {
  const imageMap: Record<string, string> = {
    'psychology': '1497366216548-37526070297c',
    'health-safety': '1519389950473-47ba0277781c',
    'sustainability': '1497366811353-6870744d04b2',
    'immersive': '1522202176988-66273c2fd55f',
    'campus-life': '1523050854058-8df90110c9f1',
    'fine-arts': '1513694203232-719a280e022f',
  };
  return `https://images.unsplash.com/photo-${imageMap[category] || '1497366216548-37526070297c'}?w=800`;
}

export async function loadProjects(): Promise<ResearchProject[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('id, title, description, category, phase, latitude, longitude, start_date, completion_date, office, image_url')
    .eq('is_confidential', false)
    .order('start_date', { ascending: false });

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
      image: row.image_url || getCategoryImage(row.category),
      office: row.office || undefined,
    };
  });
}
