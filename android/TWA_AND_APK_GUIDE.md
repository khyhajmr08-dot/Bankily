# Direct Android APK & Free Web/PWA Hosting Guide (Zero Google Play & Zero Billing)

This project provides **both**:
1. **Native Kotlin + Jetpack Compose Android Project (`android/`)** — complete Gradle project (`applicationId = "com.mauritop.transfer"`, `app_name = "بنكيلي"`, launcher icons `mipmap-*`, `adjustPan` keyboard handling) ready to compile into a directly installable `.apk` **without a Google Play Developer account**.
2. **Installable Standalone Web App / PWA (`src/` + `dist/`)** — ready to install via Chrome on Android (`manifest.webmanifest` + Service Worker) and exportable to any **$0 free static host**.

---

## Option 1: Build a Direct Installable `.apk` (No Google Play Account Required)

> Note: The AI Studio container does not include JDK / Gradle / Android SDK (`java` / `gradle` are absent in this Linux runtime), so `.apk` compilation runs on your computer or free GitHub Actions.

### Method A — Free Automated Cloud Build (No Android Studio Needed)
1. Download `bankily-android-project.zip` from `/downloads/bankily-android-project.zip` (or copy the `android/` folder).
2. Extract and push its contents to a **free GitHub repository** (includes `.github/workflows/build-apk.yml`).
3. Open **Actions -> Build Android APK** on GitHub and click **Run workflow**.
4. Download the generated `bankily-debug-apk` (`app-debug.apk`) artifact directly onto your Android phone and tap it to install (allow "Install unknown apps" once).

### Method B — Local Android Studio or Gradle CLI
1. Open the `android/` directory in **Android Studio** (or install JDK 17 + Gradle 8.9 + Android SDK Platform 35).
2. Build directly installable signed debug APK:
   ```bash
   cd android
   gradle assembleDebug
   ```
   Output APK path: `android/app/build/outputs/apk/debug/app-debug.apk`.
3. Transfer `app-debug.apk` to any Android phone and install directly without Google Play.

---

## Option 2: Free HTTPS Hosting for Direct PWA Installation (Zero Billing)

Why Chrome blocks PWA install inside the AI Studio preview pane:
- The preview runs inside a cross-origin `<iframe>` on `aistudio.google.com`, where Chrome disables `beforeinstallprompt`.
- AI Studio's built-in "Deploy to Cloud Run" prompt asks for Cloud Billing.

To host `dist/` on a **100% free HTTPS link without billing or credit card** so anyone can install directly from Android Chrome:
1. Build static assets:
   ```bash
   npm run build
   ```
2. Upload the generated `dist/` folder to any free static host:
   - **Cloudflare Pages** (`npx wrangler pages deploy dist` — free tier, no credit card)
   - **Netlify Drop** (`app.netlify.com/drop` — drag & drop `dist/`, instant HTTPS URL)
   - **GitHub Pages** (push `dist/` to `gh-pages` branch, instant free HTTPS URL)
3. Open that HTTPS URL directly in **Chrome on Android** -> tap **تثبيت التطبيق** -> Chrome installs `بنكيلي` onto your home screen as a standalone fullscreen app.
