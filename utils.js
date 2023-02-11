/**
 *
 * @param {HTMLElement} each
 * @returns
 */
const linkAndText = (each) => {
  const date = each.textContent.slice(-10);
  const data = findUntilTableHeading(each.nextElementSibling, date, []);
  return data;
};

/**
 *
 * @param {HTMLElement} tag
 * @param {string} date
 * @param {[]} entries
 * @returns {{date: string, entries: []}}
 */
const findUntilTableHeading = (tag, date, entries = []) => {
  if (tag.classList && tag.classList.contains("tableHeading")) {
    return { date, entries };
  } else {
    if (
      tag.querySelector("a[href]") &&
      !tag.textContent.trim().startsWith("<<")
    ) {
      entries.push({
        title: tag.textContent.trim(),
        link: tag.querySelector("a[href]").getAttribute("href"),
      });
    }
    if (tag.nextElementSibling?.tagName.toLowerCase() === "tr") {
      return findUntilTableHeading(tag.nextElementSibling, date, entries);
    }
    return { date, entries };
  }
};

module.exports = {
  linkAndText,
  findUntilTableHeading,
};
