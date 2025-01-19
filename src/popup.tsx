import { useAtomValue } from "jotai";
import { useState } from "react";

import { Button, Footer, Header, Main, Section, SwitchItem } from "~components";
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
  sitesDataType,
  SubscriptionResult,
  XenForoDataType
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

  const handleAdapterDownload = async ({
    adapterId,
    body = {},
    exportHandler
  }: {
    adapterId: string;
    body?: Record<string, any>;
    exportHandler: (data: any, formats: string[]) => void;
  }) => {
    try {
      const response = await sendToBackground({
        name: "adapter",
        body: { id: adapterId, ...body }
      });

      try {
        exportHandler(response.message, getSelectedFormats());
      } catch {
        setAllErrors((prev) => [...prev, response.error]);
      }
    } catch (error) {
      setAllErrors((prev) => [...prev, error]);
    }
  };

  const handleQQDownload = () =>
    handleAdapterDownload({
      adapterId: "QuestionableQuestingAdapter",
      exportHandler: (data: XenForoDataType[], formats: string[]) => {
        formats.forEach((format) => handleExport(data, "qq", format));
      }
    });

  const handleSBDownload = () =>
    handleAdapterDownload({
      adapterId: "SpaceBattlesAdapter",
      exportHandler: (data: XenForoDataType[], formats: string[]) => {
        formats.forEach((format) => handleExport(data, "sb", format));
      }
    });

  const handleAO3Download = () =>
    handleAdapterDownload({
      adapterId: "ArchiveOfOurOwnAdapter",
      body: {
        username: sitesDataState.archiveOfOurOwn.username,
        type: {
          author: sitesDataState.archiveOfOurOwn.author,
          work: sitesDataState.archiveOfOurOwn.work,
          series: sitesDataState.archiveOfOurOwn.series
        }
      },
      exportHandler: (data: SubscriptionResult, formats: string[]) => {
        formats.forEach((format) => {
          if (data.works) handleExport(data.works, "ao3_works", format);
          if (data.authors) handleExport(data.authors, "ao3_authors", format);
          if (data.series) handleExport(data.series, "ao3_series", format);
        });
      }
    });

  const handleFFDownload = () => {
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

    return Promise.all(
      downloads
        .filter(({ enabled }) => enabled)
        .map(({ adapterId, exportPrefix }) =>
          handleAdapterDownload({
            adapterId,
            exportHandler: (
              data: FFProcessedStoryData[],
              formats: string[]
            ) => {
              formats.forEach((format) =>
                handleExport(data, exportPrefix, format)
              );
            }
          })
        )
    );
  };

  const handleDownload = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const downloadTasks = [];

      if (sitesDataState.questionableQuesting.following) {
        downloadTasks.push(handleQQDownload());
      }

      if (sitesDataState.spaceBattles.following) {
        downloadTasks.push(handleSBDownload());
      }

      if (Object.values(sitesDataState.archiveOfOurOwn).some(Boolean)) {
        downloadTasks.push(handleAO3Download());
      }

      if (
        sitesDataState.fanfiction.following ||
        sitesDataState.fanfiction.favorites
      ) {
        downloadTasks.push(handleFFDownload());
      }

      await Promise.all(downloadTasks);
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
            {selectedSitesCount} Site Option{selectedSitesCount !== 1 && "s"},{" "}
            {selectedFormatsCount} Format{selectedFormatsCount !== 1 && "s"}{" "}
            Selected
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
      questionableQuesting: false,
      spaceBattles: false
    });

  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  const fileFormatState = useAtomValue(fileFormatAtom);
  const sitesDataState = useAtomValue(sitesDataAtom);
  const toggleSitesData = useToggleSitesData();

  const [showStatusSection, setShowStatusSection] = useState(false);
  const [statusSection, setStatusSection] = useState(false);

  const { handleDownload, isLoading, error, allErrors } = useDownloadManager(
    fileFormatState,
    sitesDataState
  );

  const onDownloadClick = () => {
    setShowStatusSection(true);
    handleDownload();
  };

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
      <main className="p-4">
        <Main
          expandedSections={expandedSections}
          onToggle={toggleSection}
          sitesDataState={sitesDataState}
          toggleSitesData={toggleSitesData}
        />
        {showStatusSection && (
          <Section
            title="Status"
            expanded={statusSection}
            onToggle={() => setStatusSection((prev) => !prev)}>
            <div className="text-sm max-h-[120px] overflow-y-auto">
              {allErrors.length === 0 && <span>No errors :)</span>}
              {allErrors.map((err) => (
                <p key={err.name} className="mb-1">
                  <strong>{err.name || "No Name"}</strong>
                  <br />
                  <span>{err.message || "No Message"}</span>
                  <br />
                  {err.cause && err.cause !== err.message && (
                    <span>{`${err.cause}` || "No Cause"}</span>
                  )}
                </p>
              ))}
            </div>
          </Section>
        )}
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </main>

      <div className="mt-auto p-4 bg-muted">
        <DownloadOptions
          isOpen={isDownloadOpen}
          onToggle={setIsDownloadOpen}
          selectedSitesCount={selectedSitesCount}
          selectedFormatsCount={selectedFormatsCount}
          fileFormatState={fileFormatState}
        />
        <Button
          onClick={onDownloadClick}
          className="w-full rounded mt-4 bg-[#344955] text-white hover:bg-[hsl(203,11%,14%)]"
          disabled={
            selectedSitesCount === 0 || selectedFormatsCount === 0 || isLoading
          }>
          <Download className="w-4 h-4 mr-2" />
          {isLoading ? "Downloading..." : "Download Files"}
        </Button>
        <Footer />
      </div>
    </div>
  );
}
