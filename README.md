# MVP

## So boom

We can start with giving everyone a song of the day and timeline.
Songs of the day are eternal and persistent. After 100 they can be frozen.

## Goals

Things to knock out for a minimal viable product. Something that's good enough to give to people

### Changelog

8/8/2023 - Started creating api routes to do the work of making supabase requests. It feels tedious but this is the most secure way I know to make requests to the cloud without committing keys to code. It could be sewn in during build time but I'm not a fan of that either. Should get a propper encryption going.

#### API Routes

Cute lil health checks `/api`

- GET: Get health and service name

Auth routes `/api/auth`

- GET: retrieving the secret to make valid requests
- POST: Creating a new user
  - Params
  - Secret
  - Email
  - Username
  - Password
  - Phone

### Notebook - "Your" home

  [ ] - Profile info
  [ ] - Songs of the day
  [ ] - Wallpaper
    - customization
  [ ] - ~~Bubbles~~ Stickies
  [ ] - Playlists

### Anthalogy

  [ ] - List of the week
  [ ] - user's lists
  [ ] - Bubbles of recently listened songs
  [ ] - Currently listening song autoplays
    - Car drives by w the speakers on 40

Songs of the day can be edge functions although that's unnecessary.

## Developing

Once you've created a project and installed dependencies with `yarn`, start a development server:

```bash
yarn dev

# or start the server and open the app in a new browser tab
yarn dev -- --open
```

## Building

To create a production version of your app:

```bash
yarn build
```

You can preview the production build with `yarn preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
