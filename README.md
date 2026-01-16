# Foundry VTT - React System Template (V13)

A boilerplate for creating systems in **Foundry VTT (v13+)** using **React 19**, **TypeScript**, and **Vite**.

This project bridges Foundry's **Application V2** API with React's, featuring a "Buffer State" architecture (Edit vs. Play Mode), decoupled logic, and styling.

---

## 📑 Contents

- [⚙️ Features](#-features)
  - [Core Architecture](#core-architecture)
  - ["Edit Mode" Engine](#edit-mode-engine)
  - [UX & Mechanics](#ux--mechanics)
- [📂 Project Structure](#-project-structure)
- [🛠️ Installation & Setup](#-installation--setup)
- [🔧 Customization](#-customization)
  - [Adding Attributes](#adding-attributes)
  - [Changing Validation](#changing-validation)

---

## ⚙️ Features

### Core Architecture
* **React & TypeScript:** Create sheets using React instead HTML / vanilla JavaScript.
* **Application V2 Integration:** Uses the latest [DocumentSheetV2](https://foundryvtt.com/api/classes/foundry.applications.api.DocumentSheetV2.html) API.
* **Component-Based:** Logic is separated into `sheets/` (UI), `utils/` (Logic), and `styles/` (SCSS).

### Edit Mode Engine
* **State Buffering:** Changes made in "Edit Mode" are stored in a local React state (`pendingChanges`) to avoid poping errors if there is any required fields (like Character Name).
* **Batch Saving:** Data is only sent to the database when the user clicks "Save", reducing network calls, but if needed there is a inline update function (utils/updateField.ts).
* **Validation:** Prevents saving if critical data (like Character Name) is missing, providing visual feedback.
* **Smart Inputs:** Inputs visually transform from "Text Labels" (Play Mode) to "Form Fields" (Edit Mode).

### UX & Mechanics
* **Contextual Image Interaction:**
  * **Play Mode:** Clicking the avatar opens a **Lightbox (ImagePopout)** to share with players and no editing allowed.
  * **Edit Mode:** Clicking the avatar opens the **FilePicker** to swap the image immediately (with local preview) all the elements in the sheet will be editing.
* **Advanced Roll Dialogs:**
  * Custom styled popups (Dark Theme) replacing standard Foundry prompts.
  * **Formula Parser:** Accepts complex strings in modifiers (e.g., `+2 -1d4` is automatically parsed to `+2 + -1d4`).
  * Dynamic Attribute list based on `constants.ts` configuration.

---

## 📂 Project Structure

```text
public/
│   (
│     ⚠️
│     These files are basic FoundryVTT system files. 
│     Check the official docs at (https://foundryvtt.com/article/system-development/)
│     for more details.
│   )
├── system.json # Foundry System base config file (very important)
├── template.json # Sheets Templates (for now just the actor sheet)
src/
├── sheets/
│   ├── ActorSheetV13.tsx          # Foundry App V2 Class (The "Mount Point")
│   └── ActorSheetRPGComponent.tsx # Main React UI (State, Validation, Render)
├── utils/
│   ├── constants.ts               # Config object (Label/Abbr definitions)
│   ├── createRollDialog.ts        # Promise-based Dialog UI generator
│   ├── rollDice.ts                # Orchestrator (Dialog -> Parser -> Roll)
│   └── updateField.ts             # Helper for direct updates
├── styles/
│   ├── main.scss                  # Global window layout & overrides
│   └── dialogs.scss               # Isolated styles for the Roll Dialog
└── main.ts                        # Entry point
```

## 🛠️ Installation & Setup

### Prerequisites
* Node.js (v18+)
* Foundry VTT (v12 or v13)

### 1. Clone/Fork/Download Files & Install
```bash
npm install
```

### 2. Development Mode (Hot Reload)
Run Vite in watch mode. This will compile your TypeScript/SCSS in real-time.
```bash
npm run dev
```

### 3. Build for Production
Creates the minified code in the `dist` folder.
```bash
npm run build
```

### 4. Paste in FoundryFiles
* Create a file on you Foundry /systems folder (must have the same name as system.json.id).
* Paste the content on your `dist` folder in this new folder created.

### Optional (only for development). Link to Foundry
You need to symlink the `dist` folder of this project to your Foundry VTT `Data/systems/your-system-name` folder.

**Windows (PowerShell):**
```powershell
New-Item -ItemType Junction -Path "C:\Path\To\Foundry\Data\systems\my-react-system" -Target ".\dist"
```

**Mac/Linux:**
```bash
ln -s ./dist /path/to/foundry/data/systems/my-react-system
```

**⚠️ Warning:** If you use this method all the changes saved will just be applied on the foundry after you update the page.

---

## 🔧 Customization

### Config Your System Properties
To change the config to your own system you need to change the file **`public/system.json`**.
Follow the rules and the pattern in the [Foundry Docs](https://foundryvtt.com/article/system-development/).

There is an example of edited **system.json**:
```json
  {
    "id": "your-system", // ⚠️ Folder name in Foundry must match this ID
    "title": "My First System (Testing)",
    "version": "0.0.1",
    "compatibility": {
      "minimum": "13",
      "verified": "13.351"
    },
    "authors": [
      {
        "name": "Thiago Cardoso",
        "email": "",
        "url": "https://github.com/thiagocardososlopes"
      }
    ],
    "esmodules": ["main.js"], // ⚠️ Don't change this (Generated by Vite)
    "styles": ["style.css"], // ⚠️ Don't change this (Generated by Vite)
    "template": "template.json",
    "background": "",
    "url": "",
    "manifest": "",
    "download": ""
  }
```

### Adding Attributes
To add a new stat (e.g., "Luck"), update **two** files:

1.  **`src/utils/constants.ts`**:
    Add the definition to the config object.
    ```typescript
    export const ATTRIBUTE_CONFIG = {
        // ... existing attributes
        luck: { label: "Sorte", abbr: "SOR" }
    };
    ```

2.  **`public/template.json`** (Foundry Config):
    Ensure the actor data model actually contains `system.attributes.luck.value`.

### Changing Validation
Modify the `validateChanges()` function in `ActorSheetRPGComponent.tsx`. Currently, it enforces that the Character Name cannot be empty or just spaces.

---

### Note
This is an initial project state. Future updates may bring new features to streamline React usage within Foundry. Try it out and feel free to contact me via email or Discord!
