"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { apiService, type Project } from "@/services/api-service";
import { useNotification } from "@/contexts/notification-context";
import { Shield, AlertTriangle, CheckCircle, X } from "lucide-react";

export default function ProjectsContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showModerateModal, setShowModerateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [subcategories, setSubcategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [formData, setFormData] = useState({
    title: "",
    subcategory_id: "",
    description: "",
    funding_goal: 0,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    status: "active",
    user_id: "1", // Default user ID
    current_amount: 0,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModerating, setIsModerating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const { showNotification } = useNotification();

  // Fetch projects and categories
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const params: Record<string, string> = {
        page: currentPage.toString(),
        limit: limit.toString(),
      };

      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;

      let projectsData: Project[] = [];
      let categoriesData: {
        id: string;
        name: string;
        subcategories?: { id: string; name: string }[];
      }[] = [];

      try {
        projectsData = await apiService.getProjects(params);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        showNotification(
          "warning",
          "Using mock project data due to API connection issues."
        );
      }

      try {
        categoriesData = await apiService.getCategories();
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        showNotification(
          "warning",
          "Using mock category data due to API connection issues."
        );
      }

      setProjects(projectsData);

      const cats = categoriesData.map((category) => ({
        value: category.id,
        label: category.name,
      }));
      setCategories(cats);

      const subCats: { value: string; label: string; parentId: string }[] = [];
      categoriesData.forEach((category) => {
        (category.subcategories ?? []).forEach((sub) => {
          subCats.push({
            value: sub.id,
            label: `${category.name} - ${sub.name}`,
            parentId: category.id,
          });
        });
      });
      setSubcategories(subCats);

      setTotalPages(Math.max(1, Math.ceil(projectsData.length / limit)));
    } catch (error) {
      console.error("Failed to fetch data:", error);
      showNotification("error", "Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [showNotification, currentPage, limit, searchTerm, selectedCategory]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseFloat(value) || 0 : value,
    }));
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = "Project title is required";
    if (!formData.subcategory_id)
      errors.subcategory_id = "Subcategory is required";
    if (!formData.description.trim())
      errors.description = "Description is required";
    if (formData.funding_goal <= 0)
      errors.funding_goal = "Funding goal must be greater than 0";
    if (!formData.deadline) errors.deadline = "Deadline is required";
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setIsSubmitting(true);
      const newProject = await apiService.createProject({
        title: formData.title,
        subcategory_id: formData.subcategory_id,
        description: formData.description,
        funding_goal: formData.funding_goal,
        deadline: new Date(formData.deadline).toISOString(),
        status: formData.status,
        user_id: formData.user_id,
        current_amount: formData.current_amount,
      });

      // Add the new project to the list
      setProjects((prev) => [newProject, ...prev]);
      setShowModal(false);
      showNotification("success", "Project created successfully!");

      // Reset form data
      setFormData({
        title: "",
        subcategory_id: "",
        description: "",
        funding_goal: 0,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        status: "active",
        user_id: "1",
        current_amount: 0,
      });
    } catch (error) {
      console.error("Failed to create project:", error);
      showNotification("error", "Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle moderation
  const handleModerate = (project: Project) => {
    setSelectedProject(project);
    setShowModerateModal(true);
  };

  // Handle moderation action
  const handleModerateAction = async (action: string) => {
    if (!selectedProject) return;

    try {
      setIsModerating(true);
      const updatedProject = await apiService.moderateProject(
        selectedProject.id,
        action
      );

      // Update the project in the list
      setProjects((prev) =>
        prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
      );

      setShowModerateModal(false);
      showNotification(
        "success",
        `Project ${
          action === "approve"
            ? "approved"
            : action === "reject"
            ? "rejected"
            : "suspended"
        } successfully!`
      );
    } catch (error) {
      console.error(`Failed to ${action} project:`, error);
      showNotification(
        "error",
        `Failed to ${action} project. Please try again.`
      );
    } finally {
      setIsModerating(false);
      setSelectedProject(null);
    }
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle category filter
  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  // Handle status filter
  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Filter projects based on search term, category, and status
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = searchTerm
      ? project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesCategory = selectedCategory
      ? project.subcategory_id === selectedCategory
      : true;
    const matchesStatus = selectedStatus
      ? project.status === selectedStatus
      : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Create Project
        </button>
      </div>

      {/* Search and filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search projects..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryFilter}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            value={selectedStatus}
            onChange={handleStatusFilter}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Projects table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Project
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Creator
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Funding
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Progress
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center">
                    <svg
                      className="animate-spin h-5 w-5 text-green-500 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Loading projects...
                  </div>
                </td>
              </tr>
            ) : filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No projects found.
                </td>
              </tr>
            ) : (
              filteredProjects.map((project) => (
                <tr key={project.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {project.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {project.description?.substring(0, 50)}
                          {project.description &&
                          project.description.length > 50
                            ? "..."
                            : ""}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {project.creator}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {subcategories.find(
                        (sub) => sub.value === project.subcategory_id
                      )?.label ||
                        project.category ||
                        "Unknown"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${project.current_amount?.toLocaleString()} / $
                      {project.funding_goal?.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            ((project.current_amount || 0) /
                              (project.funding_goal || 1)) *
                              100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {Math.min(
                        100,
                        Math.round(
                          ((project.current_amount || 0) /
                            (project.funding_goal || 1)) *
                            100
                        )
                      )}
                      %
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        project.status === "active"
                          ? "bg-green-100 text-green-800"
                          : project.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : project.status === "failed"
                          ? "bg-red-100 text-red-800"
                          : project.status === "suspended"
                          ? "bg-orange-100 text-orange-800"
                          : project.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      onClick={() => {
                        // View project details
                        showNotification(
                          "info",
                          `Viewing details for ${project.title}`
                        );
                      }}
                    >
                      View
                    </button>
                    <button
                      className="text-green-600 hover:text-green-900 mr-3"
                      onClick={() => {
                        // Edit project
                        showNotification("info", `Editing ${project.title}`);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-purple-600 hover:text-purple-900 mr-3"
                      onClick={() => handleModerate(project)}
                    >
                      <Shield className="h-4 w-4 inline mr-1" />
                      Moderate
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => {
                        // Delete project
                        showNotification(
                          "warning",
                          `Are you sure you want to delete ${project.title}?`
                        );
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{filteredProjects.length}</span>{" "}
          projects
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded-md ${
                currentPage === page
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3
                        className="text-lg leading-6 font-medium text-gray-900"
                        id="modal-headline"
                      >
                        Create New Project
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Project Title
                          </label>
                          <input
                            type="text"
                            name="title"
                            id="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full px-3 py-2 border ${
                              formErrors.title
                                ? "border-red-300"
                                : "border-gray-300"
                            } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                          />
                          {formErrors.title && (
                            <p className="mt-1 text-sm text-red-600">
                              {formErrors.title}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="subcategory_id"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Subcategory
                          </label>
                          <select
                            name="subcategory_id"
                            id="subcategory_id"
                            value={formData.subcategory_id}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full px-3 py-2 border ${
                              formErrors.subcategory_id
                                ? "border-red-300"
                                : "border-gray-300"
                            } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                          >
                            <option value="">Select a subcategory</option>
                            {subcategories.map((subcategory) => (
                              <option
                                key={subcategory.value}
                                value={subcategory.value}
                              >
                                {subcategory.label}
                              </option>
                            ))}
                          </select>
                          {formErrors.subcategory_id && (
                            <p className="mt-1 text-sm text-red-600">
                              {formErrors.subcategory_id}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Description
                          </label>
                          <textarea
                            name="description"
                            id="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full px-3 py-2 border ${
                              formErrors.description
                                ? "border-red-300"
                                : "border-gray-300"
                            } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                          ></textarea>
                          {formErrors.description && (
                            <p className="mt-1 text-sm text-red-600">
                              {formErrors.description}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="funding_goal"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Funding Goal ($)
                          </label>
                          <input
                            type="number"
                            name="funding_goal"
                            id="funding_goal"
                            min="0"
                            step="0.01"
                            value={formData.funding_goal}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full px-3 py-2 border ${
                              formErrors.funding_goal
                                ? "border-red-300"
                                : "border-gray-300"
                            } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                          />
                          {formErrors.funding_goal && (
                            <p className="mt-1 text-sm text-red-600">
                              {formErrors.funding_goal}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="deadline"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Deadline
                          </label>
                          <input
                            type="date"
                            name="deadline"
                            id="deadline"
                            value={formData.deadline}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full px-3 py-2 border ${
                              formErrors.deadline
                                ? "border-red-300"
                                : "border-gray-300"
                            } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                          />
                          {formErrors.deadline && (
                            <p className="mt-1 text-sm text-red-600">
                              {formErrors.deadline}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="status"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Status
                          </label>
                          <select
                            name="status"
                            id="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                          >
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      "Create"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Moderation Modal */}
      {showModerateModal && selectedProject && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      Moderate Project
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        You are about to moderate the project "
                        {selectedProject.title}". Choose an action below:
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-col sm:space-y-4">
                  <div className="p-4 border rounded-md bg-gray-50">
                    <h4 className="font-medium text-gray-900">
                      Project Details
                    </h4>
                    <p className="mt-1 text-sm text-gray-600">
                      <strong>Creator:</strong> {selectedProject.creator}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      <strong>Current Status:</strong>{" "}
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          selectedProject.status === "active"
                            ? "bg-green-100 text-green-800"
                            : selectedProject.status === "completed"
                            ? "bg-blue-100 text-blue-800"
                            : selectedProject.status === "failed"
                            ? "bg-red-100 text-red-800"
                            : selectedProject.status === "suspended"
                            ? "bg-orange-100 text-orange-800"
                            : selectedProject.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {selectedProject.status}
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      <strong>Description:</strong>{" "}
                      {selectedProject.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => handleModerateAction("approve")}
                  disabled={isModerating}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => handleModerateAction("reject")}
                  disabled={isModerating}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => handleModerateAction("suspend")}
                  disabled={isModerating}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Suspend
                </button>
                <button
                  type="button"
                  onClick={() => setShowModerateModal(false)}
                  disabled={isModerating}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
