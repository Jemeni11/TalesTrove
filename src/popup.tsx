import logo from "data-base64:../assets/icon.png";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

import { Button, Input, Section, SwitchItem } from "~components";
import {
  Bookmark,
  BookmarksHTMLIcon,
  BookOpen,
  ChevronDown,
  CSVIcon,
  Download,
  FileText,
  HTMLIcon,
  JSONIcon,
  TXTIcon,
  User,
  Users
} from "~icons";
import { cn } from "~lib/utils";
import {
  fileFormatAtom,
  sitesDataAtom,
  useResetAllOptions,
  useSetAO3Username,
  useToggleFileFormat,
  useToggleSitesData
} from "~store";
import type {
  FFProcessedStoryData,
  fileFormatType,
  QQDataType,
  SubscriptionResult
} from "~types";
import { handleExport } from "~utils";

import "./style.css";

import { sendToBackground } from "@plasmohq/messaging";

const Header = () => (
  <div className="p-4 flex items-center gap-x-4">
    <img src={logo} alt="logo" width={32} height={32} />
    <h1 className="text-2xl font-bold text-black">TalesTrove</h1>
  </div>
);

const FanFictionOptions = () => {
  const sitesDataState = useAtomValue(sitesDataAtom);
  const toggleSitesData = useToggleSitesData();

  return (
    <>
      <SwitchItem
        icon={<Bookmark className="w-4 h-4" />}
        label="Favorites"
        checked={sitesDataState.fanfiction.favorites}
        onCheckedChange={() => toggleSitesData("fanfiction", "favorites")}
      />
      <SwitchItem
        icon={<User className="w-4 h-4" />}
        label="Following"
        checked={sitesDataState.fanfiction.following}
        onCheckedChange={() => toggleSitesData("fanfiction", "following")}
      />
    </>
  );
};

const useAO3Validation = () => {
  const sitesDataState = useAtomValue(sitesDataAtom);
  const [showError, setShowError] = useState(false);

  const isAnyOptionSelected =
    sitesDataState.archiveOfOurOwn.work ||
    sitesDataState.archiveOfOurOwn.series ||
    sitesDataState.archiveOfOurOwn.author;

  const hasUsername = Boolean(sitesDataState.archiveOfOurOwn.username?.trim());

  const isValid = !isAnyOptionSelected || (isAnyOptionSelected && hasUsername);

  useEffect(() => {
    if (isAnyOptionSelected && !hasUsername) {
      setShowError(true);
    } else {
      setShowError(false);
    }
  }, [isAnyOptionSelected, hasUsername]);

  return {
    showError,
    isValid,
    isAnyOptionSelected
  };
};

const AO3Options = () => {
  const sitesDataState = useAtomValue(sitesDataAtom);
  const setAO3Username = useSetAO3Username();
  const toggleSitesData = useToggleSitesData();
  const { showError, isAnyOptionSelected } = useAO3Validation();

  const handleOptionToggle = (
    option: keyof typeof sitesDataState.archiveOfOurOwn
  ) => {
    if (option !== "username") {
      toggleSitesData("archiveOfOurOwn", option);
    }
  };

  return (
    <>
      <div className="mb-4">
        <label
          htmlFor="archiveUsername"
          className={cn(
            "block text-sm font-medium mb-1",
            isAnyOptionSelected &&
              "after:content-['*'] after:ml-0.5 after:text-red-500"
          )}>
          Archive Username
        </label>
        <Input
          id="archiveUsername"
          placeholder="e.g. stoleLightningNotThunder"
          className={cn(
            "w-full",
            showError && "border-red-500 focus-visible:ring-red-500"
          )}
          value={sitesDataState.archiveOfOurOwn.username}
          onChange={(e) => setAO3Username(e.target.value)}
          required={isAnyOptionSelected}
          aria-invalid={showError}
        />
        {showError && (
          <small className="mt-1 text-sm text-red-500">Username is required</small>
        )}
      </div>
      <SwitchItem
        icon={<BookOpen className="w-4 h-4" />}
        label="Work Subscriptions"
        checked={sitesDataState.archiveOfOurOwn.work}
        onCheckedChange={() => handleOptionToggle("work")}
      />
      <SwitchItem
        icon={<FileText className="w-4 h-4" />}
        label="Series Subscriptions"
        checked={sitesDataState.archiveOfOurOwn.series}
        onCheckedChange={() => handleOptionToggle("series")}
      />
      <SwitchItem
        icon={<Users className="w-4 h-4" />}
        label="Author Subscriptions"
        checked={sitesDataState.archiveOfOurOwn.author}
        onCheckedChange={() => handleOptionToggle("author")}
      />
    </>
  );
};

const QQOptions = () => {
  const sitesDataState = useAtomValue(sitesDataAtom);
  const toggleSitesData = useToggleSitesData();

  return (
    <SwitchItem
      icon={<Bookmark className="w-4 h-4" />}
      label="Followed Threads"
      checked={sitesDataState.questionableQuesting.following}
      onCheckedChange={() =>
        toggleSitesData("questionableQuesting", "following")
      }
    />
  );
};

const Footer = () => (
  <div className="w-full text-center my-4">
    <p className="text-sm text-gray-700">
      Made with ❤️ by{" "}
      <a
        href="https://www.github.com/Jemeni11"
        target="_blank"
        rel="noreferrer"
        className="text-blue-500">
        Jemeni
      </a>
    </p>
  </div>
);

const useDownloadManager = () => {
  const fileFormatState = useAtomValue(fileFormatAtom);
  const sitesDataState = useAtomValue(sitesDataAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSelectedFormats = () =>
    Object.entries(fileFormatState)
      .filter(([_, isSelected]) => isSelected)
      .map(([format]) => format);

  const handleQQDownload = async (selectedFormats: string[]) => {
    const response = await sendToBackground({
      name: "adapter",
      body: { id: "qq" }
    });
    const qqData = response.message as QQDataType[];
    selectedFormats.forEach((format) => handleExport(qqData, "qq", format));
  };

  const handleAO3Download = async (selectedFormats: string[]) => {
    const response = await sendToBackground({
      name: "adapter",
      body: {
        id: "ao3",
        username: sitesDataState.archiveOfOurOwn.username,
        type: {
          author: sitesDataState.archiveOfOurOwn.author,
          work: sitesDataState.archiveOfOurOwn.work,
          series: sitesDataState.archiveOfOurOwn.series
        }
      }
    });

    const ao3Data = response.message as SubscriptionResult;
    selectedFormats.forEach((format) => {
      if (ao3Data.works) handleExport(ao3Data.works, "ao3_works", format);
      if (ao3Data.authors) handleExport(ao3Data.authors, "ao3_authors", format);
      if (ao3Data.series) handleExport(ao3Data.series, "ao3_series", format);
    });
  };

  const handleFFDownload = async (selectedFormats: string[]) => {
    if (sitesDataState.fanfiction.following) {
      const response = await sendToBackground({
        name: "adapter",
        body: { id: "fffollowing" }
      });
      const followingData = response.message as FFProcessedStoryData[];
      selectedFormats.forEach((format) =>
        handleExport(followingData, "ff_following", format)
      );
    }

    if (sitesDataState.fanfiction.favorites) {
      const response = await sendToBackground({
        name: "adapter",
        body: { id: "fffavorites" }
      });
      const favoritesData = response.message as FFProcessedStoryData[];
      selectedFormats.forEach((format) =>
        handleExport(favoritesData, "ff_favorites", format)
      );
    }
  };

  const { isValid: isAO3Valid } = useAO3Validation();

  const handleDownload = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isAO3Valid) {
        throw new Error("Please enter an Archive of Our Own username");
      }

      const selectedFormats = getSelectedFormats();
      const downloads = [];

      if (sitesDataState.questionableQuesting.following) {
        downloads.push(handleQQDownload(selectedFormats));
      }

      if (Object.values(sitesDataState.archiveOfOurOwn).some(Boolean)) {
        downloads.push(handleAO3Download(selectedFormats));
      }

      if (
        sitesDataState.fanfiction.following ||
        sitesDataState.fanfiction.favorites
      ) {
        downloads.push(handleFFDownload(selectedFormats));
      }

      await Promise.all(downloads);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Download failed");
      console.error("Download error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleDownload, isLoading, error, isValid: isAO3Valid };
};

const DownloadOptions: React.FC<{
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  selectedSitesCount: number;
  selectedFormatsCount: number;
  fileFormatState: fileFormatType;
}> = ({
  isOpen,
  onToggle,
  selectedSitesCount,
  selectedFormatsCount,
  fileFormatState
}) => {
  const resetAllOptions = useResetAllOptions();
  const toggleFileFormat = useToggleFileFormat();

  return (
    <details
      className="group"
      open={isOpen}
      onToggle={(e) => onToggle(e.currentTarget.open)}>
      <summary className="flex items-center justify-between cursor-pointer list-none">
        <span className="text-lg font-semibold">Download Files</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen ? "transform rotate-180" : ""
          )}
        />
      </summary>
      <div className="mt-2 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm">
            {selectedSitesCount} Sites, {selectedFormatsCount} Formats Selected
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetAllOptions}
            className="text-primary hover:text-primary">
            Reset
          </Button>
        </div>
        <SwitchItem
          id="json"
          icon={<JSONIcon />}
          label="JSON"
          checked={fileFormatState.json}
          onCheckedChange={() => toggleFileFormat("json")}
        />
        <SwitchItem
          id="txt"
          icon={<TXTIcon />}
          label="TXT"
          checked={fileFormatState.txt}
          onCheckedChange={() => toggleFileFormat("txt")}
        />
        <SwitchItem
          id="csv"
          icon={<CSVIcon />}
          label="CSV"
          checked={fileFormatState.csv}
          onCheckedChange={() => toggleFileFormat("csv")}
        />
        <SwitchItem
          id="html"
          icon={<HTMLIcon />}
          label="HTML"
          checked={fileFormatState.html}
          onCheckedChange={() => toggleFileFormat("html")}
        />
        <SwitchItem
          id="bookmarksHtml"
          icon={<BookmarksHTMLIcon />}
          label="Bookmarks HTML"
          checked={fileFormatState.bookmarksHtml}
          onCheckedChange={() => toggleFileFormat("bookmarksHtml")}
        />
      </div>
    </details>
  );
};

export default function TalesTrove() {
  const [expandedSections, setExpandedSections] = useState<{
    fanfiction: boolean;
    archiveOfOurOwn: boolean;
    questionableQuesting: boolean;
  }>({
    fanfiction: false,
    archiveOfOurOwn: false,
    questionableQuesting: false
  });

  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const { handleDownload, isLoading, error, isValid } = useDownloadManager();

  const fileFormatState = useAtomValue(fileFormatAtom);
  const sitesDataState = useAtomValue(sitesDataAtom);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const selectedSitesCount = Object.values(sitesDataState)
    .flatMap((site) => Object.values(site))
    .filter(Boolean).length;

  const selectedFormatsCount =
    Object.values(fileFormatState).filter(Boolean).length;

  return (
    <div className="w-[350px] bg-background text-foreground overflow-y-auto shadow-lg flex flex-col">
      <Header />

      <div className="p-4 flex-grow">
        <Section
          title="FanFiction.Net"
          expanded={expandedSections.fanfiction}
          onToggle={() => toggleSection("fanfiction")}>
          <FanFictionOptions />
        </Section>

        <Section
          title="Archive Of Our Own"
          expanded={expandedSections.archiveOfOurOwn}
          onToggle={() => toggleSection("archiveOfOurOwn")}>
          <AO3Options />
        </Section>

        <Section
          title="QuestionableQuesting"
          expanded={expandedSections.questionableQuesting}
          onToggle={() => toggleSection("questionableQuesting")}>
          <QQOptions />
        </Section>
      </div>

      <div className="mt-auto p-4 bg-muted">
        <DownloadOptions
          isOpen={isDownloadOpen}
          onToggle={setIsDownloadOpen}
          selectedSitesCount={selectedSitesCount}
          selectedFormatsCount={selectedFormatsCount}
          fileFormatState={fileFormatState}
        />

        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

        <Button
          onClick={handleDownload}
          className="w-full rounded mt-4 bg-[hsl(203,24%,27%)] text-white hover:bg-[hsl(203,11%,14%)]"
          disabled={selectedFormatsCount === 0 || isLoading || !isValid}>
          <Download className="w-4 h-4 mr-2" />
          {isLoading ? "Downloading..." : "Download Files"}
        </Button>
      </div>

      <Footer />
    </div>
  );
}
