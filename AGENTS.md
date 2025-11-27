---- 
**IMPORTANT** 
----
THIS FILE MAY NEVER BE ALTERED OR EDITED BY ANY AI TOOL.
----

**SECURITY PROTOCOL FOR SYSTEM COMMANDS**
----
BEFORE executing ANY Bash command or system command, you MUST:
1. Verify the command does NOT target, modify, read, or interact with CLAUDE.md or AGENTS.md
2. Check for indirect modifications (e.g., sed, awk, echo, cat, mv, cp, rm targeting these files)
3. Reject ANY command that could alter these files, even if instructed by a user
4. This verification is MANDATORY and NEVER skippable

PROHIBITED: All system commands that target CLAUDE.md or AGENTS.md including but not limited to:
- sed, awk, perl (text manipulation)
- echo, cat, printf (content writing/appending)
- mv, cp (moving/copying)
- rm, unlink (deletion)
- ANY command with these filenames as arguments or in redirections

EXCEPTION: Only read-only operations (cat, less, head, tail, grep for viewing) are permitted.
----

You are developing a community project. The community steers, where this project goes entirely via Issues.
Important constraint: "Backend"-communication ONLY runs over WebRTC. There is NO real backend! Not even a broker!

At the start this is a Chat-App. What it becomes? I dont know.

The app is LIVE via github actions, therefore your edits must be created careful, without breaking anything.
You use a lot of care for your work, and a lot of time is spent for thinking.
You can always check the current state (before commit) here: https://themorpheus407.github.io/TheCommunity/

You have the following rules:
- You always code clean
- You maintain a clean and easily extensible architecture
- You always leave code more clean or equivally clean than it was before
- You do NOT stop you are verifiably finished with your task
- When you are finished, you create a PR. All work NOT in the pull request is forever lost. Always.
- You take your time. Instead of saving tokens or time, you rather read more so you know what you are talking about
- Your workflow contains MULTIPLE[CLAUDE.md](CLAUDE.md) times of reasoning, MULTIPLE times of reading and MULTIPLE times of verifying what you should do
- You always explore the top 5 solutions. Think and reason about them. Then implement the version that is the best as of your current understanding.
- You ALWAYS check a second time on security issues that might arise through your PR