# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

[//]: # "Types of changes"
[//]: # "- **Added** for new features."
[//]: # "- **Changed** for changes in existing functionality."
[//]: # "- **Deprecated** for soon-to-be removed features."
[//]: # "- **Removed** for now removed features."
[//]: # "- **Fixed** for any bug fixes."
[//]: # "- **Security** in case of vulnerabilities."

## [Unreleased]

## [2.0.0] - 2025-06-30

### Added

- Unified XenForo adapter interface (`getXenForoData`)
- Declared `tabs` permission and made `tabs/talestrove.html` a web-accessible resource
- Clicking the extension icon now opens the internal `tabs/talestrove.html` page

### Changed

- Complete type system refactor:
  - Introduced `BasicStoryAndAuthorType` as base type
  - Consolidated all XenForo adapters into single module
  - Updated all type references across codebase
- Reorganized utils file structure:
  - Created dedicated `file_formats` directory
  - Added missing utility exports
- Standardized property names (`storyTitle` vs `storyName`)
- Unify build/package scripts for multi-target support
- Refactored `customError` utility to accept a single options object and support attaching partial context
- Updated AO3, FF, XenForo adapter to use new object-based `customError` util
- AO3 Adapter now returns partial results in the event of an error, improving resilience
- Updated `getDocument` to inject a `<base>` tag using the provided `baseURL`, ensuring that relative URLs resolve correctly during DOM parsing
- Improved error handling for 401/403 responses by checking for specific block messages
- XenForo adapter now passes `baseURL` to `getDocument` for accurate relative URL resolution

### Fixed

- Moved return statement outside try block in `getXenForoData` to ensure data is always returned, even if an error is caught
- Added missing break in `adapter.ts` switch case for XenForo adapters to prevent unintended fall through.

### Removed

- `popup.tsx`

## [1.3.1] - 2025-06-29

### Added

- Full support for Ao3's alternate TLD (.gay)
- New Globe icon component for domain toggle
- UI toggle switch for .gay/.org domain selection
- Type definition for alternateTLD flag in store
- Added AlternateTLD parameter in popup AO3 request
- Added AlternateTLD to AO3 store defaults
- Added FicRadar to related projects list

### Changed

- Refactored adapter message handler to use switch-case
- Updated AO3 URL generation to support dynamic TLDs
- Updated README motivation section with more details about AO3 integration and duplicate filtering

## [1.3.0] - 2025-02-03

### Added

- Support for `https://forum.spacebattles.com/*` in browser permissions

### Changed

- Updated SpaceBattles adapter to only use `forums.spacebattles.com` URLs
- Updated README to include more comprehensive information about `fichub-cli` and `FanFicFare`
- Added [FanFicFare](https://github.com/JimmXinu/FanFicFare/) to the LinksOnly TXT feature description

### Fixed

- Corrected URL handling for SpaceBattles thread and member links

## [1.2.0] - 2025-01-25

### Added

- New export format `LinksOnlyTXT` for better compatibility with other tools.
- New `LinksOnlyTXTIcon` in `src/icons.tsx`.
- Microsoft Edge Add-ons link in `README.md`.

### Changed

- Modified the type of `format` parameter in `handleExport` function from `string` to `fileFormatTypeKey` in `src/utils/handleExport.ts`.
- Updated icons and labels in `src/components/views/Main.tsx`.
- Updated the GitHub link label in `src/components/views/Footer.tsx`.
- Updated export handler function to use `fileFormatTypeKey` in various places in `src/popup.tsx`.
- Updated the note to important in `README.md`.

### Fixed

- Corrected the calculation of `selectedSitesCount` in `src/components/views/Main.tsx`.

## [1.1.0] - 2025-01-19

### Added

- Space Battles (Following Threads)
- Sufficient Velocity (Following Threads)
- Ao3 Bookmarks to the planned support section of the docs

### Changed

- Renamed `QQDataType` to `XenForoDataType`
- Simplified `subDataParams` and `expandedSectionsType`

### Removed

- Removed unneeded `await` from `exportHandler` in `popup.tsx`

## [1.0.0] - 2025-01-19

Released TalesTrove

[unreleased]: https://github.com/Jemeni11/TalesTrove/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/Jemeni11/TalesTrove/releases/compare/v1.3.1...v2.0.0
[1.3.1]: https://github.com/Jemeni11/TalesTrove/releases/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/Jemeni11/TalesTrove/releases/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/Jemeni11/TalesTrove/releases/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/Jemeni11/TalesTrove/releases/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/Jemeni11/TalesTrove/releases/tag/v1.0.0
