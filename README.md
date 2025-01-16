## Jamjar

Frontend for a game jam site

## Things used

- Typescript (language)
- Next.js (web framework)
- Tailwind (css framework)
- Lucide (icons)
- Eslint (static code analysis)
- Framer motion (animations)
- React Toastify (toasts)

## Running for development

Prerequisites:
- node.js or equivalent

To start up the site locally for development you need to:

1. Go to a spot you want to be the parent folder for where the folder for Jamjar goes (e.g. navigate to it in terminal)
2. Clone the repository aka get a local copy of the files (e.g. by running `git clone https://github.com/Dare2Jam/Jamjar.git`)
3. Go into the folder you just cloned in (e.g. using `cd Jamjar`)
4. Install dependencies needed for the site (e.g. `npm i`)
5. Create a `.env` file in the folder which is used for environment variables. In this you would set NEXT_PUBLIC_MODE to either PROD or DEV depending on what backend data you want to load in (dev loads it from a locally running jamcore, PROD loads it from the production site)
```
NEXT_PUBLIC_MODE=DEV
```
6. Run the site using `npm run dev` which will start up a dev server that will hot reload as you make changes (most of the time)
7. Go to https://localhost:3000 (or another port if it says it started up the site on a different port)

## Running using docker

Prerequisites:
- docker

If you want to start up the frontend using docker instead of what is above (either for development or for a production site) you can run `docker compose up --build -d` to build the image and then run it in the background. This will need to be done after any changes you make to rebuilt the image
