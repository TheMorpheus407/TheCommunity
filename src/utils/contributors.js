/**
 * @fileoverview GitHub contributors and statistics fetching utilities.
 * @module utils/contributors
 */

/**
 * Fetches and parses contributors from GitHub repository issues.
 * @param {string} repo - Repository in format "owner/repo"
 * @returns {Promise<Array<{login: string, avatar_url: string, issue_count: number}>>} Array of contributor objects
 * @throws {Error} If the fetch fails or repo format is invalid
 */
export async function fetchContributors(repo) {
  // Validate repo format to prevent URL injection
  if (!repo || typeof repo !== 'string' || !/^[\w.-]+\/[\w.-]+$/.test(repo)) {
    throw new Error('Invalid repository format. Expected "owner/repo"');
  }

  const response = await fetch(`https://api.github.com/repos/${repo}/issues?state=all&per_page=100`);

  if (!response.ok) {
    throw new Error(`Failed to fetch contributors: ${response.status}`);
  }

  const issues = await response.json();
  const contributorMap = new Map();

  for (const issue of issues) {
    if (issue.user && issue.user.login) {
      const login = issue.user.login;
      if (contributorMap.has(login)) {
        contributorMap.get(login).issue_count++;
      } else {
        contributorMap.set(login, {
          login,
          avatar_url: issue.user.avatar_url,
          issue_count: 1
        });
      }
    }
  }

  return Array.from(contributorMap.values())
    .sort((a, b) => b.issue_count - a.issue_count);
}

/**
 * Fetches Claude-solved issues statistics.
 * @param {string} repo - Repository in format "owner/repo"
 * @returns {Promise<Array<Object>>} Array of issue statistics
 * @throws {Error} If the fetch fails or repo format is invalid
 */
export async function fetchStatistics(repo) {
  // Validate repo format to prevent URL injection
  if (!repo || typeof repo !== 'string' || !/^[\w.-]+\/[\w.-]+$/.test(repo)) {
    throw new Error('Invalid repository format. Expected "owner/repo"');
  }

  const response = await fetch(`https://api.github.com/repos/${repo}/issues?state=all&per_page=100&labels=claude`);

  if (!response.ok) {
    throw new Error(`Failed to fetch statistics: ${response.status}`);
  }

  const issues = await response.json();

  return issues.map(issue => ({
    number: issue.number,
    title: issue.title,
    state: issue.state,
    url: issue.html_url,
    created_at: issue.created_at,
    closed_at: issue.closed_at,
    labels: issue.labels.map(l => l.name)
  }));
}
