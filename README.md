<div align="center">
  <a href="https://github.com/Jemeni11/Tales-Trove">
    <img src="assets/icon.png" alt="Logo" width="80" height="80">
  </a>

  <h1 align="center">TalesTrove</h1>

  <p align="center">
    TalesTrove is a browser extension that allows users to easily save links to their favorite fictional stories and series from various platforms.
    <br />
    <br />
    <a href="https://github.com/Jemeni11/Tales-Trove"><strong>Explore the repo »</strong></a>
    <br />
  </p>
</div>

This project was built using the [Plasmo](https://docs.plasmo.com/) framework.

## Supported Sites

- FanFiction.net
  - Favorites
  - Following
- Archive Of Our Own
  - Work Subscriptions
  - Series Subscriptions
  - Author Subscriptions
- QuestionableQuesting
  - Following Threads

## Sites Planned for Support

- SpaceBattles
  - Following Threads

## Features

- Save favorites and followed stories from various websites.
- Export saved links in various formats (JSON, TXT, CSV, HTML, Bookmark HTML File).

## Installation

### Browser Extension Stores

The extension will be available on official browser stores soon. Check back for updates.

### Using Pre-built Files

> [!NOTE]
>
> You must enable Developer Mode in your browser.

1. Go to the [Releases Page](https://github.com/Jemeni11/TalesTrove/releases).
2. Download the file for your browser:
   - For Chrome/Chromium: Download `extension-chrome.zip`
   - For Firefox: Download `extension-firefox.xpi`
3. Install the extension:

   - Chrome and Chromium browsers:

     1. Extract the downloaded zip file.
     2. Go to `chrome:extensions`.
     3. Click `Load Unpacked`.
     4. Select the extracted folder.

   - Firefox:
     1. Go to `about:addons`.
     2. Click the Settings icon.
     3. Select `Install Add-on From File...`.
     4. Select the downloaded .xpi file.

### Building From Source

> [!NOTE]
>
> You must enable Developer Mode in your browser.

> [!NOTE]
>
> This extension requires [pnpm](https://pnpm.io/) for building.

1. Clone the repository and install dependencies.

   ```sh
    git clone https://www.github.com/Jemeni11/TalesTrove.git
    cd TalesTrove
    pnpm install
   ```

2. For development

   ```sh
   pnpm dev
   ```

   Then load the appropriate development build from the `build` directory.

3. For production

   - Chrome (and other Chromium Browsers)

     ```sh
     pnpm build
     ```

   - Firefox

     ```sh
     pnpm build:firefox
     ```

4. Install the built extension

   - Chrome (and other Chromium Browsers):

     1. Go to `chrome:extensions`.
     2. Click `Load Unpacked`.
     3. Navigate to the build folder and select the Chrome build.

   - For Firefox:

     1. Go to `about:addons`.
     2. Click on the Settings icon.
     3. Select `Install Add-on From File...`.
     4. Navigate to the build folder and select the Firefox build.

For further guidance, [visit Plasmo's Documentation](https://docs.plasmo.com/)

## Usage

> [!WARNING]
> You must be logged in to the respective websites to use the extension.

1. Click on the TalesTrove icon in your browser's extension area.
2. Configure your preferences for each supported website.
3. Use the "Download Links" section to export your saved links.

## FAQ

- **Why do you need my Archive username?**

  Unlike other sites, Archive Of Our Own requires a username to access user-specific subscriptions (such as works, series, and authors). The extension needs to link to your account to retrieve this data.

- **Why do I need to be logged in?**

  You need to be logged in to your accounts on supported platforms because the extension interacts with personalized data—such as your favorites, followed stories, or subscriptions—which requires authentication to access. Without logging in, we can't fetch this data for you.

- **Does this extension save/steal any of my data?**

  Nope, this extension doesn’t collect, store, or share any of your data. We don’t send your info to third parties, and heck, we don’t even track telemetry. So if this crashes... well, (no ~~beta~~ data, we die like men!).

  The only data this extension stores is what you save when you click "Download". Your saved links are only stored locally on your own computer—we don’t hoard or send that info anywhere. It’s all private, secure, and stays with you.

  Additionally, this project is open source, so you can review the code yourself (or have someone who knows React and TypeScript take a look) to ensure we're staying true to our word.

## Contributing

[Guidelines for contributing to the project - to be added]

## License

[GPL-3.0 license](/LICENSE)
