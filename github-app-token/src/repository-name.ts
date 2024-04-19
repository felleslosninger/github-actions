export function getRepositoryName(
  repository: string,
  fallBackRepository: string
): string {
  if (!repository || repository.length === 0) {
    return fallBackRepository;
  }

  const parts = repository.split("/");

  if (parts.length === 1) {
    return parts[0];
  } else if (parts.length === 2) {
    // If both owner and name are provided, extract name
    return parts[1];
  } else {
    throw new Error(
      "Invalid repository name format. Use <owner>/<name> of <name> format."
    );
  }
}
