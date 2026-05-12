const projects = [
  "get-release-notes",
  "write-to-influxdb",
  "github-app-token",
  "publish-release-notes",
  "validate-pull-request-title"
];

export default {
  "*.ts": filenames => {
    const commands = [];
    const projectFiles = {};

    // Prettier first – format before ESLint checks
    commands.push(`prettier --write ${filenames.join(" ")}`);

    for (const file of filenames) {
      const parts = file.split("/");
      if (parts.length > 1) {
        const project = parts[0];
        if (projects.includes(project)) {
          if (!projectFiles[project]) projectFiles[project] = [];
          projectFiles[project].push(file.substring(project.length + 1));
        }
      }
    }

    for (const [project, files] of Object.entries(projectFiles)) {
      commands.push(
        `cd ${project} && npx eslint --fix --cache --max-warnings 0 ${files.join(" ")}`
      );
    }

    return commands;
  }
};
