import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  'https://bydkzxqmgsvsnjtafphj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5ZGt6eHFtZ3N2c25qdGFmcGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NzgxODgsImV4cCI6MjA4MzU1NDE4OH0.ICQySbd-qUY7Li2G10lIUMZ_LybIwTc-UPU060o1oS8'
);

const baseUrl = 'https://bydkzxqmgsvsnjtafphj.supabase.co/storage/v1/object/public/Repository%20Bucket/projects/X25RB01-sanctuary';

const blocksToInsert = [
  {
    id: 'gallery-scale',
    project_id: 'X25-RB01',
    block_type: 'image-gallery',
    block_order: 5,
    data: {
      images: [
        { src: baseUrl + '/x25rb01-shape-hidden-lake-es.jpg', alt: 'Shared Learning Space at Hidden Lake Elementary School', caption: 'Shared Learning - Hidden Lake ES - Pfluger Architects, 2023' },
        { src: baseUrl + '/x25rb01-scale-del-valle-cdc.png', alt: 'Reading nook at Del Valle CDC', caption: 'Reading Nook - Del Valle CDC - Pfluger Architects' },
        { src: baseUrl + '/x25rb01-scale-the-harvey-schools.jpg', alt: 'The Harvey Schools interior', caption: 'The Harvey Schools - Pfluger Architects' },
      ],
      columns: 3,
    },
    searchable_text: 'Hidden Lake Elementary School shared learning space Del Valle CDC reading nook Harvey Schools',
  },
  {
    id: 'gallery-color',
    project_id: 'X25-RB01',
    block_type: 'image-gallery',
    block_order: 8,
    data: {
      images: [
        { src: baseUrl + '/x25rb01-peabody-cafeteria.jpg', alt: 'Cafeteria at George Peabody Elementary School', caption: 'Color Tuning a Cafeteria - George Peabody ES - Pfluger Architects, 2024' },
      ],
      columns: 1,
    },
    searchable_text: 'George Peabody Elementary School cafeteria color tuning',
  },
  {
    id: 'gallery-materiality',
    project_id: 'X25-RB01',
    block_type: 'image-gallery',
    block_order: 12,
    data: {
      images: [
        { src: baseUrl + '/x25rb01-martinez-gathering.jpg', alt: 'Gathering Space at Dorothy Martinez Elementary School', caption: 'Gathering Space - Dorothy Martinez ES - Pfluger Architects, 2024' },
      ],
      columns: 1,
    },
    searchable_text: 'Dorothy Martinez Elementary School gathering space materiality',
  },
  {
    id: 'gallery-nature',
    project_id: 'X25-RB01',
    block_type: 'image-gallery',
    block_order: 16,
    data: {
      images: [
        { src: baseUrl + '/x25rb01-courtyard.jpg', alt: 'Courtyard with natural elements', caption: 'Courtyard Design - Pfluger Architects' },
      ],
      columns: 1,
    },
    searchable_text: 'Courtyard natural elements biophilic design',
  },
  {
    id: 'gallery-emotions',
    project_id: 'X25-RB01',
    block_type: 'image-gallery',
    block_order: 19,
    data: {
      images: [
        { src: baseUrl + '/x25rb01-martinez-reading-pods.jpg', alt: 'Media Center Reading Pods at Dorothy Martinez Elementary School', caption: 'Media Center Reading Pods - Dorothy Martinez ES - Pfluger Architects, 2024' },
      ],
      columns: 1,
    },
    searchable_text: 'Dorothy Martinez Elementary School media center reading pods emotions',
  },
  {
    id: 'sources-list',
    project_id: 'X25-RB01',
    block_type: 'sources',
    block_order: 21,
    data: {
      sources: [
        { id: 1, title: 'Visual elements of subjective preference modulate amygdala activation', author: 'Bar, M., & Neta, M. (2007)', url: 'https://doi.org/10.1016/j.neuropsychologia.2007.03.017' },
        { id: 2, title: 'The neuroscience of emotion regulation development', author: 'Martin, R. E., & Ochsner, K. N. (2016)', url: 'https://doi.org/10.1016/j.cobeha.2016.06.006' },
        { id: 3, title: 'Impact of contour on aesthetic judgments', author: 'Vartanian, O., et al. (2013)', url: 'https://doi.org/10.1073/pnas.1301227110' },
        { id: 4, title: 'Color psychology', author: 'Elliot, A. J., & Maier, M. A. (2014)', url: 'https://doi.org/10.1146/annurev-psych-010213-115035' },
        { id: 5, title: 'Preferences of colors in working surrounding', author: 'Glogar, P., et al. (2017)' },
        { id: 6, title: 'Color lexicon acquisition', author: 'Imai, M., et al. (2020)' },
        { id: 7, title: 'Color, arousal, and performance', author: 'Kuller, R., et al. (2009)', url: 'https://doi.org/10.1002/col.20476' },
        { id: 8, title: 'Development of color perception', author: 'Maule, J., et al. (2023)', url: 'https://doi.org/10.1146/annurev-psych-032720-040512' },
        { id: 9, title: '20 Things Neuroscientist Wants You to Know', author: 'Dr. Sally Augustin' },
        { id: 10, title: 'Effects of Classroom Acoustics', author: 'Klatte, M., et al. (2010)' },
        { id: 11, title: 'Acoustical Design in Education', author: 'Kireiusa.com' },
        { id: 12, title: 'Influence of Classroom Acoustics', author: 'Astolfi, A. (2019)' },
        { id: 13, title: 'Good acoustics for teaching', author: 'Christensson, J. (2018)' },
        { id: 14, title: 'Child development and physical environment', author: 'Evans, G. W. (2006)', url: 'https://doi.org/10.1146/annurev.psych.57.102904.190057' },
        { id: 15, title: 'Lighting Issues in Child Care', author: 'Alexander (2008)' },
        { id: 16, title: 'Good Lighting in Child-Friendly Spaces', author: 'Reed (2023)' },
        { id: 17, title: 'Effects of light in children', author: 'Westwood (2023)' },
        { id: 18, title: 'Lighting in Early Childhood Environment', author: 'Shivarama (2014)' },
        { id: 19, title: 'History of Nature-Based Education', author: 'Prochner (2021)' },
        { id: 20, title: 'Nature-Based Learning', author: 'International School Ho Chi Minh City' },
        { id: 21, title: 'Biophilic Design in Education', author: 'Inprocorp.com (2020)' },
        { id: 22, title: 'Emotions, Learning, and the Brain', author: 'Immordino-Yang, M. H. (2015)' },
        { id: 23, title: 'School readiness and self-regulation', author: 'Blair, C., & Raver, C. C. (2015)', url: 'https://doi.org/10.1146/annurev-psych-010814-015221' },
        { id: 24, title: 'Large-scale brain networks', author: 'Barrett, L. F., & Satpute, A. B. (2013)', url: 'https://doi.org/10.1016/j.conb.2012.12.012' },
      ],
    },
    searchable_text: 'Bar Neta amygdala Martin Ochsner emotion Vartanian contour Elliot Maier color psychology Glogar color preferences Imai color lexicon Kuller color arousal Maule color perception Augustin neuroscience Klatte acoustics Astolfi classroom acoustics Christensson teaching Evans child development Alexander lighting Reed lighting Westwood light children Shivarama early childhood Prochner nature education biophilic Immordino-Yang emotions brain Blair Raver self-regulation Barrett Satpute brain networks',
  },
];

async function insertBlocks() {
  const { data, error } = await supabase
    .from('project_blocks')
    .insert(blocksToInsert)
    .select('id');

  if (error) console.error('Insert error:', error);
  else console.log('Inserted', data.length, 'blocks:', data.map(b => b.id).join(', '));
}

insertBlocks();
