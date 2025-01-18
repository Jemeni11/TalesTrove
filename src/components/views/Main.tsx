import { useEffect, useState } from "react";

import { Input, Section, SwitchItem } from "~components";
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
import { useSetAO3Username } from "~store";
import type { sitesDataType, sitesDataTypeKey, subDataParams } from "~types";

export default function Main({
  expandedSections,
  onToggle,
  sitesDataState,
  toggleSitesData
}: {
  expandedSections: {
    fanfiction: boolean;
    archiveOfOurOwn: boolean;
    questionableQuesting: boolean;
  };
  onToggle: (
    section: "fanfiction" | "archiveOfOurOwn" | "questionableQuesting"
  ) => void;
  sitesDataState: sitesDataType;
  toggleSitesData: (site: sitesDataTypeKey, subData: subDataParams) => void;
}) {
  const FanFictionOptions = () => {
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
    const [showError, setShowError] = useState(false);

    const isAnyOptionSelected =
      sitesDataState.archiveOfOurOwn.work ||
      sitesDataState.archiveOfOurOwn.series ||
      sitesDataState.archiveOfOurOwn.author;

    const hasUsername = Boolean(
      sitesDataState.archiveOfOurOwn.username?.trim()
    );

    const isValid =
      !isAnyOptionSelected || (isAnyOptionSelected && hasUsername);

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
    const setAO3Username = useSetAO3Username();
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
            <small className="mt-1 text-sm text-red-500">
              Username is required
            </small>
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

  return (
    <div className="p-4 flex-grow">
      <Section
        title="FanFiction.Net"
        expanded={expandedSections.fanfiction}
        onToggle={() => onToggle("fanfiction")}>
        <FanFictionOptions />
      </Section>

      <Section
        title="Archive Of Our Own"
        expanded={expandedSections.archiveOfOurOwn}
        onToggle={() => onToggle("archiveOfOurOwn")}>
        <AO3Options />
      </Section>

      <Section
        title="QuestionableQuesting"
        expanded={expandedSections.questionableQuesting}
        onToggle={() => onToggle("questionableQuesting")}>
        <QQOptions />
      </Section>
    </div>
  );
}
