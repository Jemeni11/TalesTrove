import { useEffect, useState } from "react";

import { Input, Section, SwitchItem } from "~components";
import { Bookmark, BookOpen, FileText, User, Users } from "~icons";
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
  const setAO3Username = useSetAO3Username();
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (
      (sitesDataState.archiveOfOurOwn.series ||
        sitesDataState.archiveOfOurOwn.work ||
        sitesDataState.archiveOfOurOwn.author) &&
      !sitesDataState.archiveOfOurOwn.username.trim()
    ) {
      setShowError(true);
    } else {
      setShowError(false);
    }
  }, [sitesDataState.archiveOfOurOwn]);

  const handleOptionToggle = (
    option: keyof typeof sitesDataState.archiveOfOurOwn
  ) => {
    if (option !== "username") {
      toggleSitesData("archiveOfOurOwn", option);
    }
  };

  return (
    <div className="p-4 flex-grow">
      <Section
        title="FanFiction.Net"
        expanded={expandedSections.fanfiction}
        onToggle={() => onToggle("fanfiction")}>
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
        onToggle={() => onToggle("archiveOfOurOwn")}>
        <label
          htmlFor="archiveUsername"
          className={cn(
            "block text-sm font-medium mb-1 after:content-['*'] after:ml-0.5 after:text-red-500"
          )}>
          Archive Username
        </label>
        <Input
          id="archiveUsername"
          placeholder="e.g. stoleLightningNotThunder"
          value={sitesDataState.archiveOfOurOwn.username}
          onChange={(e) => setAO3Username(e.target.value)}
        />
        <small
          className={cn(
            "my-2 text-sm text-red-500",
            showError ? "visible" : "invisible"
          )}>
          Username is required
        </small>
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
      </Section>

      <Section
        title="QuestionableQuesting"
        expanded={expandedSections.questionableQuesting}
        onToggle={() => onToggle("questionableQuesting")}>
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
  );
}
