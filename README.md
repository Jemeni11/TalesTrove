<a id="readme-top"></a>

<div align="center">
  <a href="https://github.com/Jemeni11/Tales-Trove">
    <img src="assets/icon.png" alt="Logo" width="80" height="80">
  </a>

  <h1 align="center">TalesTrove</h1>

  <p align="center">
    Easily Save Your Favorite Stories for Later.
    <br />
    <br />
    <a href="https://github.com/Jemeni11/Tales-Trove"><strong>Explore the repo »</strong></a>
    <br />
  </p>
</div>

Table of Contents

- [Introduction](#introduction)
- [Supported Sites](#supported-sites)
- [Sites Planned for Support](#sites-planned-for-support)
- [Features](#features)
- [Installation](#installation)
  - [Browser Extension Stores](#browser-extension-stores)
  - [Using Pre-built Files](#using-pre-built-files)
  - [Building From Source](#building-from-source)
- [Usage](#usage)
  - [With fichub-cli](#with-fichub-cli)
  - [With FanFicFare](#with-fanficfare)
- [FAQ](#faq)
- [Contributing](#contributing)
- [Why did I build this?](#why-did-i-build-this)
- [Wait a minute, who are you?](#wait-a-minute-who-are-you)
- [License](#license)
- [Changelog](#changelog)

## Introduction

TalesTrove is a browser extension that allows users to easily save links to their favorite fictional stories and series from various platforms.

This project was built using the [Plasmo](https://docs.plasmo.com/) framework.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Supported Sites

- FanFiction.net
  - Favorites Stories
  - Following Stories
- Archive Of Our Own
  - Work Subscriptions
  - Series Subscriptions
  - Author Subscriptions
- QuestionableQuesting
  - Watched Threads
- SpaceBattles
  - Watched Threads
- Sufficient Velocity
  - Watched Threads

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Sites Planned for Support

- Archive Of Our Own
  - Bookmarks

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Features

- Save favorites and followed stories from multiple supported platforms
- Export saved links in multiple formats:
  - JSON for data processing
  - TXT for simple text listings
  - CSV for spreadsheet compatibility
  - HTML for web viewing
  - Bookmark HTML for browser importing
  - LinksOnly TXT for plain links, line-separated, ideal for easy parsing when only the links are needed, including use with fanfiction tools like [FicHubCLI](https://github.com/FicHub/fichub-cli) and [FanFicFare](https://github.com/JimmXinu/FanFicFare/).
- Simple, user-friendly interface

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Installation

### Browser Extension Stores

- Mozilla Firefox Browser Add-ons: [Link](https://addons.mozilla.org/en-US/firefox/addon/tales_trove/)
- Microsoft Edge Add-ons: [Link](https://microsoftedge.microsoft.com/addons/detail/talestrove/lahledcnahkanmigdbaglgagcdleopjd)
- Chrome Web Store: [Link](https://chromewebstore.google.com/detail/cjealedijmcdnkkfpgmobhaohjljlojg)
- Opera Add-ons v1.0.0: [Link](https://addons.opera.com/en-gb/extensions/details/talestrove/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Using Pre-built Files

> [!IMPORTANT]
>
> You must enable Developer Mode in Chrome/Chromium.

1. Go to the [Releases Page](https://github.com/Jemeni11/TalesTrove/releases).
2. Download the file for your browser:
   - For Chrome/Chromium: Download `chrome-mv3-prod.zip`
   - For Firefox: Download `firefox-mv2-prod.zip`
3. Install the extension:

   - Chrome and Chromium browsers:

     1. Extract the downloaded zip file.
     2. Go to `chrome:extensions`.
     3. Click `Load Unpacked`.
     4. Select the extracted folder.

   - Firefox:
     1. Go to `about:debugging#/runtime/this-firefox`.
     2. Click `Load Temporary Add-on...`.
     3. Select the Firefox zip.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Building From Source

> [!IMPORTANT]
>
> You must enable Developer Mode in Chrome/Chromium.

> [!IMPORTANT]
>
> This extension requires [Node](https://nodejs.org/) and [pnpm](https://pnpm.io/) for building.

> [!NOTE]
>
> This extension was built with
>
> - Node v22.13.0
> - pnpm v9.15.3
> - Windows 11 Pro 21H2

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

     1. Go to `about:debugging#/runtime/this-firefox`.
     2. Click `Load Temporary Add-on...`.
     3. Navigate to the Firefox build folder and select the `manifest.json` file.

For further guidance, [visit Plasmo's Documentation](https://docs.plasmo.com/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

> [!WARNING]
> You must be logged in to the respective websites to use the extension.

1. Click on the TalesTrove icon in your browser's extension area.
2. Configure your preferences for each supported website.
3. Use the "Download Links" section to export your saved links.

### With fichub-cli

> [!IMPORTANT]
> You must have [fichub-cli](https://github.com/FicHub/fichub-cli) installed to continue.

fichub-cli is a command-line interface tool that interacts with the [FicHub.net](https://fichub.net/) API, enabling fanfiction enthusiasts to automate the process of converting fanfiction URLs into standardized eBook formats.

1. Download your links using the `LinksOnlyTXT` format.
2. Use the file with fichub-cli like this:

   ```bash

    fichub_cli -i .\ao3_works_linksOnly.txt

   ```

### With FanFicFare

> [!IMPORTANT]
> You must have [FanFicFare](https://github.com/JimmXinu/FanFicFare) installed to continue.

FanFicFare is a tool for making eBooks from stories on fanfiction and other web sites.

1. Download your links using the `LinksOnlyTXT` format.
2. Use the file with FanFicFare like this:

   ```bash

    fanficfare -i .\ao3_works_linksOnly.txt

   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## FAQ

- **Why do you need my Archive username?**

  Unlike other sites, Archive Of Our Own requires a username to access user-specific subscriptions (such as works, series, and authors). TalesTrove needs to link to your account to retrieve this data.

- **Why do I need to be logged in?**

  You need to be logged in to your accounts on supported platforms because TalesTrove interacts with personalized data—such as your favorites, followed stories, or subscriptions—which requires authentication to access. Without logging in, the extension can't fetch this data for you.

- **Does this extension save/steal any of my data?**

  Nope, TalesTrove doesn’t collect, store, or share any of your data. The extension doesn't send your info to third parties and doesn't track telemetry. So if this crashes... well, ([no ~~beta~~ data, we die like men!](https://archiveofourown.org/tags/no%20beta%20we%20die%20like%20men)).

  The only data TalesTrove stores is what you save when you click "Download". Your saved links are only stored locally on your own computer—it's not hoarded or sent anywhere. It’s all private, secure, and stays with you.

  Additionally, this project is open source, so you can review the code yourself (or have someone who knows React and TypeScript take a look) to verify these privacy claims.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are welcome! If you'd like to improve TalesTrove, please feel free to submit a pull request.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Why did I build this?

I like fanfiction and I like having local copies of my data. So, I built this extension to get it for me.

Another reason was AO3. While I love ao3, the subscription page ... 💀 One of those pages literally has the same work duplicated multiple times. When TalesTrove downloads your subscriptions, it automatically filters out duplicates.

I've made other fanfiction tools before like [FicImage](https://github.com/Jemeni11/FicImage) and [FicRadar (WIP)](https://github.com/Jemeni11/FicRadar). I've also contributed to tools like [WebToEpub](https://github.com/dteviot/WebToEpub) and [Leech.py](https://github.com/kemayo/leech).

I hope TalesTrove helps make managing your subscriptions a little easier too.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Wait a minute, who are you?

Hello there! I'm Emmanuel Jemeni, and I am a Frontend Developer.

You can find me on various platforms:

- [LinkedIn](https://www.linkedin.com/in/emmanuel-jemeni)
- [GitHub](https://github.com/Jemeni11)
- [Twitter/X](https://twitter.com/Jemeni11_)
- [Bluesky](https://bsky.app/profile/jemeni11.bsky.social)

If you'd like, you can support me on [GitHub Sponsors](https://github.com/sponsors/Jemeni11/)
or [Buy Me A Coffee](https://www.buymeacoffee.com/jemeni11).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

[GPL-3.0 license](/LICENSE)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Changelog

[Changelog](/CHANGELOG.md)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
