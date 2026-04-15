/**
 * ProjectDataContext – single source of truth for all project data.
 * Admin writes → localStorage → User reads (same keys).
 */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Category = 'Villa' | 'Căn Hộ' | 'Kiến Trúc' | 'Nội Thất';

export interface ProjectData {
  id: number;
  title: string;
  titleEN: string;
  category: Category;
  location: string;
  desc: string;
  descEN: string;
  /** Cover image – base64 or URL */
  coverImage: string;
  /** Gallery images – base64 or URLs (uploaded by admin) */
  galleryImages: string[];
  /** Whether this project was added by admin (can be deleted) */
  custom: boolean;
}

// ── Default projects (same 9 as the old Projects.tsx) ──────────────────────
export const DEFAULT_PROJECTS: ProjectData[] = [
  {
    id: 1,
    title: 'The Saigon Mansion',
    titleEN: 'The Saigon Mansion',
    category: 'Villa',
    location: 'TP. Hồ Chí Minh',
    desc: 'Không gian sống đẳng cấp được lấy cảm hứng từ kiến trúc tân cổ điển châu Âu, mang đến vẻ đẹp vượt thời gian.',
    descEN: 'A timeless living space inspired by European neoclassical architecture.',
    coverImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80&fit=crop',
    galleryImages: [],
    custom: false,
  },
  {
    id: 2,
    title: 'Hanoi Sky Penthouse',
    titleEN: 'Hanoi Sky Penthouse',
    category: 'Căn Hộ',
    location: 'Hà Nội',
    desc: 'Căn penthouse sang trọng với tầm nhìn toàn cảnh thành phố, nội thất được thiết kế theo phong cách Art Deco hiện đại.',
    descEN: 'A luxury penthouse with panoramic city views, designed in modern Art Deco style.',
    coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80&fit=crop',
    galleryImages: [],
    custom: false,
  },
  {
    id: 3,
    title: 'The Gentleman Apartment',
    titleEN: 'The Gentleman Apartment',
    category: 'Nội Thất',
    location: 'Hà Nội',
    desc: 'Không gian nội thất tối giản nhưng đầy tinh tế, kết hợp giữa da thật, đá marble và gỗ óc chó cao cấp.',
    descEN: 'A minimalist yet refined interior combining genuine leather, marble and premium walnut wood.',
    coverImage: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80&fit=crop',
    galleryImages: [],
    custom: false,
  },
  {
    id: 4,
    title: 'Coastal Pearl Villa',
    titleEN: 'Coastal Pearl Villa',
    category: 'Villa',
    location: 'Đà Nẵng',
    desc: 'Biệt thự ven biển với kiến trúc mở, hòa hợp hoàn toàn với thiên nhiên và ánh sáng tự nhiên tràn ngập.',
    descEN: 'A beachfront villa with open architecture, fully harmonized with nature and abundant natural light.',
    coverImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80&fit=crop',
    galleryImages: [],
    custom: false,
  },
  {
    id: 5,
    title: 'The Zeit Penthouse',
    titleEN: 'The Zeit Penthouse',
    category: 'Căn Hộ',
    location: 'TP. Hồ Chí Minh',
    desc: 'Không gian nội thất là sự phản ánh lối sống và giá trị chia sẻ giữa chủ nhà và kiến trúc sư.',
    descEN: 'An interior space that reflects the shared lifestyle and values between the owner and architect.',
    coverImage: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80&fit=crop',
    galleryImages: [],
    custom: false,
  },
  {
    id: 6,
    title: 'Dong Anh Heritage',
    titleEN: 'Dong Anh Heritage',
    category: 'Kiến Trúc',
    location: 'Hà Nội',
    desc: 'Công trình kiến trúc cổ điển Pháp được phục dựng và nâng tầm với nội thất hiện đại sang trọng bên trong.',
    descEN: 'A restored French classical building elevated with luxurious modern interiors within.',
    coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80&fit=crop',
    galleryImages: [],
    custom: false,
  },
  {
    id: 7,
    title: 'Bamboo Zen Retreat',
    titleEN: 'Bamboo Zen Retreat',
    category: 'Villa',
    location: 'Đà Lạt',
    desc: 'Biệt thự nghỉ dưỡng hòa mình vào thiên nhiên, sử dụng vật liệu bản địa kết hợp công nghệ xây dựng hiện đại.',
    descEN: 'A resort villa immersed in nature, using local materials combined with modern construction technology.',
    coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80&fit=crop',
    galleryImages: [],
    custom: false,
  },
  {
    id: 8,
    title: 'Empire Living Room',
    titleEN: 'Empire Living Room',
    category: 'Nội Thất',
    location: 'TP. Hồ Chí Minh',
    desc: 'Phòng khách theo phong cách Empire với đèn chùm pha lê, trần thạch cao trang trí và bộ sofa nhung cao cấp.',
    descEN: 'Empire-style living room with crystal chandelier, decorative plaster ceiling and premium velvet sofa.',
    coverImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80&fit=crop',
    galleryImages: [],
    custom: false,
  },
  {
    id: 9,
    title: 'Crystal Tower',
    titleEN: 'Crystal Tower',
    category: 'Kiến Trúc',
    location: 'Hà Nội',
    desc: 'Tòa nhà văn phòng cao tầng với mặt dựng kính phản chiếu, biểu tượng của sự phát triển đô thị hiện đại.',
    descEN: 'A high-rise office tower with reflective glass facade, symbol of modern urban development.',
    coverImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80&fit=crop',
    galleryImages: [],
    custom: false,
  },
];

const LS_KEY = 'vd_projects_v2';

function loadFromStorage(): ProjectData[] | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ProjectData[];
  } catch {
    return null;
  }
}

function saveToStorage(projects: ProjectData[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(projects));
  } catch (e) {
    console.warn('localStorage full?', e);
  }
}

interface ProjectDataCtx {
  projects: ProjectData[];
  heroImage: string | null;
  heroTitle: string;
  heroSubtitle: string;
  setHeroImage: (v: string | null) => void;
  setHeroTitle: (v: string) => void;
  setHeroSubtitle: (v: string) => void;
  addProject: (p: ProjectData) => void;
  updateProject: (p: ProjectData) => void;
  deleteProject: (id: number) => void;
}

const Ctx = createContext<ProjectDataCtx | null>(null);

export function ProjectDataProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<ProjectData[]>(() => {
    return loadFromStorage() ?? DEFAULT_PROJECTS;
  });

  const [heroImage, setHeroImageState] = useState<string | null>(
    () => localStorage.getItem('vd_hero_image')
  );
  const [heroTitle, setHeroTitleState] = useState(
    () => localStorage.getItem('vd_hero_title') ?? 'VIETDESIGN'
  );
  const [heroSubtitle, setHeroSubtitleState] = useState(
    () => localStorage.getItem('vd_hero_subtitle') ?? 'Kiến Trúc & Nội Thất Đẳng Cấp'
  );

  useEffect(() => {
    saveToStorage(projects);
  }, [projects]);

  const setHeroImage = (v: string | null) => {
    setHeroImageState(v);
    if (v) localStorage.setItem('vd_hero_image', v);
    else localStorage.removeItem('vd_hero_image');
  };

  const setHeroTitle = (v: string) => {
    setHeroTitleState(v);
    localStorage.setItem('vd_hero_title', v);
  };

  const setHeroSubtitle = (v: string) => {
    setHeroSubtitleState(v);
    localStorage.setItem('vd_hero_subtitle', v);
  };

  const addProject = (p: ProjectData) => setProjects(prev => [...prev, p]);
  const updateProject = (p: ProjectData) =>
    setProjects(prev => prev.map(x => (x.id === p.id ? p : x)));
  const deleteProject = (id: number) =>
    setProjects(prev => prev.filter(p => p.id !== id));

  return (
    <Ctx.Provider value={{
      projects, heroImage, heroTitle, heroSubtitle,
      setHeroImage, setHeroTitle, setHeroSubtitle,
      addProject, updateProject, deleteProject,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useProjectData() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useProjectData must be inside ProjectDataProvider');
  return ctx;
}
