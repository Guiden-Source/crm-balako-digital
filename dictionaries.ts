import "server-only";

const dictionaries = {
  pt: () => import("./locales/pt.json").then((module) => module.default),
};

export const getDictionary = async (locale: "pt") =>
  dictionaries[locale]();
