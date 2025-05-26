const previewBtn = document.getElementById("previewBtn");
const contrastBtn = document.getElementById("contrastBtn");
const formatBtn = document.getElementById("formatBtn");
const clearBtn = document.getElementById("clearBtn");
const editor = document.getElementById("editor");
const preview = document.getElementById("preview");
const contador = document.getElementById("contador");

let contrastOn = false;

// Función de orden superior para aplicar formato
function toggleFormat(callback) {
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const selectedText = editor.value.substring(start, end);
  const formattedText = callback(selectedText);
  editor.setRangeText(formattedText, start, end, 'end');
}

// Callback para aplicar o quitar formato
function applyFormat(text) {
  if (text.startsWith("**") && text.endsWith("**")) {
    return text.slice(2, -2);
  } else if (text.startsWith("*") && text.endsWith("*")) {
    return text.slice(1, -1);
  } else if (text.length >= 4) {
    return `**${text}**`;
  } else {
    return `*${text}*`;
  }
}

formatBtn.addEventListener("click", () => {
  toggleFormat(applyFormat);
});

// Función de orden superior para listas numeradas
function transformarCon(callback, texto) {
  return callback(texto);
}

// Callback para transformar listas numeradas
function transformarListasNumeradas(texto) {
  return texto.replace(/(?:^|\n)(\d+\. .+(?:\n\d+\. .+)*)/gm, (match) => {
    const items = match.trim().split('\n').map(item => {
      return `<li>${item.replace(/^\d+\.\s/, '')}</li>`;
    }).join('');
    return `<ol class="list-decimal pl-5 mt-2">${items}</ol>`;
  });
}

// Función de primera clase para bloques de código
const transformarBloquesDeCodigo = function(texto) {
  return texto.replace(/```([\s\S]*?)```/gm, (match, contenido) => {
    return `<pre class="bg-gray-800 text-white p-2 rounded"><code>${contenido.trim()}</code></pre>`;
  });
};

// Conversión de markdown a HTML
function convertMarkdownToHTML(markdown) {
  let html = markdown;

  html = html.replace(/^### (.*$)/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gm, "<h1>$1</h1>");

  html = html.replace(/(?:^|\n)(\- .+(?:\n\- .+)*)/gm, (match) => {
    const items = match.trim().split('\n').map(item => `<li>${item.replace(/^\- /, '')}</li>`).join('');
    return `<ul class="list-disc pl-5 mt-2">${items}</ul>`;
  });

  html = transformarCon(transformarListasNumeradas, html);
  html = transformarBloquesDeCodigo(html);

  return html;
}

// Botón de vista previa
previewBtn.addEventListener("click", () => {
  const markdown = editor.value;
  const html = convertMarkdownToHTML(markdown);
  preview.innerHTML = html;
  actualizarContador(markdown);
});

// Botón limpiar editor
clearBtn.addEventListener("click", () => {
  editor.value = "";
  preview.innerHTML = "";
  actualizarContador("");
});

// Botón de contraste de encabezados
contrastBtn.addEventListener("click", () => {
  const headers = preview.querySelectorAll("h1, h2, h3");

  headers.forEach(header => {
    if (!contrastOn) {
      header.style.color = "#DC2626";
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

// Contador de palabras y caracteres
function actualizarContador(texto) {
  const caracteres = texto.length;
  const palabras = texto.trim().split(/\s+/).filter(Boolean).length;
  contador.textContent = `Palabras: ${palabras} | Caracteres: ${caracteres}`;
}

// Actualizar preview y contador mientras se escribe
editor.addEventListener("input", () => {
  const markdown = editor.value;
  const html = convertMarkdownToHTML(markdown);
  preview.innerHTML = html;
  actualizarContador(markdown);
});
