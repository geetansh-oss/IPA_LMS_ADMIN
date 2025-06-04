import { createContext, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "../utils/apiHandler";


const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const queryClient = useQueryClient();

  // Add chapter
  const addChapter = useMutation({
    mutationFn: async ({ newChapter, token }) => {
      return await apiService({
        method: "POST",
        endpoint: "/addChapter",
        token: token,
        data: newChapter,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["chapters", variables.CourseId]);
    },
  });

  // Update chapter
  const updateChapter = useMutation({
    mutationFn: async ({ courseId, updatedChapter, token }) => {
      return await apiService({
        method: "PUT",
        endpoint: `/updateChapter/${courseId}`,
        token: token,
        data: updatedChapter,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["chapters", variables.courseId]);
    },
  });

  // Delete chapter
  const deleteChapter = useMutation({
    mutationFn: async ({ chapterId, token }) => {
      return await apiService({
        method: "DELETE",
        endpoint: `/deleteChapter/${chapterId}`,
        token: token,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["chapters", variables.courseId]);
    },
  });

  const contextValue = useMemo(() => ({
    addChapter: {
      mutateAsync: addChapter.mutateAsync,
      isLoading: addChapter.isLoading,
      isError: addChapter.isError,
      error: addChapter.error,
    },
    updateChapter: {
      mutateAsync: updateChapter.mutateAsync,
      isLoading: updateChapter.isLoading,
      isError: updateChapter.isError,
      error: updateChapter.error,
    },
    deleteChapter: {
      mutateAsync: deleteChapter.mutateAsync,
      isLoading: deleteChapter.isLoading,
      isError: deleteChapter.isError,
      error: deleteChapter.error,
    },
  }), [
    addChapter.mutateAsync, addChapter.isLoading, addChapter.isError, addChapter.error,
    updateChapter.mutateAsync, updateChapter.isLoading, updateChapter.isError, updateChapter.error,
    deleteChapter.mutateAsync, deleteChapter.isLoading, deleteChapter.isError, deleteChapter.error,
  ]);

  return (
    <CourseContext.Provider value={contextValue}>
      {children}
    </CourseContext.Provider>
  );
};

CourseProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCourse = () => useContext(CourseContext);
