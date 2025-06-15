import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import debounce from "lodash/debounce";
import { useApi } from "../../hooks/useApi";
import { useAuth } from "../../Context/AuthContext";

const LIMIT = 8;

const Users = () => {
  const apiService = useApi();
  const { Token } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["users", page, searchTerm],
    queryFn: async () => {
      const response = await apiService({
        method: "GET",
        endpoint: `/getUsers?page=${page}&limit=${LIMIT}&search=${searchTerm}`,
        token: Token,
      });
      return response;
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  // Mutation for updating user status
  const statusMutation = useMutation({
    mutationFn: async ({ userId, newStatus }) => {
      const response = await apiService({
        method: "PUT",
        endpoint: `/updateUserStatus/${userId}`,
        data: { status: newStatus },
        token: Token
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  // Mutation for terminating user
  const terminateMutation = useMutation({
    mutationFn: async (userId) => {
      const response = await apiService({
        method: "DELETE",
        endpoint: `/terminateUser/${userId}`,
        token: Token,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  const total = data?.total || 0;
  const totalPages = Math.ceil(total / LIMIT);
  const users = data || [];

  const debouncedSearch = useCallback(
    debounce((value) => {
      setPage(1);
      setSearchTerm(value);
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleStatusToggle = (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    statusMutation.mutate({ userId, newStatus });
  };

  const handleTerminate = (userId) => {
    if (window.confirm("Are you sure you want to terminate this user?")) {
      terminateMutation.mutate(userId);
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    if (status === "active") {
      return `${baseClasses} bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300`;
    }
    if (status === "suspended") {
      return `${baseClasses} bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300`;
    }
    return `${baseClasses} bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300`;
  };

  return (
    <div className="w-full mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md dark:shadow-gray-900/20">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Users Management</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users..."
          onChange={handleSearchChange}
          className="w-full max-w-md p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                   placeholder-gray-500 dark:placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </div>

      {(() => {
        if (isLoading) {
          return (
            <div className="w-full flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
            </div>
          );
        }

        if (error) {
          return (
            <div className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400">Error: {error.message}</p>
            </div>
          );
        }

        if (users.length === 0) {
          return (
            <div className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">No users found.</p>
            </div>
          );
        }

        return (
          <>
            <div className="w-full rounded-lg shadow-lg dark:shadow-gray-900/20 overflow-hidden border dark:border-gray-700">
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Courses Enrolled
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadge(user.status)}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {user.myCourses?.length || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleStatusToggle(user._id, user.status)}
                            disabled={statusMutation.isLoading}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50 ${
                              user.status === "active"
                                ? "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/50"
                                : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50"
                            }`}
                          >
                            {statusMutation.isLoading ? "..." :
                              user.status === "active" ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            onClick={() => handleTerminate(user._id)}
                            disabled={terminateMutation.isLoading}
                            className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 
                                     hover:bg-red-200 dark:hover:bg-red-900/50 rounded text-sm font-medium 
                                     transition-colors disabled:opacity-50"
                          >
                            {terminateMutation.isLoading ? "..." : "Terminate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {isFetching && (
                <div className="w-full bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800 px-6 py-2">
                  <p className="text-blue-600 dark:text-blue-400 text-sm">Updating...</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="w-full mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing {users.length} of {total} users
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
                           rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 
                           hover:bg-gray-50 dark:hover:bg-gray-700 
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Page {page} of {totalPages || 1}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
                           rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 
                           hover:bg-gray-50 dark:hover:bg-gray-700 
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
};

export default Users;