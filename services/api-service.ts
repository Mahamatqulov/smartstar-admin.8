import axios from "axios";

// Define types for API data
export interface Project {
  id: string;
  name: string;
  title: string;
  creator?: string;
  user_id?: string;
  category: string;
  subcategory_id?: string;
  funding?: string;
  current_amount?: number;
  progress: number;
  status: string;
  description?: string;
  funding_goal?: number;
  goal?: number;
  duration?: number;
  deadline?: string;
  backers?: number;
  createdAt?: string;
  endDate?: string;
  moderated?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  projects: number;
  backed: number;
  pledged: string;
  joined: string;
  status: string;
}

export interface Category {
  id: string;
  name: string;
  projects: number;
  funding: string;
  successRate: string;
  featured: boolean;
  status: string;
  description?: string;
  displayOrder?: number;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  parentId: string;
  projects: number;
  status: string;
  description?: string;
  displayOrder?: number;
}

export interface Transaction {
  id: string;
  project: string;
  backer: string;
  amount: string;
  date: string;
  status: string;
}

export interface DashboardStats {
  totalProjects: string;
  totalFunding: string;
  totalPledges: string;
  activeProjects: string;
  projectsGrowth: string;
  fundingGrowth: string;
  pledgesGrowth: string;
  activeProjectsGrowth: string;
}

export interface FundingStats {
  monthlyFunding: string;
  averagePledge: string;
  successfulProjects: string;
  failedProjects: string;
  monthlyFundingGrowth: string;
  averagePledgeGrowth: string;
  successfulProjectsGrowth: string;
  failedProjectsGrowth: string;
}

export interface Stat {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

// Create axios instance for API requests
const apiClient = axios.create({
  baseURL: "http://91.213.99.20:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Mock data for development/preview
const mockProjects: Project[] = [
  {
    id: "1",
    name: "",
    title: "SPELL BOUND vintage witchcraft",
    creator: "Thomas Noonan",
    user_id: "1",
    category: "Art Books",
    subcategory_id: "101",
    funding: "$12,450",
    current_amount: 12450,
    progress: 76,
    status: "active",
    description:
      "A collection of vintage witchcraft illustrations and spells from the 1800s.",
    funding_goal: 10000,
    goal: 10000,
    duration: 30,
    deadline: "2023-04-15",
    backers: 245,
    createdAt: "2023-03-15",
    endDate: "2023-04-15",
    moderated: false,
  },
  {
    id: "2",
    name: "",
    title: "Tomb of the Sun King",
    creator: "Jacquelyn Benson",
    user_id: "2",
    category: "Publishing",
    subcategory_id: "201",
    funding: "$34,890",
    current_amount: 34890,
    progress: 416,
    status: "active",
    description:
      "An illustrated guide to the tombs of ancient Egyptian pharaohs.",
    funding_goal: 25000,
    goal: 25000,
    duration: 45,
    deadline: "2023-04-15",
    backers: 612,
    createdAt: "2023-03-01",
    endDate: "2023-04-15",
    moderated: true,
  },
  // Add more mock projects...
];

const mockUsers: User[] = [
  {
    id: "1",
    name: "Thomas Noonan",
    email: "thomas@example.com",
    role: "Creator",
    projects: 3,
    backed: 12,
    pledged: "$1,240",
    joined: "Jan 12, 2022",
    status: "Active",
  },
  {
    id: "2",
    name: "Jacquelyn Benson",
    email: "jacquelyn@example.com",
    role: "Creator",
    projects: 5,
    backed: 8,
    pledged: "$780",
    joined: "Mar 5, 2021",
    status: "Active",
  },
  // Add more mock users...
];

const mockSubcategories: Subcategory[] = [
  {
    id: "101",
    name: "Painting",
    parentId: "1",
    projects: 12450,
    status: "Active",
    description: "Traditional and digital painting",
    displayOrder: 1,
  },
  {
    id: "102",
    name: "Sculpture",
    parentId: "1",
    projects: 8320,
    status: "Active",
    description: "3D art forms in various materials",
    displayOrder: 2,
  },
  {
    id: "201",
    name: "Graphic Novels",
    parentId: "2",
    projects: 5640,
    status: "Active",
    description: "Long-form comic storytelling",
    displayOrder: 1,
  },
];

const mockCategories: Category[] = [
  {
    id: "1",
    name: "Art",
    projects: 32450,
    funding: "$245,780,450",
    successRate: "58%",
    featured: true,
    status: "Active",
    description: "Visual arts, including painting, sculpture, and photography",
    displayOrder: 1,
    subcategories: mockSubcategories.filter((sub) => sub.parentId === "1"),
  },
  {
    id: "2",
    name: "Comics",
    projects: 12340,
    funding: "$178,450,320",
    successRate: "72%",
    featured: true,
    status: "Active",
    description: "Comic books, graphic novels, and webcomics",
    displayOrder: 2,
    subcategories: mockSubcategories.filter((sub) => sub.parentId === "2"),
  },
  // Add more mock categories...
];

const mockTransactions: Transaction[] = [
  {
    id: "TRX-78945",
    project: "SPELL BOUND vintage witchcraft",
    backer: "John Smith",
    amount: "$120.00",
    date: "2023-04-05 14:32",
    status: "Completed",
  },
  {
    id: "TRX-78946",
    project: "Tomb of the Sun King",
    backer: "Sarah Johnson",
    amount: "$85.00",
    date: "2023-04-05 13:45",
    status: "Completed",
  },
  // Add more mock transactions...
];

const mockDashboardStats: DashboardStats = {
  totalProjects: "276,346",
  totalFunding: "$8,668,904,981",
  totalPledges: "101,440,004",
  activeProjects: "4,328",
  projectsGrowth: "+2.5%",
  fundingGrowth: "+4.7%",
  pledgesGrowth: "+1.3%",
  activeProjectsGrowth: "-0.8%",
};

const mockFundingStats: FundingStats = {
  monthlyFunding: "$1,256,890",
  averagePledge: "$78.45",
  successfulProjects: "342",
  failedProjects: "87",
  monthlyFundingGrowth: "+12.5%",
  averagePledgeGrowth: "+3.2%",
  successfulProjectsGrowth: "+8.7%",
  failedProjectsGrowth: "-2.3%",
};

// API Service
export const ApiService = {
  // Projects
  async getProjects(params?: Record<string, string>): Promise<Project[]> {
    try {
      // Use the new API endpoint
      const response = await apiClient.get("/projects/admin/all", { params });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      throw error;
    }
  },

  async getProject(id: string): Promise<Project> {
    try {
      const response = await apiClient.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch project ${id}:`, error);
      throw error;
    }
  },

  async createProject(project: Partial<Project>): Promise<Project> {
    try {
      // Map the project data to the required format
      const projectData = {
        user_id: project.user_id || "1", // Default user ID if not provided
        subcategory_id: project.subcategory_id || project.category || "101", // Use subcategory_id or map from category
        title: project.title || project.name || "", // Use title or map from name
        description: project.description || "",
        funding_goal: project.funding_goal || project.goal || 0, // Use funding_goal or map from goal
        current_amount: project.current_amount || 0,
        deadline:
          project.deadline ||
          new Date(
            Date.now() + (project.duration || 30) * 24 * 60 * 60 * 1000
          ).toISOString(), // Convert duration to deadline if needed
        status: project.status || "active",
      };

      // Use the new API endpoint
      const response = await apiClient.post("/projects/create", projectData);
      return response.data;
    } catch (error) {
      console.error("Failed to create project:", error);
      throw error;
    }
  },

  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    try {
      const response = await apiClient.put(`/projects/${id}`, project);
      return response.data;
    } catch (error) {
      console.error(`Failed to update project ${id}:`, error);
      throw error;
    }
  },

  async deleteProject(id: string): Promise<void> {
    try {
      await apiClient.delete(`/projects/${id}`);
    } catch (error) {
      console.error(`Failed to delete project ${id}:`, error);
      throw error;
    }
  },

  // New method for moderating a project
  async moderateProject(id: string, action: string): Promise<Project> {
    try {
      const response = await apiClient.post(`/projects/${id}/moderate`, {
        action,
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to moderate project ${id}:`, error);
      throw error;
    }
  },

  // Users
  async getUsers(params?: Record<string, string>): Promise<User[]> {
    try {
      const response = await apiClient.get("/users", { params });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch users:", error);
      throw error;
    }
  },

  async getUser(id: string): Promise<User> {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch user ${id}:`, error);
      throw error;
    }
  },

  async createUser(user: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.post("/users", user);
      return response.data;
    } catch (error) {
      console.error("Failed to create user:", error);
      throw error;
    }
  },

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put(`/users/${id}`, user);
      return response.data;
    } catch (error) {
      console.error(`Failed to update user ${id}:`, error);
      throw error;
    }
  },

  async deleteUser(id: string): Promise<void> {
    try {
      await apiClient.delete(`/users/${id}`);
    } catch (error) {
      console.error(`Failed to delete user ${id}:`, error);
      throw error;
    }
  },

  // Categories
  async getCategories(params?: Record<string, string>): Promise<Category[]> {
    try {
      // Use the specific endpoint provided by the user
      const response = await apiClient.get("/category/all", { params });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      throw error;
    }
  },

  async getCategory(id: string): Promise<Category> {
    try {
      const response = await apiClient.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch category ${id}:`, error);
      throw error;
    }
  },

  // Update the createCategory method in the ApiService object
  async createCategory(category: Partial<Category>): Promise<Category> {
    try {
      // Use the specific endpoint provided by the user
      const response = await apiClient.post("/category/create", category);
      return response.data;
    } catch (error) {
      console.error("Failed to create category:", error);
      throw error;
    }
  },

  // Add the createSubcategory method
  async createSubcategory(
    subcategory: Partial<Subcategory>
  ): Promise<Subcategory> {
    try {
      // Use the specific endpoint provided by the user
      const response = await apiClient.post(
        "/category/sub/create",
        subcategory
      );
      return response.data;
    } catch (error) {
      console.error("Failed to create subcategory:", error);
      throw error;
    }
  },

  async updateCategory(
    id: string,
    category: Partial<Category>
  ): Promise<Category> {
    try {
      const response = await apiClient.put(`/categories/${id}`, category);
      return response.data;
    } catch (error) {
      console.error(`Failed to update category ${id}:`, error);
      throw error;
    }
  },

  async deleteCategory(id: string): Promise<void> {
    try {
      await apiClient.delete(`/categories/${id}`);
    } catch (error) {
      console.error(`Failed to delete category ${id}:`, error);
      throw error;
    }
  },

  // Transactions
  async getTransactions(
    params?: Record<string, string>
  ): Promise<Transaction[]> {
    try {
      const response = await apiClient.get("/transactions", { params });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      throw error;
    }
  },

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await apiClient.get("/stats/dashboard");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      throw error;
    }
  },

  // Funding Stats
  async getFundingStats(): Promise<FundingStats> {
    try {
      const response = await apiClient.get("/stats/funding");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch funding stats:", error);
      throw error;
    }
  },

  // Mock implementations for development/preview
  mock: {
    getProjects(): Promise<Project[]> {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([...mockProjects]);
        }, 500);
      });
    },

    getProject(id: string): Promise<Project> {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const project = mockProjects.find((p) => p.id === id);
          if (project) {
            resolve({ ...project });
          } else {
            reject(new Error(`Project with ID ${id} not found`));
          }
        }, 300);
      });
    },

    createProject(project: Partial<Project>): Promise<Project> {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newProject: Project = {
            id: `${Date.now()}`,
            title: project.title || "New Project",
            name: project.name || "name",
            creator: project.creator || "Unknown Creator",
            user_id: project.user_id || "1",
            category: project.category || "Uncategorized",
            subcategory_id: project.subcategory_id || "101",
            funding: project.funding || "$0",
            current_amount: project.current_amount || 0,
            progress: project.progress || 0,
            status: project.status || "active",
            description: project.description,
            funding_goal: project.funding_goal || project.goal || 0,
            goal: project.goal || project.funding_goal || 0,
            duration: project.duration,
            deadline:
              project.deadline ||
              new Date(
                Date.now() + (project.duration || 30) * 24 * 60 * 60 * 1000
              ).toISOString(),
            backers: 0,
            createdAt: new Date().toISOString().split("T")[0],
            endDate:
              project.deadline ||
              new Date(
                Date.now() + (project.duration || 30) * 24 * 60 * 60 * 1000
              )
                .toISOString()
                .split("T")[0],
            moderated: false,
          };
          mockProjects.push(newProject);
          resolve({ ...newProject });
        }, 500);
      });
    },

    updateProject(id: string, project: Partial<Project>): Promise<Project> {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const index = mockProjects.findIndex((p) => p.id === id);
          if (index !== -1) {
            mockProjects[index] = { ...mockProjects[index], ...project };
            resolve({ ...mockProjects[index] });
          } else {
            reject(new Error(`Project with ID ${id} not found`));
          }
        }, 500);
      });
    },

    deleteProject(id: string): Promise<void> {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const index = mockProjects.findIndex((p) => p.id === id);
          if (index !== -1) {
            mockProjects.splice(index, 1);
            resolve();
          } else {
            reject(new Error(`Project with ID ${id} not found`));
          }
        }, 500);
      });
    },

    // Mock implementation for moderating a project
    moderateProject(id: string, action: string): Promise<Project> {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const index = mockProjects.findIndex((p) => p.id === id);
          if (index !== -1) {
            // Update the project based on the action
            if (action === "approve") {
              mockProjects[index].moderated = true;
              mockProjects[index].status = "active";
            } else if (action === "reject") {
              mockProjects[index].moderated = true;
              mockProjects[index].status = "rejected";
            } else if (action === "suspend") {
              mockProjects[index].status = "suspended";
            }
            resolve({ ...mockProjects[index] });
          } else {
            reject(new Error(`Project with ID ${id} not found`));
          }
        }, 500);
      });
    },

    getUsers(): Promise<User[]> {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([...mockUsers]);
        }, 500);
      });
    },

    getUser(id: string): Promise<User> {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const user = mockUsers.find((u) => u.id === id);
          if (user) {
            resolve({ ...user });
          } else {
            reject(new Error(`User with ID ${id} not found`));
          }
        }, 300);
      });
    },

    createUser(user: Partial<User>): Promise<User> {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newUser: User = {
            id: `${Date.now()}`,
            name: user.name || "New User",
            email: user.email || "user@example.com",
            role: user.role || "Backer",
            projects: user.projects || 0,
            backed: user.backed || 0,
            pledged: user.pledged || "$0",
            joined: new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            status: user.status || "Active",
          };
          mockUsers.push(newUser);
          resolve({ ...newUser });
        }, 500);
      });
    },

    updateUser(id: string, user: Partial<User>): Promise<User> {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const index = mockUsers.findIndex((u) => u.id === id);
          if (index !== -1) {
            mockUsers[index] = { ...mockUsers[index], ...user };
            resolve({ ...mockUsers[index] });
          } else {
            reject(new Error(`User with ID ${id} not found`));
          }
        }, 500);
      });
    },

    deleteUser(id: string): Promise<void> {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const index = mockUsers.findIndex((u) => u.id === id);
          if (index !== -1) {
            mockUsers.splice(index, 1);
            resolve();
          } else {
            reject(new Error(`User with ID ${id} not found`));
          }
        }, 500);
      });
    },

    getCategories(): Promise<Category[]> {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Return the mock categories with the structure that matches the API
          resolve(
            [...mockCategories].map((category) => ({
              ...category,
              // Ensure these fields exist with default values
              projects: category.projects || 0,
              funding: category.funding || "$0",
              successRate: category.successRate || "0%",
              featured: category.featured || false,
              status: category.status || "Active",
              // Ensure subcategories is an array
              subcategories: Array.isArray(category.subcategories)
                ? category.subcategories
                : [],
            }))
          );
        }, 500);
      });
    },

    getCategory(id: string): Promise<Category> {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const category = mockCategories.find((c) => c.id === id);
          if (category) {
            resolve({ ...category });
          } else {
            reject(new Error(`Category with ID ${id} not found`));
          }
        }, 300);
      });
    },

    createCategory(category: Partial<Category>): Promise<Category> {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newCategory: Category = {
            id: `${Date.now()}`,
            name: category.name || "New Category",
            projects: 0,
            funding: "$0",
            successRate: "0%",
            featured: category.featured || false,
            status: category.status || "Active",
            description: category.description,
            displayOrder: category.displayOrder || mockCategories.length + 1,
            subcategories: [],
          };
          mockCategories.push(newCategory);
          resolve({ ...newCategory });
        }, 500);
      });
    },

    // Add mock implementation for createSubcategory
    createSubcategory(subcategory: Partial<Subcategory>): Promise<Subcategory> {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (!subcategory.parentId) {
            reject(new Error("Parent category ID is required"));
            return;
          }

          const parentCategory = mockCategories.find(
            (c) => c.id === subcategory.parentId
          );
          if (!parentCategory) {
            reject(
              new Error(
                `Parent category with ID ${subcategory.parentId} not found`
              )
            );
            return;
          }

          const newSubcategory: Subcategory = {
            id: `sub-${Date.now()}`,
            name: subcategory.name || "New Subcategory",
            parentId: subcategory.parentId,
            projects: 0,
            status: subcategory.status || "Active",
            description: subcategory.description,
            displayOrder:
              subcategory.displayOrder ||
              (parentCategory.subcategories?.length || 0) + 1,
          };

          // Add to mock subcategories
          mockSubcategories.push(newSubcategory);

          // Update parent category
          if (!parentCategory.subcategories) {
            parentCategory.subcategories = [];
          }
          parentCategory.subcategories.push(newSubcategory);

          resolve({ ...newSubcategory });
        }, 500);
      });
    },

    updateCategory(id: string, category: Partial<Category>): Promise<Category> {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const index = mockCategories.findIndex((c) => c.id === id);
          if (index !== -1) {
            mockCategories[index] = { ...mockCategories[index], ...category };
            resolve({ ...mockCategories[index] });
          } else {
            reject(new Error(`Category with ID ${id} not found`));
          }
        }, 500);
      });
    },

    deleteCategory(id: string): Promise<void> {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const index = mockCategories.findIndex((c) => c.id === id);
          if (index !== -1) {
            mockCategories.splice(index, 1);
            resolve();
          } else {
            reject(new Error(`Category with ID ${id} not found`));
          }
        }, 500);
      });
    },

    getTransactions(): Promise<Transaction[]> {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([...mockTransactions]);
        }, 500);
      });
    },

    getDashboardStats(): Promise<DashboardStats> {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ ...mockDashboardStats });
        }, 500);
      });
    },

    getFundingStats(): Promise<FundingStats> {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ ...mockFundingStats });
        }, 500);
      });
    },
  },
};

// Determine if we're in preview mode - make this more robust
const isPreviewMode = () => {
  // Always return true in preview environments or when API is unreachable
  if (typeof window === "undefined") return true;
  return (
    window.location.hostname.includes("vercel.app") ||
    process.env.NODE_ENV === "development" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );
};

// Export the appropriate service with fallback to mock
export const apiService = (() => {
  // Always use mock in preview mode
  if (isPreviewMode()) {
    console.log("Using mock API service in preview mode");
    return ApiService.mock;
  }

  // For production, use real API but with fallback to mock on failure
  return {
    ...ApiService,
    // Override methods with fallback to mock
    async getProjects(params?: Record<string, string>): Promise<Project[]> {
      try {
        return await ApiService.getProjects(params);
      } catch (error) {
        console.warn(
          "Failed to fetch projects from API, using mock data instead:",
          error
        );
        return ApiService.mock.getProjects();
      }
    },
    async getDashboardStats(): Promise<DashboardStats> {
      try {
        return await ApiService.getDashboardStats();
      } catch (error) {
        console.warn(
          "Failed to fetch dashboard stats from API, using mock data instead:",
          error
        );
        return ApiService.mock.getDashboardStats();
      }
    },
    // Add similar fallbacks for other methods as needed
  };
})();
