import { ProjectFile } from 'utils/customTypes';

export const getLinkedTaskFiles = (
  taskId: string,
  projectFiles: ProjectFile[]
) =>
  projectFiles.filter((file: ProjectFile) =>
    file.linkedTasks?.includes(taskId)
  );

export const getAvailableProjectFiles = (
  taskId: string,
  projectFiles: ProjectFile[]
) =>
  projectFiles.filter(
    (file: ProjectFile) => !file.linkedTasks?.includes(taskId)
  );

export const getUpdatedProjectFiles: (
  taskId: string,
  fileId: string,
  projectFiles: ProjectFile[]
) => ProjectFile[] = (
  taskId: string,
  fileId: string,
  projectFiles: ProjectFile[]
) => {
  const foundFileIndex = projectFiles.findIndex(
    (file: ProjectFile) => file.metadata.handle === fileId
  );
  if (foundFileIndex > -1) {
    const updatedFile = { ...projectFiles[foundFileIndex] };
    if (updatedFile?.linkedTasks?.includes(taskId)) {
      updatedFile.linkedTasks = updatedFile.linkedTasks.filter(
        (value) => value !== taskId
      );
    } else {
      updatedFile.linkedTasks = updatedFile?.linkedTasks?.concat(taskId);
    }
    const files = [
      ...projectFiles.slice(0, foundFileIndex),
      updatedFile,
      ...projectFiles.slice(foundFileIndex + 1),
    ];
    return files;
  }
  return [];
};
