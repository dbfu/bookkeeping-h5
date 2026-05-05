import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Family, Category } from '../types'

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  setAuth: (token: string, user: User) => void
  updateUser: (user: Partial<User>) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null,
      })),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
)

interface FamilyState {
  family: Family | null
  setFamily: (family: Family) => void
  clearFamily: () => void
}

export const useFamilyStore = create<FamilyState>()(
  persist(
    (set) => ({
      family: null,
      setFamily: (family) => set({ family }),
      clearFamily: () => set({ family: null }),
    }),
    {
      name: 'family-storage',
    }
  )
)

interface CategoryState {
  categories: Category[]
  setCategories: (categories: Category[]) => void
  addCategory: (category: Category) => void
  updateCategory: (id: number, data: Partial<Category>) => void
  removeCategory: (id: number) => void
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: [],
      setCategories: (categories) => set({ categories }),
      addCategory: (category) => set((state) => ({
        categories: [...state.categories, category],
      })),
      updateCategory: (id, data) => set((state) => ({
        categories: state.categories.map((c) =>
          c.id === id ? { ...c, ...data } : c
        ),
      })),
      removeCategory: (id) => set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      })),
    }),
    {
      name: 'category-storage',
    }
  )
)

// UI 状态（不需要持久化）
interface UIState {
  isLoading: boolean
  setLoading: (loading: boolean) => void
  toastMessage: string | null
  showToast: (message: string) => void
  hideToast: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
  toastMessage: null,
  showToast: (message) => set({ toastMessage: message }),
  hideToast: () => set({ toastMessage: null }),
}))
