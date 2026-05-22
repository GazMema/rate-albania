# Vlereso

Vlereso is a Firebase-first PWA for verified public reputation in Albania. Users can discover, create, rate and rank public-facing entities such as businesses, hospitals, banks, schools, municipalities, restaurants and services.

The MVP focuses on one promise: GPS-verified ratings that feel more trustworthy than random social comments.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Firebase Auth with Google provider
- Cloud Firestore
- Firebase App Hosting for Next.js deployment
- Firebase App Check with reCAPTCHA Enterprise
- Firestore geohash-based geoqueries through `geofire-common`
- PWA manifest and service worker

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Firebase Setup

1. Create or use the Firebase project `rate-albania`.
2. Enable Authentication > Sign-in method > Google.
3. Create a Cloud Firestore database.
4. Register the web app and copy the SDK values into `.env.local`.
5. Enable App Check for the web app with reCAPTCHA Enterprise and set `NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY`.
6. Deploy Firestore rules and indexes:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

7. Seed initial entities with Application Default Credentials or a service account:

```bash
FIREBASE_PROJECT_ID=rate-albania npm run seed:firestore
# or
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json npm run seed:firestore
```

8. Deploy the Next.js app with Firebase App Hosting. This is the Firebase path intended for full-stack Next.js apps; classic Firebase Hosting can remain useful for static assets and redirects.

## Collections

- `users`
- `devices`
- `entities`
- `ratings`
- `deviceEntityRatings`
- `ratingCategoryScores`
- `entityDailyStats`
- `reviewReports`
- `entityClaims`
- `entityEdits`
- `auditLogs`

## Security Notes

- Firebase config values are public client identifiers, but Firestore rules and App Check protect backend access.
- Do not put service account JSON or Admin SDK credentials in the browser app.
- Ratings are one document per `entityId_userId`.
- Device anti-spam is tracked with `deviceEntityRatings`.
- Client-side GPS is useful for MVP friction, but a production trust layer should move final verification and score recalculation to Cloud Functions with App Check enforcement.

## Current MVP Pages

- `/`
- `/search`
- `/rankings`
- `/entities/[slug]`
- `/create`
- `/rate/[entityId]`
- `/city/[city]`
- `/category/[type]`
- `/me`
- `/admin`

## Albanian Copy

The UI is Albanian-first. English appears only in code and admin implementation notes.
