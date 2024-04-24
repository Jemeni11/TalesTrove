import { useState } from "react";

import {
  getArchiveOfOurOwnData,
  getFanFictionNetStoryData,
  getQuestionableQuestingData
} from "~adapters";
import { CustomDetails, Input } from "~components";

import "./style.css";

import Logo from "data-base64:../assets/icon.png";

export default function IndexPopup() {
  const [data, setData] = useState("");

  return (
    <div
      className="!min-w-80 min-h-96 bg-white rounded-xl "
      style={{
        padding: 16
      }}>
      <Header />
      <h2 className="text-lg font-medium mb-2">Supported Sites</h2>
      <div className="grid grid-cols-1 gap-y-3">
        <FanFictionDotNet />
        <ArchiveOfOurOwn />
        <QuestionableQuesting />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="flex items-center mb-4 gap-4">
      <img src={Logo} alt="Logo" className="size-24 rounded-lg object-cover" />
      <div>
        <h1 className="text-xl/tight font-bold text-gray-900">TalesTrove</h1>
        <p className="mt-0.5 text-gray-700">
          TalesTrove is a browser extension that allows users to easily save
          links to their favorite fictional stories and series.
        </p>
      </div>
    </div>
  );
}

function FanFictionDotNet() {
  return (
    <CustomDetails
      title="FanFiction.Net"
      children={
        <div>
          <ul className="space-y-1 border-t border-gray-200 p-4">
            <li>
              <label
                htmlFor="Following"
                className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  id="Following"
                  className="size-5 rounded border-gray-300"
                />

                <span className="text-sm font-medium text-gray-700">
                  Following
                </span>
              </label>
            </li>

            <li>
              <label
                htmlFor="Favorites"
                className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  id="Favorites"
                  className="size-5 rounded border-gray-300"
                />

                <span className="text-sm font-medium text-gray-700">
                  Favorites
                </span>
              </label>
            </li>
          </ul>
        </div>
      }
    />
  );
}

function ArchiveOfOurOwn() {
  const [username, setUsername] = useState("");

  return (
    <CustomDetails
      title="ArchiveOfOurOwn"
      children={
        <div className="p-4">
          <Input state={username} setState={setUsername} className="mb-4" />
          <ul className="space-y-1 border-gray-200">
            <li>
              <label htmlFor="Works" className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  id="Works"
                  className="size-5 rounded border-gray-300"
                />

                <span className="text-sm font-medium text-gray-700">Works</span>
              </label>
            </li>

            <li>
              <label
                htmlFor="Series"
                className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  id="Series"
                  className="size-5 rounded border-gray-300"
                />

                <span className="text-sm font-medium text-gray-700">
                  Series
                </span>
              </label>
            </li>

            <li>
              <label
                htmlFor="Authors"
                className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  id="Authors"
                  className="size-5 rounded border-gray-300"
                />

                <span className="text-sm font-medium text-gray-700">
                  Authors
                </span>
              </label>
            </li>
          </ul>
        </div>
      }
    />
  );
}

function QuestionableQuesting() {
  return (
    <CustomDetails
      title="QuestionableQuesting"
      children={
        <div>
          <ul className="space-y-1 border-t border-gray-200 p-4">
            <li>
              <label
                htmlFor="Following"
                className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  id="Following"
                  className="size-5 rounded border-gray-300"
                />

                <span className="text-sm font-medium text-gray-700">
                  Followed Threads
                </span>
              </label>
            </li>
          </ul>
        </div>
      }
    />
  );
}
