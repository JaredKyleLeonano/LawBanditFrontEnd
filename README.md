Workspace: Collecting workspace information# LawBanditFrontEnd

A modern web application for law students to manage classes, syllabi, assignments, and notes. Built with **React**, **TypeScript**, **Vite**, **Supabase**, and **TailwindCSS**.

---

## Features

- **Authentication**: Email/password and Google OAuth via Supabase.
- **Dashboard**: Overview of classes, assignments, and recent notes.
- **Class Management**: Create, edit, and delete classes.
- **Syllabus Upload**: Upload and manage syllabi (PDF).
- **Assignment Calendar**: Full-featured calendar with assignment CRUD, drag-and-drop, and filtering by syllabus.
- **Notes**: Recent notes display and note management (UI).
- **Responsive UI**: Modern, accessible, and responsive design.

---

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 1. Clone the Repository

```sh
git clone https://github.com/yourusername/LawBanditFrontEnd.git
cd LawBanditFrontEnd
```

### 2. Install Dependencies

```sh
npm install
# or
yarn install
```

### 3. Environment Variables

Copy .env and set your Supabase and API credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=your_backend_api_url
```

### 4. Start the Development Server

```sh
npm run dev
# or
yarn dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
src/
  api/             # API clients for backend and Supabase
  components/      # React components (UI, forms, calendar, etc.)
  context/         # React context providers (auth, classes)
  pages/           # Page-level components (Dashboard, Authentication)
  types.ts         # Shared TypeScript types
  supabaseClient.ts# Supabase client setup
  main.tsx         # App entry point
  App.tsx          # Main router and layout
public/
  icons/           # logo icons
  fonts/           # Custom fonts
```

---

## Documentation

### Authentication

- Uses Supabase for user management.
- Google OAuth and email/password supported.
- Auth context: `AuthContext`

### Classes

- Create, edit, and delete classes.
- Classes context: `ClassesContext`

### Syllabi

- Upload PDF syllabi per class.
- Syllabus color is deterministic per syllabus.
- API: `uploadSyllabus`

### Assignments

- Assignments are displayed in a calendar ([FullCalendar](https://fullcalendar.io/)).
- CRUD operations for assignments.
- Filter by syllabus.

### Notes

- Recent notes are shown on the dashboard.
- Note management UI (future: CRUD).

---

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Lint code with ESLint

---

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push and open a Pull Request

---

## License

MIT

---

## Acknowledgements

- [Supabase](https://supabase.com/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [FullCalendar](https://fullcalendar.io/)
- [FontAwesome](https://fontawesome.com/)

---
