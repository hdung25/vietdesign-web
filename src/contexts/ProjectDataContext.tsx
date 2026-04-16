/**
 * ProjectDataContext – single source of truth for all project data.
 * Admin writes → localStorage → User reads (same keys).
 */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { db, storage } from '../firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

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

interface ProjectDataCtx {
  projects: ProjectData[];
  heroImage: string | null;
  heroTitle: string;
  heroSubtitle: string;
  setHeroImage: (v: string | null) => Promise<void>;
  setHeroTitle: (v: string) => Promise<void>;
  setHeroSubtitle: (v: string) => Promise<void>;
  addProject: (p: ProjectData) => Promise<void>;
  updateProject: (p: ProjectData) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  loading: boolean;
}

const Ctx = createContext<ProjectDataCtx | null>(null);

async function uploadImageIfBase64(imgUrl: string, path: string): Promise<string> {
  if (!imgUrl || !imgUrl.startsWith('data:image/')) return imgUrl;
  const imageRef = ref(storage, path);
  await uploadString(imageRef, imgUrl, 'data_url');
  return await getDownloadURL(imageRef);
}

export function ProjectDataProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<ProjectData[]>(DEFAULT_PROJECTS);
  const [heroImage, setHeroImageState] = useState<string | null>(null);
  const [heroTitle, setHeroTitleState] = useState('VIETDESIGN');
  const [heroSubtitle, setHeroSubtitleState] = useState('Kiến Trúc & Nội Thất Đẳng Cấp');
  const [loading, setLoading] = useState(true);

  // Sync with Firestore
  useEffect(() => {
    // Lắng nghe cấu hình trang chủ
    const unsubSettings = onSnapshot(doc(db, 'settings', 'home'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setHeroImageState(data.heroImage ?? null);
        setHeroTitleState(data.heroTitle ?? 'VIETDESIGN');
        setHeroSubtitleState(data.heroSubtitle ?? 'Kiến Trúc & Nội Thất Đẳng Cấp');
      } else {
        // Ghi dữ liệu mặc định ban đầu
        setDoc(doc(db, 'settings', 'home'), {
          heroImage: null,
          heroTitle: 'VIETDESIGN',
          heroSubtitle: 'Kiến Trúc & Nội Thất Đẳng Cấp'
        });
      }
    });

    // Lắng nghe dữ liệu các dự án
    const unsubProjects = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const fetchedProjects: ProjectData[] = [];
      snapshot.forEach(docSnap => {
        fetchedProjects.push({ id: Number(docSnap.id), ...docSnap.data() } as ProjectData);
      });

      if (fetchedProjects.length > 0) {
        setProjects(fetchedProjects.sort((a,b) => a.id - b.id)); // Sắp xếp theo ID (hoặc ngày tạo)
      } else {
        // Nếu database trống, upload Dữ liệu mẫu lên
        DEFAULT_PROJECTS.forEach(p => {
          setDoc(doc(db, 'projects', p.id.toString()), p);
        });
        setProjects(DEFAULT_PROJECTS);
      }
      setLoading(false);
    });

    return () => { unsubSettings(); unsubProjects(); };
  }, []);

  const saveSettings = async (newData: any) => {
    await setDoc(doc(db, 'settings', 'home'), newData, { merge: true });
  };

  const setHeroImage = async (v: string | null) => {
    if (v && v.startsWith('data:image/')) {
       v = await uploadImageIfBase64(v, `settings/heroImage_${Date.now()}`);
    }
    await saveSettings({ heroImage: v });
  };

  const setHeroTitle = async (v: string) => await saveSettings({ heroTitle: v });
  const setHeroSubtitle = async (v: string) => await saveSettings({ heroSubtitle: v });

  const addProject = async (p: ProjectData) => {
    try {
      p.coverImage = await uploadImageIfBase64(p.coverImage, `projects/${p.id}/cover`);
      for (let i = 0; i < p.galleryImages.length; i++) {
        p.galleryImages[i] = await uploadImageIfBase64(p.galleryImages[i], `projects/${p.id}/gallery_${Date.now()}_${i}`);
      }
      await setDoc(doc(db, 'projects', p.id.toString()), p);
    } catch (error) { console.error("Lỗi khi thêm dự án", error); }
  };

  const updateProject = async (p: ProjectData) => {
    try {
      p.coverImage = await uploadImageIfBase64(p.coverImage, `projects/${p.id}/cover`);
      for (let i = 0; i < p.galleryImages.length; i++) {
        p.galleryImages[i] = await uploadImageIfBase64(p.galleryImages[i], `projects/${p.id}/gallery_${Date.now()}_${i}`);
      }
      await setDoc(doc(db, 'projects', p.id.toString()), p);
    } catch (error) { console.error("Lỗi khi cập nhật dự án", error); }
  };

  const deleteProject = async (id: number) => {
    try {
      await deleteDoc(doc(db, 'projects', id.toString()));
    } catch (error) { console.error("Lỗi xóa dự án", error); }
  };

  return (
    <Ctx.Provider value={{
      projects, heroImage, heroTitle, heroSubtitle,
      setHeroImage, setHeroTitle, setHeroSubtitle,
      addProject, updateProject, deleteProject, loading
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
