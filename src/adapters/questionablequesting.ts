async function getQuestionableQuestingData() {
  const QQThreadsURL =
    "https://forum.questionablequesting.com/watched/threads/all";

  const response = await fetch(QQThreadsURL, {
    mode: "cors",
    credentials: "include"
  });
  const htmlText = await response.text();

  const parser = new DOMParser();
  const document = parser.parseFromString(htmlText, "text/html");

  const threadsList: HTMLOListElement = document.querySelector(
    "form[action='watched/threads/update'] > ol"
  )!;

  const liContentArray: HTMLDivElement[] = Array.from(
    threadsList.children,
    (list) => list.children[1]
  ) as unknown as HTMLDivElement[];

  console.log(liContentArray);
}

export default getQuestionableQuestingData;
