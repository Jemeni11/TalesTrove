import { useAtomValue } from "jotai";
import { useState } from "react";

import { Button, Footer, Header, Main, SwitchItem } from "~components";
import {
  BookmarksHTMLIcon,
  ChevronDown,
  CSVIcon,
  Download,
  HTMLIcon,
  JSONIcon,
  TXTIcon
} from "~icons";
import { cn } from "~lib/utils";
import {
  fileFormatAtom,
  sitesDataAtom,
  useResetAllOptions,
  useToggleFileFormat,
  useToggleSitesData
} from "~store";
import type {
  expandedSectionsType,
  FFProcessedStoryData,
  fileFormatType,
  QQDataType,
  sitesDataType,
  SubscriptionResult
} from "~types";
import { handleExport } from "~utils";

import "./style.css";

import { sendToBackground } from "@plasmohq/messaging";

const useDownloadManager = (
  fileFormatState: fileFormatType,
  sitesDataState: sitesDataType
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allErrors, setAllErrors] = useState<(Error | undefined)[]>([]);

  const getSelectedFormats = () =>
    Object.entries(fileFormatState)
      .filter(([_, isSelected]) => isSelected)
      .map(([format]) => format);

  const handleQQDownload = async (selectedFormats: string[]) => {
    const response = await sendToBackground({
      name: "adapter",
      body: { id: "QuestionableQuestingAdapter" }
    });

    try {
      const qqData = response.message as QQDataType[];
      selectedFormats.forEach((format) => handleExport(qqData, "qq", format));
    } catch {
      setAllErrors((prev) => [...prev, response.error]);
    }
  };

  const handleAO3Download = async (selectedFormats: string[]) => {
    const response = await sendToBackground({
      name: "adapter",
      body: {
        id: "ArchiveOfOurOwnAdapter",
        username: sitesDataState.archiveOfOurOwn.username,
        type: {
          author: sitesDataState.archiveOfOurOwn.author,
          work: sitesDataState.archiveOfOurOwn.work,
          series: sitesDataState.archiveOfOurOwn.series
        }
      }
    });
    try {
      const ao3Data = response.message as SubscriptionResult;
      selectedFormats.forEach((format) => {
        if (ao3Data.works) handleExport(ao3Data.works, "ao3_works", format);
        if (ao3Data.authors)
          handleExport(ao3Data.authors, "ao3_authors", format);
        if (ao3Data.series) handleExport(ao3Data.series, "ao3_series", format);
      });
    } catch {
      setAllErrors((prev) => [...prev, response.error]);
    }
  };

  const handleFFDownload = async (selectedFormats: string[]) => {
    const downloads = [
      {
        enabled: sitesDataState.fanfiction.following,
        adapterId: "FanFictionNetFollowingAdapter",
        exportPrefix: "ff_following"
      },
      {
        enabled: sitesDataState.fanfiction.favorites,
        adapterId: "FanFictionNetFavoritesAdapter",
        exportPrefix: "ff_favorites"
      }
    ];

    try {
      for (const { enabled, adapterId, exportPrefix } of downloads) {
        if (!enabled) continue;

        const response = await sendToBackground({
          name: "adapter",
          body: { id: adapterId }
        });

        try {
          const data = response.message as FFProcessedStoryData[];
          selectedFormats.forEach((format) =>
            handleExport(data, exportPrefix, format)
          );
        } catch {
          setAllErrors((prev) => [...prev, response.error]);
        }
      }
    } catch (error) {
      setAllErrors((prev) => [...prev, error]);
    }
  };

  const handleDownload = async () => {
    setIsLoading(true);
    setError(null);

    try {
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

  return { handleDownload, isLoading, error, allErrors };
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
  const [expandedSections, setExpandedSections] =
    useState<expandedSectionsType>({
      fanfiction: false,
      archiveOfOurOwn: false,
      questionableQuesting: false
    });

  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  const fileFormatState = useAtomValue(fileFormatAtom);
  const sitesDataState = useAtomValue(sitesDataAtom);
  const toggleSitesData = useToggleSitesData();

  const { handleDownload, isLoading, error, allErrors } = useDownloadManager(
    fileFormatState,
    sitesDataState
  );

  const toggleSection = (section: keyof expandedSectionsType) => {
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
      <Main
        expandedSections={expandedSections}
        onToggle={toggleSection}
        sitesDataState={sitesDataState}
        toggleSitesData={toggleSitesData}
      />

      <div className="mt-auto p-4 bg-muted">
        <DownloadOptions
          isOpen={isDownloadOpen}
          onToggle={setIsDownloadOpen}
          selectedSitesCount={selectedSitesCount}
          selectedFormatsCount={selectedFormatsCount}
          fileFormatState={fileFormatState}
        />

        <div className="text-lg">
          {allErrors.map((err) => (
            <p key={err.name}>
              <span>{err?.name || "No Name"}</span>
              <br />
              <span>{err?.message || "No Message"}</span>
              <br />
              <span>{`${err?.cause}` || "No Cause"}</span>
            </p>
          ))}
        </div>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

        <Button
          onClick={handleDownload}
          className="w-full rounded mt-4 bg-[#344955] text-white hover:bg-[hsl(203,11%,14%)]"
          disabled={selectedFormatsCount === 0 || isLoading}>
          <Download className="w-4 h-4 mr-2" />
          {isLoading ? "Downloading..." : "Download Files"}
        </Button>

        <Footer />
      </div>
    </div>
  );
}
