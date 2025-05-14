const previewBtn = document.getElementById("previewBtn");
const contrastBtn = document.getElementById("contrastBtn");
const editor = document.getElementById("editor");
const preview = document.getElementById("preview");

let contrastOn = false;

// Función para convertir Markdown básico a HTML
function convertMarkdownToHTML(markdown) {
  let html = markdown;

  // Encabezados: ###, ##, #
  html = html.replace(/^### (.*$)/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gm, "<h1>$1</h1>");

  // Listas con viñetas
  html = html.replace(/(?:^|\n)(\- .+(?:\n\- .+)*)/gm, (match) => {
    const items = match.trim().split('\n').map(item => `<li>${item.replace(/^\- /, '')}</li>`).join('');
    return `<ul class="list-disc pl-5 mt-2">${items}</ul>`;
  });

  return html;
}

// Botón de vista previa
previewBtn.addEventListener("click", () => {
  const markdown = editor.value;
  const html = convertMarkdownToHTML(markdown);
  preview.innerHTML = html;
});

// Botón de contraste de encabezados
contrastBtn.addEventListener("click", () => {
  const headers = preview.querySelectorAll("h1, h2, h3");

  headers.forEach(header => {
    if (!contrastOn) {
      header.style.color = "#DC2626"; // rojo-600
      header.style.fontSize = "1.5rem";
      header.style.fontWeight = "bold";
    } else {
      header.style.color = "";
      header.style.fontSize = "";
      header.style.fontWeight = "";
    }
  });

  contrastOn = !contrastOn;
});
