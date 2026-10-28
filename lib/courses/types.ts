export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type CourseCategory = {
  id: string;
  name: string;
};

export type CourseResource = {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  subject: string;
  difficulty: Difficulty;
  author?: string;
  coverFile?: string;
  pdfFile: string;
  pdfOriginalName: string;
  published: boolean;
  allowDownload: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type CoursesDatabase = {
  categories: CourseCategory[];
  courses: CourseResource[];
};

export type PublicCourse = Omit<CourseResource, 'pdfFile' | 'coverFile' | 'createdBy'> & {
  hasCover: boolean;
};
