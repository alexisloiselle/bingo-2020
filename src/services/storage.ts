const SAVED_STATE_KEY = "state";

export const saveState = (
  data: { id: number; tokenized: "orange" | "violet" | "blue" | "green" }[],
  name: string,
  f = "default"
) => {
  const existingState = JSON.parse(
    localStorage.getItem(SAVED_STATE_KEY) ?? "{}"
  );

  localStorage.setItem(
    SAVED_STATE_KEY,
    JSON.stringify({
      ...existingState,
      [f]: { ...existingState?.[f], [name]: data },
    })
  );
};

export const getState = (
  name: string,
  f = "default"
):
  | { id: number; tokenized: "orange" | "violet" | "blue" | "green" }[]
  | undefined => {
  const storageState = localStorage.getItem(SAVED_STATE_KEY);

  if (!storageState) {
    return undefined;
  }

  const state = JSON.parse(storageState);
  return state?.[f]?.[name];
};
