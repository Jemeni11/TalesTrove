import { useAtomValue } from "jotai";
import { useState } from "react";

import { Button, Footer, Header, Main, SwitchItem } from "~components";
import {
  BookmarksHTMLIcon,
  CSVIcon,
  Download,
  HTMLIcon,
  JSONIcon,
  LinksOnlyTXTIcon,
  TXTIcon
} from "~icons";
import {
  fileFormatAtom,
  sitesDataAtom,
  useResetAllOptions,
  useToggleFileFormat,
  useToggleSitesData
} from "~store";
import type {
  BasicStoryAndAuthorType,
  expandedSectionsType,
  FFProcessedStoryData,
  fileFormatType,
  fileFormatTypeKey,
  SerializableError,
  sitesDataType,
  SubscriptionResult
} from "~types";
import { adapterHandler, handleExport } from "~utils";

import "../style.css";

const useDownloadManager = (
  fileFormatState: fileFormatType,
  sitesDataState: sitesDataType
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allErrors, setAllErrors] = useState<SerializableError[]>([]);

  const getSelectedFormats = () =>
    Object.entries(fileFormatState)
      .filter(([_, isSelected]) => isSelected)
      .map(([format]) => format) as fileFormatTypeKey[];

  const handleAdapterDownload = async ({
    adapterId,
    body = {},
    exportHandler
  }: {
    adapterId: string;
    body?: Record<string, any>;
    exportHandler: (data: any, formats: fileFormatTypeKey[]) => void;
  }) => {
    try {
      const response = await adapterHandler(adapterId, body);

      if ("message" in response) {
        try {
          exportHandler(response.message, getSelectedFormats());
        } catch (err) {
          setAllErrors((prev) => [
            ...prev,
            {
              name: err instanceof Error ? err.name : "ExportHandlerError",
              message:
                err instanceof Error
                  ? err.message
                  : "Unknown error during export",
              stack: err instanceof Error ? err.stack : undefined
            }
          ]);
        }
      }

      if ("error" in response) {
        setAllErrors((prev) => [...prev, response.error]);
      }
    } catch (error) {
      setAllErrors((prev) => [...prev, error]);
    }
  };

  const handleQQDownload = () =>
    handleAdapterDownload({
      adapterId: "QuestionableQuestingAdapter",
      exportHandler: (
        data: BasicStoryAndAuthorType[],
        formats: fileFormatTypeKey[]
      ) => {
        formats.forEach((format) => handleExport(data, "qq", format));
      }
    });

  const handleSBDownload = () =>
    handleAdapterDownload({
      adapterId: "SpaceBattlesAdapter",
      exportHandler: (
        data: BasicStoryAndAuthorType[],
        formats: fileFormatTypeKey[]
      ) => {
        formats.forEach((format) => handleExport(data, "sb", format));
      }
    });

  const handleSVDownload = () =>
    handleAdapterDownload({
      adapterId: "SufficientVelocityAdapter",
      exportHandler: (
        data: BasicStoryAndAuthorType[],
        formats: fileFormatTypeKey[]
      ) => {
        formats.forEach((format) => handleExport(data, "sv", format));
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
        },
        alternateTLD: sitesDataState.archiveOfOurOwn.alternateTLD
      },
      exportHandler: (
        data: SubscriptionResult,
        formats: fileFormatTypeKey[]
      ) => {
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
              formats: fileFormatTypeKey[]
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

      if (sitesDataState.sufficientVelocity.following) {
        downloadTasks.push(handleSVDownload());
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
  fileFormatState: fileFormatType;
}> = ({ fileFormatState }) => {
  const toggleFileFormat = useToggleFileFormat();

  return (
    <div className="p-4 space-y-1.5">
      <h2 className="text-sm font-medium text-gray-500 uppercase mb-2">
        Download Formats
      </h2>
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
      <SwitchItem
        id="linksOnly"
        icon={<LinksOnlyTXTIcon />}
        label="Links Only TXT"
        checked={fileFormatState.linksOnly}
        onCheckedChange={() => toggleFileFormat("linksOnly")}
      />
    </div>
  );
};

export default function TalesTrove() {
  const [expandedSections, setExpandedSections] =
    useState<expandedSectionsType>({
      fanfiction: false,
      archiveOfOurOwn: false,
      questionableQuesting: false,
      spaceBattles: false,
      sufficientVelocity: false
    });

  const fileFormatState = useAtomValue(fileFormatAtom);
  const sitesDataState = useAtomValue(sitesDataAtom);

  const toggleSitesData = useToggleSitesData();
  const resetAllOptions = useResetAllOptions();

  const { handleDownload, isLoading, error, allErrors } = useDownloadManager(
    fileFormatState,
    sitesDataState
  );

  const toggleSection = (section: keyof expandedSectionsType) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const selectedSitesCount = Object.entries(sitesDataState).flatMap(
    ([siteKey, siteData]) =>
      Object.entries(siteData).filter(
        ([key, value]) =>
          !(siteKey === "archiveOfOurOwn" && key === "username") &&
          Boolean(value)
      )
  ).length;

  const selectedFormatsCount =
    Object.values(fileFormatState).filter(Boolean).length;

  return (
    <div className="w-full min-h-screen sm:h-screen bg-background text-foreground shadow-lg flex flex-col sm:flex-row">
      {/* Sidebar */}
      <aside className="w-full sm:!w-64 flex flex-col justify-between shrink-0 border-r border-gray-200 bg-white">
        <DownloadOptions fileFormatState={fileFormatState} />
        <div className="flex flex-col gap-2 justify-between items-center">
          <p className="text-sm">
            {selectedSitesCount} Site Option{selectedSitesCount !== 1 && "s"}{" "}
            Selected
          </p>
          <p className="text-sm">
            {selectedFormatsCount} Format{selectedFormatsCount !== 1 && "s"}{" "}
            Selected
          </p>
          <div className="p-4 w-full">
            <Button
              variant="outline"
              onClick={resetAllOptions}
              className="text-primary w-full hover:text-primary">
              Reset
            </Button>
          </div>
        </div>
        <div className="bg-muted">
          <div className="p-4">
            <Button
              onClick={handleDownload}
              className="w-full rounded bg-[#344955] text-white hover:bg-[hsl(203,11%,14%)]"
              disabled={
                selectedSitesCount === 0 ||
                selectedFormatsCount === 0 ||
                isLoading
              }>
              <Download className="w-4 h-4 mr-2" />
              {isLoading ? "Downloading..." : "Download Files"}
            </Button>
          </div>
          <Footer />
        </div>
      </aside>

      {/* Main panel */}
      <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <Header />
        <Main
          expandedSections={expandedSections}
          onToggle={toggleSection}
          sitesDataState={sitesDataState}
          toggleSitesData={toggleSitesData}
        />
        <div className="text-sm max-h-[300px] overflow-y-auto space-y-4">
          {allErrors.length === 0 ? (
            <p>No errors 🎉</p>
          ) : (
            <>
              <h2 className="text-sm font-medium text-gray-500 uppercase mb-2">
                Errors
              </h2>
              {allErrors.map((err, i) => (
                <div
                  key={i}
                  className="border rounded-lg p-3 bg-white shadow-sm">
                  <strong className="block font-semibold">
                    {err.name || "Unknown Error"}
                  </strong>
                  <p className="text-gray-700">{err.message || "No message"}</p>
                  {err.cause && err.cause !== err.message && (
                    <p className="text-gray-500 text-xs">{String(err.cause)}</p>
                  )}
                </div>
              ))}
            </>
          )}
        </div>

        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </main>
    </div>
  );
}
