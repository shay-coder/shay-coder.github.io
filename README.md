# Portfolio Site

A clean, professional portfolio built with plain HTML/CSS/JS (no build step, no
frameworks) — ready to host on GitHub Pages.

## 1. Publish it on GitHub Pages

1. Create a new repository on GitHub. If you name it `shay-coder.github.io`
   (i.e. `<your-username>.github.io`), it will be live at the root of that
   URL. Any other name works too — it'll just live at
   `https://shay-coder.github.io/<repo-name>/`.
2. Upload these files (`index.html`, `css/`, `js/`, `assets/`) to the
   repository — either via the GitHub web UI ("Add file → Upload files") or:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/shay-coder/<repo-name>.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages**, set **Source** to `main` branch,
   `/ (root)` folder, and save.
4. Your site will be live in a minute or two at the URL GitHub shows you.

## 2. What to personalize

Everything you'll want to change lives in a few obvious spots:

| What | Where |
|---|---|
| Name, title, hero text, bio | `index.html` — Hero and About sections |
| Skills / chips | `index.html` — Skills section (`<li class="chip">`) |
| **Projects** | `js/script.js` — the `PROJECTS` array at the top |
| Email / LinkedIn / socials | `index.html` — Contact section |
| Resume link | Add a PDF to `assets/resume.pdf` (the button in the hero already points there) |
| Colors, fonts, spacing | `css/style.css` — the `:root { }` block at the top |

## 3. Adding or changing projects

Open `js/script.js` and edit the `PROJECTS` array. Each project is an object:

```js
{
  title: "Project Name",
  desc: "One or two sentence description.",
  tags: ["Python", "Machine Learning"],
  repo: "https://github.com/you/repo",
  demo: ""   // optional live demo link, or leave as ""
}
```

The filter buttons above the project grid (`All`, `Python`, `C++`, etc.) are
generated **automatically** from whatever tags you use — you never have to
touch the HTML to add a new language or category. Just add the tag to a
project's `tags` array and a matching filter button appears.

> **Two links to fix:** the "Network Intrusion Detection" and "Language
> Identifier" entries currently link to your GitHub profile as a
> placeholder, since I couldn't confirm the exact repo URLs. Open
> `js/script.js` and update their `repo` fields to the real repository
> links.

## 4. Notes

- No build tools or dependencies — just static files, so it works with
  GitHub Pages out of the box.
- Fonts (Space Grotesk, Inter, IBM Plex Mono) load from Google Fonts via a
  CDN link in `index.html`.
- The site is responsive and respects `prefers-reduced-motion`.
