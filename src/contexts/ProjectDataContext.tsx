/**
 * ProjectDataContext – single source of truth for all editable content.
 * Admin writes → Firestore → All users read (real-time sync).
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
  coverImage: string;
  galleryImages: string[];
  custom: boolean;
}

export interface JournalArticle {
  id: number;
  title: string;
  titleEN: string;
  date: string;
  category: string;
  categoryEN: string;
  image: string;
  excerpt: string;
  excerptEN: string;
  content: string;
  contentEN: string;
}

export interface ContactInfo {
  phone1: string;
  phone2: string;
  email: string;
  address: string;
  addressEN: string;
}

// ── Default projects ─────────────────────────────────────────────────────────
export const DEFAULT_PROJECTS: ProjectData[] = [
  { id: 1, title: 'The Saigon Mansion', titleEN: 'The Saigon Mansion', category: 'Villa', location: 'TP. Hồ Chí Minh', desc: 'Không gian sống đẳng cấp được lấy cảm hứng từ kiến trúc tân cổ điển châu Âu, mang đến vẻ đẹp vượt thời gian.', descEN: 'A timeless living space inspired by European neoclassical architecture.', coverImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80&fit=crop', galleryImages: [], custom: false },
  { id: 2, title: 'Hanoi Sky Penthouse', titleEN: 'Hanoi Sky Penthouse', category: 'Căn Hộ', location: 'Hà Nội', desc: 'Căn penthouse sang trọng với tầm nhìn toàn cảnh thành phố, nội thất được thiết kế theo phong cách Art Deco hiện đại.', descEN: 'A luxury penthouse with panoramic city views, designed in modern Art Deco style.', coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80&fit=crop', galleryImages: [], custom: false },
  { id: 3, title: 'The Gentleman Apartment', titleEN: 'The Gentleman Apartment', category: 'Nội Thất', location: 'Hà Nội', desc: 'Không gian nội thất tối giản nhưng đầy tinh tế, kết hợp giữa da thật, đá marble và gỗ óc chó cao cấp.', descEN: 'A minimalist yet refined interior combining genuine leather, marble and premium walnut wood.', coverImage: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80&fit=crop', galleryImages: [], custom: false },
  { id: 4, title: 'Coastal Pearl Villa', titleEN: 'Coastal Pearl Villa', category: 'Villa', location: 'Đà Nẵng', desc: 'Biệt thự ven biển với kiến trúc mở, hòa hợp hoàn toàn với thiên nhiên và ánh sáng tự nhiên tràn ngập.', descEN: 'A beachfront villa with open architecture, fully harmonized with nature and abundant natural light.', coverImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80&fit=crop', galleryImages: [], custom: false },
  { id: 5, title: 'The Zeit Penthouse', titleEN: 'The Zeit Penthouse', category: 'Căn Hộ', location: 'TP. Hồ Chí Minh', desc: 'Không gian nội thất là sự phản ánh lối sống và giá trị chia sẻ giữa chủ nhà và kiến trúc sư.', descEN: 'An interior space that reflects the shared lifestyle and values between the owner and architect.', coverImage: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80&fit=crop', galleryImages: [], custom: false },
  { id: 6, title: 'Dong Anh Heritage', titleEN: 'Dong Anh Heritage', category: 'Kiến Trúc', location: 'Hà Nội', desc: 'Công trình kiến trúc cổ điển Pháp được phục dựng và nâng tầm với nội thất hiện đại sang trọng bên trong.', descEN: 'A restored French classical building elevated with luxurious modern interiors within.', coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80&fit=crop', galleryImages: [], custom: false },
  { id: 7, title: 'Bamboo Zen Retreat', titleEN: 'Bamboo Zen Retreat', category: 'Villa', location: 'Đà Lạt', desc: 'Biệt thự nghỉ dưỡng hòa mình vào thiên nhiên, sử dụng vật liệu bản địa kết hợp công nghệ xây dựng hiện đại.', descEN: 'A resort villa immersed in nature, using local materials combined with modern construction technology.', coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80&fit=crop', galleryImages: [], custom: false },
  { id: 8, title: 'Empire Living Room', titleEN: 'Empire Living Room', category: 'Nội Thất', location: 'TP. Hồ Chí Minh', desc: 'Phòng khách theo phong cách Empire với đèn chùm pha lê, trần thạch cao trang trí và bộ sofa nhung cao cấp.', descEN: 'Empire-style living room with crystal chandelier, decorative plaster ceiling and premium velvet sofa.', coverImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80&fit=crop', galleryImages: [], custom: false },
  { id: 9, title: 'Crystal Tower', titleEN: 'Crystal Tower', category: 'Kiến Trúc', location: 'Hà Nội', desc: 'Tòa nhà văn phòng cao tầng với mặt dựng kính phản chiếu, biểu tượng của sự phát triển đô thị hiện đại.', descEN: 'A high-rise office tower with reflective glass facade, symbol of modern urban development.', coverImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80&fit=crop', galleryImages: [], custom: false },
];

export const DEFAULT_ARTICLES: JournalArticle[] = [
  { id: 1, title: 'Sự Trở Lại Của Vật Liệu Thô Mộc Trong Không Gian Đương Đại', titleEN: 'The Return of Raw Materials in Contemporary Spaces', date: '15 Tháng 10, 2023', category: 'Xu Hướng', categoryEN: 'Trends', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80&fit=crop', excerpt: 'Bê tông trần, gỗ tự nhiên và thép không gỉ không còn bị giấu đi mà trở thành ngôn ngữ chính của kiến trúc hiện đại, tôn vinh vẻ đẹp nguyên bản.', excerptEN: 'Exposed concrete, natural wood and stainless steel are no longer hidden but have become the main language of modern architecture.', content: '', contentEN: '' },
  { id: 2, title: 'Ánh Sáng: Vật Liệu Vô Hình Định Hình Cảm Xúc', titleEN: 'Light: The Invisible Material That Shapes Emotion', date: '02 Tháng 11, 2023', category: 'Góc Nhìn', categoryEN: 'Perspective', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80&fit=crop', excerpt: 'Cách chúng tôi sử dụng ánh sáng tự nhiên và nhân tạo để điêu khắc không gian, tạo ra những lớp lang cảm xúc khác nhau trong cùng một căn phòng.', excerptEN: 'How we use natural and artificial light to sculpt space, creating different emotional layers within the same room.', content: '', contentEN: '' },
  { id: 3, title: 'Kiến Trúc Bền Vững: Hơn Cả Một Xu Hướng', titleEN: 'Sustainable Architecture: More Than a Trend', date: '28 Tháng 11, 2023', category: 'Phát Triển Bền Vững', categoryEN: 'Sustainability', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80&fit=crop', excerpt: 'Tích hợp các giải pháp năng lượng xanh và vật liệu tái chế vào thiết kế cao cấp mà không làm giảm đi sự sang trọng và tinh tế.', excerptEN: 'Integrating green energy solutions and recycled materials into premium design without sacrificing luxury and elegance.', content: '', contentEN: '' },
];

export const DEFAULT_CONTACT: ContactInfo = {
  phone1: '+84 989 942 555',
  phone2: '+84 908 666 622',
  email: 'cskh.vietdesign@gmail.com',
  address: 'C37 Bắc Hà Tower, Tố Hữu, Hà Đông, Hà Nội',
  addressEN: 'C37 Bac Ha Tower, To Huu, Ha Dong, Hanoi',
};

interface ProjectDataCtx {
  // Projects
  projects: ProjectData[];
  addProject: (p: ProjectData) => Promise<void>;
  updateProject: (p: ProjectData) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  // Hero
  heroImage: string | null;
  heroTitle: string;
  heroSubtitle: string;
  setHeroImage: (v: string | null) => Promise<void>;
  setHeroTitle: (v: string) => Promise<void>;
  setHeroSubtitle: (v: string) => Promise<void>;
  // Journal
  articles: JournalArticle[];
  addArticle: (a: JournalArticle) => Promise<void>;
  updateArticle: (a: JournalArticle) => Promise<void>;
  deleteArticle: (id: number) => Promise<void>;
  // Contact
  contactInfo: ContactInfo;
  setContactInfo: (c: ContactInfo) => Promise<void>;
  // Meta
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
  const [articles, setArticles] = useState<JournalArticle[]>(DEFAULT_ARTICLES);
  const [contactInfo, setContactInfoState] = useState<ContactInfo>(DEFAULT_CONTACT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Settings (home hero + contact)
    const unsubSettings = onSnapshot(doc(db, 'settings', 'home'), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setHeroImageState(d.heroImage ?? null);
        setHeroTitleState(d.heroTitle ?? 'VIETDESIGN');
        setHeroSubtitleState(d.heroSubtitle ?? 'Kiến Trúc & Nội Thất Đẳng Cấp');
      } else {
        setDoc(doc(db, 'settings', 'home'), { heroImage: null, heroTitle: 'VIETDESIGN', heroSubtitle: 'Kiến Trúc & Nội Thất Đẳng Cấp' });
      }
    });

    const unsubContact = onSnapshot(doc(db, 'settings', 'contact'), (snap) => {
      if (snap.exists()) {
        setContactInfoState(snap.data() as ContactInfo);
      } else {
        setDoc(doc(db, 'settings', 'contact'), DEFAULT_CONTACT);
      }
    });

    // Projects
    const unsubProjects = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const fetched: ProjectData[] = [];
      snapshot.forEach(d => fetched.push({ id: Number(d.id), ...d.data() } as ProjectData));
      if (fetched.length > 0) {
        setProjects(fetched.sort((a, b) => a.id - b.id));
      } else {
        DEFAULT_PROJECTS.forEach(p => setDoc(doc(db, 'projects', p.id.toString()), p));
        setProjects(DEFAULT_PROJECTS);
      }
      setLoading(false);
    });

    // Journal articles
    const unsubArticles = onSnapshot(collection(db, 'journal'), (snapshot) => {
      const fetched: JournalArticle[] = [];
      snapshot.forEach(d => fetched.push({ id: Number(d.id), ...d.data() } as JournalArticle));
      if (fetched.length > 0) {
        setArticles(fetched.sort((a, b) => b.id - a.id));
      } else {
        DEFAULT_ARTICLES.forEach(a => setDoc(doc(db, 'journal', a.id.toString()), a));
        setArticles(DEFAULT_ARTICLES);
      }
    });

    return () => { unsubSettings(); unsubContact(); unsubProjects(); unsubArticles(); };
  }, []);

  // ── Hero ─────────────────────────────────────────────────────────────────
  const saveSettings = async (data: any) => setDoc(doc(db, 'settings', 'home'), data, { merge: true });
  const setHeroImage = async (v: string | null) => {
    if (v?.startsWith('data:image/')) v = await uploadImageIfBase64(v, `settings/heroImage_${Date.now()}`);
    await saveSettings({ heroImage: v });
  };
  const setHeroTitle = async (v: string) => saveSettings({ heroTitle: v });
  const setHeroSubtitle = async (v: string) => saveSettings({ heroSubtitle: v });

  // ── Projects ─────────────────────────────────────────────────────────────
  const addProject = async (p: ProjectData) => {
    try {
      p.coverImage = await uploadImageIfBase64(p.coverImage, `projects/${p.id}/cover`);
      for (let i = 0; i < p.galleryImages.length; i++)
        p.galleryImages[i] = await uploadImageIfBase64(p.galleryImages[i], `projects/${p.id}/gallery_${Date.now()}_${i}`);
      await setDoc(doc(db, 'projects', p.id.toString()), p);
    } catch (e) { console.error('Error adding project', e); }
  };
  const updateProject = async (p: ProjectData) => {
    try {
      p.coverImage = await uploadImageIfBase64(p.coverImage, `projects/${p.id}/cover`);
      for (let i = 0; i < p.galleryImages.length; i++)
        p.galleryImages[i] = await uploadImageIfBase64(p.galleryImages[i], `projects/${p.id}/gallery_${Date.now()}_${i}`);
      await setDoc(doc(db, 'projects', p.id.toString()), p);
    } catch (e) { console.error('Error updating project', e); }
  };
  const deleteProject = async (id: number) => {
    try { await deleteDoc(doc(db, 'projects', id.toString())); }
    catch (e) { console.error('Error deleting project', e); }
  };

  // ── Journal ──────────────────────────────────────────────────────────────
  const addArticle = async (a: JournalArticle) => {
    try {
      a.image = await uploadImageIfBase64(a.image, `journal/${a.id}/cover`);
      await setDoc(doc(db, 'journal', a.id.toString()), a);
    } catch (e) { console.error('Error adding article', e); }
  };
  const updateArticle = async (a: JournalArticle) => {
    try {
      a.image = await uploadImageIfBase64(a.image, `journal/${a.id}/cover`);
      await setDoc(doc(db, 'journal', a.id.toString()), a);
    } catch (e) { console.error('Error updating article', e); }
  };
  const deleteArticle = async (id: number) => {
    try { await deleteDoc(doc(db, 'journal', id.toString())); }
    catch (e) { console.error('Error deleting article', e); }
  };

  // ── Contact ──────────────────────────────────────────────────────────────
  const setContactInfo = async (c: ContactInfo) => {
    try { await setDoc(doc(db, 'settings', 'contact'), c, { merge: true }); }
    catch (e) { console.error('Error updating contact', e); }
  };

  return (
    <Ctx.Provider value={{
      projects, addProject, updateProject, deleteProject,
      heroImage, heroTitle, heroSubtitle, setHeroImage, setHeroTitle, setHeroSubtitle,
      articles, addArticle, updateArticle, deleteArticle,
      contactInfo, setContactInfo,
      loading,
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