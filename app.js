const previewBtn = document.getElementById("previewBtn");
const contrastBtn = document.getElementById("contrastBtn");
const formatBtn = document.getElementById("formatBtn");
const clearBtn = document.getElementById("clearBtn");
const downloadBtn = document.getElementById("downloadBtn");
const editor = document.getElementById("editor");
const preview = document.getElementById("preview");
const contador = document.getElementById("contador");

let contrastOn = false;

function toggleFormat(callback) {
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const selectedText = editor.value.substring(start, end);
  const formattedText = callback(selectedText);
  editor.setRangeText(formattedText, start, end, 'end');
}

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

clearBtn.addEventListener("click", () => {
  editor.value = "";
  preview.innerHTML = "";
  actualizarContador("");
});

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

function actualizarContador(texto) {
  const caracteres = texto.length;
  const palabras = texto.trim().split(/\s+/).filter(Boolean).length;
  contador.textContent = `Palabras: ${palabras} | Caracteres: ${caracteres}`;
}

function convertMarkdownToHTML(markdown) {
  try {
    return marked.parse(markdown);
  } catch (error) {
    console.error("Error al convertir Markdown:", error);
    return "<p style='color:red;'>⚠️ Error al procesar el contenido.</p>";
  }
}

previewBtn.addEventListener("click", () => {
  try {
    const markdown = editor.value.trim();

    if (markdown === "") {
      throw new Error("⚠️ No se ingresó contenido.");
    }

    if (/^#+[^ ]/gm.test(markdown)) {
      throw new Error("❌ Encabezado mal formado. Agrega un espacio luego del '#'.");
    }

    if (/^-{1,}[^ ]/gm.test(markdown)) {
      throw new Error("❌ Lista mal formada. Usa un espacio luego del '-'.");
    }

    const html = convertMarkdownToHTML(markdown);
    preview.innerHTML = html;
    actualizarContador(markdown);
  } catch (error) {
    alert(error.message);
  }
});

editor.addEventListener("input", () => {
  const markdown = editor.value;
  const html = convertMarkdownToHTML(markdown);
  preview.innerHTML = html;
  actualizarContador(markdown);
});

// HU1: Descargar PDF desde vista previa
downloadBtn.addEventListener("click", () => {
  if (preview.innerHTML.trim() === "") {
    alert("⚠️ No hay contenido para descargar.");
    return;
  }

  const opt = {
    margin: 0.5,
    filename: "vista_previa_markdown.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
  };

  html2pdf().from(preview).set(opt).save();
});

// HU2: Advertencia al intentar salir con contenido no guardado
window.addEventListener("beforeunload", (event) => {
  if (editor.value.trim() !== "") {
    event.preventDefault();
    event.returnValue = "";
  }
});
