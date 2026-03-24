# AI Tools - IT Onboarding Guide

Step-by-step guide for IT to install and configure AI tools on a team member's workstation.

---

## Before You Start

Confirm the user has the following inboxes added to their Outlook:

1. **apps@pflugerarchitects.com** - shared inbox for tools
2. **Office shared inbox** (e.g. PAAustin@, PADallas@, etc.) - used for Claude sign-in

---

### Claude Desktop

Claude Desktop is the GUI app for conversational AI - used for writing, research, and analysis.

1. Download from [claude.com/download](https://claude.com/download)
2. IT runs the installer with **admin privileges**
3. Launch the app
4. Sign in with the **office-specific** Claude Teams account (see table below)
5. Verify the user appears under the Pfluger Teams organization
- **Online:** [claude.ai](https://claude.ai) - same office account sign-in


**Claude Office Logins:**

| Office | Email |
|--------|-------|
| Austin | PAAustin@pflugerarchitects.com |
| Dallas | PADallas@pflugerarchitects.com |
| San Antonio | PASanAntonio@pflugerarchitects.com |
| Houston | PAHouston@pflugerarchitects.com |
| Corpus Christi | PACorpus@pflugerarchitects.com |

Sign-in uses email verification (no password). Office users already have the shared inbox added to their Outlook, so they can approve the verification code themselves.

**Master Admin/Org Account:** software@pflugerarchitects.com - Only use this for R&B development work requiring heavy Claude Code bandwidth. Not for general use.

### Claude Code

Claude Code is a CLI tool for software development - used by R&B developers only.

1. Install Git: [git-scm.com/install](https://git-scm.com/install/)
2. Install GitHub Desktop: [docs.github.com/en/desktop/installing-and-authenticating-to-github-desktop/installing-github-desktop](https://docs.github.com/en/desktop/installing-and-authenticating-to-github-desktop/installing-github-desktop)
3. Install Node.js 18+: [nodejs.org/en/download](https://nodejs.org/en/download)
4. Install Claude Code ([docs](https://code.claude.com/docs/en/quickstart)) - open PowerShell and run:
   ```
   irm https://claude.ai/install.ps1 | iex
   ```
5. Run `claude` to launch and follow the authentication prompt
6. Sign in with the **office-specific** Claude Teams account (see table above)


### Magnific

AI image upscaling tool for enhancing renders and images.

- **URL:** [magnific.ai](https://magnific.ai)
- **Sign in:** apps@pflugerarchitects.com, email 2FA
- **2FA required:** Contact Austin Nguyen or IT to complete the 2FA step

### MidJourney

AI image generation for concept imagery and visualization.

- **URL:** [midjourney.com](https://midjourney.com)
- **Sign in:** apps@pflugerarchitects.com, email 2FA
- **2FA required:** Contact Austin Nguyen or IT to complete the 2FA step
- **Access:** Also available via Discord

### Google Gemini

AI platform with multiple tools for image generation, 3D, and video.

- **URL:** [gemini.google.com](https://gemini.google.com)
- **Sign in:** apps@pflugerarchitects.com, email 2FA

**Sub-tools available under Gemini:**

| Tool | Purpose |
|------|---------|
| Nano Banana | AI image generation |
| Genie 3 | 3D scene generation |
| Veo 3 | AI video generation |

### Figma

Design and prototyping tool for architecture and UI work.

- **URL:** [figma.com](https://www.figma.com)
- **Sign in:** apps@pflugerarchitects.com, email 2FA
- **Desktop app:** Download from [figma.com/downloads](https://www.figma.com/downloads/), IT runs the installer with **admin privileges**

### CapCut Pro

Video editing tool for project videos and presentations.

- **URL:** [capcut.com](https://capcut.com)
- **Sign in:** apps@pflugerarchitects.com, email 2FA
- **Desktop app:** Also available as a desktop install from the same URL if preferred

### Twinmotion

Real-time 3D visualization tool for architectural rendering.

1. Download from [twinmotion.com/download](https://www.twinmotion.com/download)
2. IT runs the installer with **admin privileges**
3. Launch the app
4. Sign in with **apps@pflugerarchitects.com**, email 2FA

### Ezra Revit Add-In

Custom AI assistant add-in for Autodesk Revit. Contact IT to install.

1. Navigate to `R:\RESEARCH AND BENCHMARKING\02_Resources\Installs`
2. Run **install-ezra.bat** with IT admin logged in
3. Launch **Revit 2025**
4. When prompted, click **Always Allow** to trust the add-in

### Pfluger R&B Repository

Pfluger Research and Benchmarking knowledgebase.

- **URL:** [repository.pflugerarchitects.com](https://repository.pflugerarchitects.com)
- **Sign in:** use Pfluger email, contact the R&B Team for a login.