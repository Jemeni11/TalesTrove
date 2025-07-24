import { BuyMeACoffee, GitHubSponsors } from "~icons";

export default function Footer() {
  return (
    <div className="text-sm w-full space-y-2 text-center my-4">
      <p className="text-gray-700">
        Made with <span className="animate-pulse">❤️</span> by{" "}
        <a
          href="https://www.github.com/Jemeni11"
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 underline underline-offset-2">
          Jemeni
        </a>
      </p>
      <a
        href="https://github.com/Jemeni11/Tales-Trove"
        target="_blank"
        rel="noreferrer"
        className="text-xs">
        <strong>Check out the Repo »</strong>
      </a>
      <div className="flex w-full justify-center items-center gap-x-6 sm:gap-x-4">
        <a
          href="https://www.buymeacoffee.com/jemeni11"
          target="_blank"
          rel="noopener noreferrer">
          <BuyMeACoffee />
        </a>
        <a
          href="https://github.com/sponsors/Jemeni11/"
          target="_blank"
          rel="noopener noreferrer">
          <GitHubSponsors />
        </a>
      </div>
    </div>
  );
}
