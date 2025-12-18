export function renderPopup(properties, schema) {
  return schema
    .map(({ key, label, type }) => {
      if (!(key in properties)) return null;

      let value = properties[key];

      return `<b>${label}:</b> ${value}`;
    })
    .filter(Boolean)
    .join("<br>");
}
