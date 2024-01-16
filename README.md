# Blisscord
A real time chat application built in TS using Next.js 14 technologies for fast and responsive real-time messaging.

## Technologies Used
- Framework = NextJS v14
```
    - "next": "14.0.4"
    - "react": "^18"
    - "react-dom": "^18"
    - "react-hook-form": "^7.49.2"
```
- Language = TypeScript v5
```
    - "typescript": "^5"
    - "@types/node": "^20"
    - "@types/react": "^18"
    - "@types/react-dom": "^18"
    - "autoprefixer": "^10.0.1"
    - "eslint": "^8"
    - "eslint-config-next": "14.0.4"
```
- Authentication = next-auth
```
    - "next-auth": "^4.24.5"
    - "next-auth/providers/google" // Google OAuth Integration
```
- Database = Upstash.com - Redis
```
    - "@next-auth/upstash-redis-adapter": "^3.0.4"
    - "@upstash/redis": "^1.27.1" // Database interface
    - "axios": "^1.6.4" // Fetch requests
    - "@hookform/resolvers": "^3.3.3" // Integrates Zod validation
    - "zod": "^3.22.4" // Input validation
```
- Styling = TailwindCSS
```
    - "tailwindcss": "^3.3.0"
    - "@tailwindcss/forms": "^0.5.7"
    - "postcss": "^8" // CSS Syntax transformation
    - "tailwind-merge": "^2.2.0"
    - "class-variance-authority": "^0.7.0" // Custom classes outside of Tailwind
    - "clsx": "^2.0.0",
```
- Front End Misc.
```
    - "react-hot-toast" // Global toast notifications
    - "lucide-react": "^0.300.0" // Global icons
```

## Current state of app architecture
![image](https://github.com/akatheduelist/blisscord/assets/52519668/6a6c898e-29a0-45a9-9b34-6a56238423ed)

View the full whiteboard PDF
[AppArchitecture_01.pdf](https://github.com/akatheduelist/blisscord/files/13952784/AppArchitecture_01.pdf)
