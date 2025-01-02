import logo from "data-base64:../assets/icon.png";
import { useAtomValue } from "jotai";
import { useState } from "react";

import {
  getArchiveOfOurOwnData,
  getFFFavoritesData,
  getFFFollowingData,
  getQuestionableQuestingData
} from "~adapters";
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
  QQDataType,
  sitesDataTypeKey,
  SubscriptionResult
} from "~types";
import { handleExport } from "~utils";

import "./style.css";

import { sendToBackground } from "@plasmohq/messaging";

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

  const fileFormatState = useAtomValue(fileFormatAtom);
  const sitesDataState = useAtomValue(sitesDataAtom);

  const resetAllOptions = useResetAllOptions();
  const setAO3Username = useSetAO3Username();
  const toggleFileFormat = useToggleFileFormat();
  const toggleSitesData = useToggleSitesData();

  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  const [QQData, setQQData] = useState<QQDataType[]>([]);
  const [AO3Data, setAO3Data] = useState<SubscriptionResult>({
    authors: [],
    works: [],
    series: []
  });
  const [FFFollowingData, setFFFollowingData] = useState<
    FFProcessedStoryData[]
  >([]);
  const [FFFavoritesData, setFFFavoritesData] = useState<
    FFProcessedStoryData[]
  >([]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  type SelectedOptions = Record<
    Partial<sitesDataTypeKey>,
    { subOptions: string[]; username?: string }
  >;

  const handleDownload = async () => {
    try {
      const selectedOptions_: SelectedOptions | {} = {};

      for (const site in sitesDataState) {
        const siteData = sitesDataState[site as sitesDataTypeKey];
        const subOptions = [];
        let username: string | undefined;

        for (const key in siteData) {
          if (key === "username") {
            username = siteData[key];
          } else if (siteData[key]) {
            subOptions.push(key);
          }
        }

        if (subOptions.length > 0 || username) {
          selectedOptions_[site] = {
            subOptions,
            ...(username && { username })
          };
        }
      }

      const selectedFormats = Object.entries(fileFormatState)
        .filter(([key, isSelected]) => key in fileFormatState && isSelected)
        .map(([format]) => format);

      const selectedOptions = selectedOptions_ as SelectedOptions;
      const selectedOptionsKeys = Object.keys(selectedOptions);

      if (selectedOptionsKeys.includes("questionableQuesting")) {
        const qqResponse = await sendToBackground({
          name: "adapter",
          body: {
            id: "qq"
          }
        });

        const qqData = qqResponse.message as QQDataType[];

        setQQData(qqData);

        for (const format of selectedFormats) {
          handleExport(qqData, "qq", format);
        }
      }

      if (selectedOptionsKeys.includes("archiveOfOurOwn")) {
        const ao3Response = await sendToBackground({
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

        const ao3Data = ao3Response.message as SubscriptionResult;

        setAO3Data(ao3Data);

        for (const format of selectedFormats) {
          handleExport(ao3Data.works, "ao3_works", format);
          handleExport(ao3Data.authors, "ao3_authors", format);
          handleExport(ao3Data.series, "ao3_series", format);
        }
      }

      if (selectedOptionsKeys.includes("fanfiction")) {
        if (selectedOptions.fanfiction.subOptions.includes("following")) {
          const fffollowingResponse = await sendToBackground({
            name: "adapter",
            body: {
              id: "fffollowing"
            }
          });

          const fffollowingData =
            fffollowingResponse.message as FFProcessedStoryData[];

          setFFFollowingData(fffollowingData);

          for (const format of selectedFormats) {
            handleExport(fffollowingData, "ff_following", format);
          }
        }
        if (selectedOptions.fanfiction.subOptions.includes("favorites")) {
          const fffavoritesResponse = await sendToBackground({
            name: "adapter",
            body: {
              id: "fffavorites"
            }
          });

          const fffavoritesData =
            fffavoritesResponse.message as FFProcessedStoryData[];

          setFFFavoritesData(fffavoritesData);

          for (const format of selectedFormats) {
            handleExport(fffavoritesData, "ff_favorites", format);
          }
        }
      }
    } catch (error) {
      console.error("Error during download process:", error);
    }
  };

  const selectedSitesCount = Object.values(sitesDataState)
    .flatMap((site) => Object.values(site))
    .filter(Boolean).length;

  const selectedFormatsCount =
    Object.values(fileFormatState).filter(Boolean).length;

  return (
    <div className="w-[350px] bg-background text-foreground overflow-y-auto shadow-lg flex flex-col">
      <div className="p-4 flex items-center gap-x-4">
        <img src={logo} alt="logo" width={32} height={32} />
        <h1 className="text-2xl font-bold text-black">TalesTrove</h1>
      </div>

      <div className="p-4 flex-grow">
        <Section
          title="FanFiction.Net"
          expanded={expandedSections.fanfiction}
          onToggle={() => toggleSection("fanfiction")}>
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
        </Section>

        <Section
          title="Archive Of Our Own"
          expanded={expandedSections.archiveOfOurOwn}
          onToggle={() => toggleSection("archiveOfOurOwn")}>
          <div className="mb-4">
            <label
              htmlFor="archiveUsername"
              className="block text-sm font-medium mb-1">
              Archive Username
            </label>
            <Input
              id="archiveUsername"
              placeholder="e.g. stoleLightningNotThunder"
              className="w-full"
              value={sitesDataState.archiveOfOurOwn.username}
              onChange={(e) => setAO3Username(e.target.value)}
            />
          </div>
          <SwitchItem
            icon={<BookOpen className="w-4 h-4" />}
            label="Work Subscriptions"
            checked={sitesDataState.archiveOfOurOwn.work}
            onCheckedChange={() => toggleSitesData("archiveOfOurOwn", "work")}
          />
          <SwitchItem
            icon={<FileText className="w-4 h-4" />}
            label="Series Subscriptions"
            checked={sitesDataState.archiveOfOurOwn.series}
            onCheckedChange={() => toggleSitesData("archiveOfOurOwn", "series")}
          />
          <SwitchItem
            icon={<Users className="w-4 h-4" />}
            label="Author Subscriptions"
            checked={sitesDataState.archiveOfOurOwn.author}
            onCheckedChange={() => toggleSitesData("archiveOfOurOwn", "author")}
          />
        </Section>

        <Section
          title="QuestionableQuesting"
          expanded={expandedSections.questionableQuesting}
          onToggle={() => toggleSection("questionableQuesting")}>
          <SwitchItem
            icon={<Bookmark className="w-4 h-4" />}
            label="Followed Threads"
            checked={sitesDataState.questionableQuesting.following}
            onCheckedChange={() =>
              toggleSitesData("questionableQuesting", "following")
            }
          />
        </Section>
      </div>

      <div className="mt-auto p-4 bg-muted">
        <details
          className="group"
          open={isDownloadOpen}
          onToggle={(e) => setIsDownloadOpen(e.currentTarget.open)}>
          <summary className="flex items-center justify-between cursor-pointer list-none">
            <span className="text-lg font-semibold">Download Files</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isDownloadOpen ? "transform rotate-180" : ""
              )}
            />
          </summary>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">
                {selectedSitesCount} Sites, {selectedFormatsCount} Formats
                Selected
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={resetAllOptions}
                // disabled={selectedFormatsCount + selectedSitesCount <= 0}
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
        <Button
          onClick={handleDownload}
          className="w-full rounded mt-4 bg-[hsl(203,24%,27%)] text-white hover:bg-[hsl(203,11%,14%)]"
          disabled={selectedFormatsCount === 0}>
          <Download className="w-4 h-4 mr-2" />
          Download Files
        </Button>
      </div>

      <div className="w-full text-center mt-4">
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
    </div>
  );
}
