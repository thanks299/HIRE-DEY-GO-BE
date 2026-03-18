# Sprint 8 & 9 — Integration Instructions

## 1. Install new packages

```bash
npm install cloudinary multer pdf-parse @anthropic-ai/sdk
```

## 2. Add to src/config/env.js

```js
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
export const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
```

## 3. Add to src/app.js

```js
import companyRoutes   from "./modules/company/company.routes.js";
import bookmarkRoutes  from "./modules/bookmarks/bookmark.routes.js";
import cvRoutes        from "./modules/cv/cv.routes.js";

// Register routes
app.use("/api/v1/companies",  companyRoutes);
app.use("/api/v1/bookmarks",  bookmarkRoutes);
app.use("/api/v1/cv",         cvRoutes);
```

## 4. Replace src/models/bookmark.model.js

Replace your existing bookmark.model.js with the new one from this sprint.
The new model adds `type`, `companyId`, and `candidateId` fields to support
company and candidate bookmarks alongside job bookmarks.

## 5. Add src/utils/cloudinary.js

Copy the cloudinary.js utility file into your src/utils/ folder.

## 6. Add to .env and Render environment

```
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
ANTHROPIC_API_KEY=
```

Get Cloudinary credentials at: https://cloudinary.com (free tier is fine)
Get Anthropic API key at: https://console.anthropic.com

## File structure after Sprint 8 & 9

src/
├── models/
│   └── bookmark.model.js          ← REPLACE existing
├── modules/
│   ├── company/
│   │   ├── company.routes.js      ← NEW
│   │   ├── company.controller.js  ← NEW
│   │   ├── company.service.js     ← NEW
│   │   └── company.validation.js  ← NEW
│   ├── bookmarks/
│   │   ├── bookmark.routes.js     ← NEW
│   │   ├── bookmark.controller.js ← NEW
│   │   └── bookmark.service.js    ← NEW
│   └── cv/
│       ├── cv.routes.js           ← NEW
│       ├── cv.controller.js       ← NEW
│       └── cv.service.js          ← NEW
└── utils/
    └── cloudinary.js              ← NEW
