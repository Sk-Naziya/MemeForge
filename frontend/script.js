
const $ = id => document.getElementById(id);

function goTo(page) {
  window.location.href = page;
}

function safeName(text) {
  return (text || "my-meme").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 45) || "my-meme";
}

/* PAGE 1: Guest entry */
if ($("loginForm")) {
  $("loginForm").addEventListener("submit", event => {
    event.preventDefault();

    const name = $("username").value.trim();
    const pass = $("password").value;

    if (!name || !pass) return;

    sessionStorage.setItem("memeArtist", name);
    $("password").value = "";
    goTo("studio.html");
  });
}

/* PAGE 2: Meme editor */
if ($("memeCanvas")) {
  const canvas = $("memeCanvas");
  const ctx = canvas.getContext("2d");
  const artist = sessionStorage.getItem("memeArtist") || "Guest Artist";

  $("artistName").textContent = artist;

  let photo = null;
  let drag = null;
  let imageUrl = null;

  const pos = {
    top: { x: 450, y: 85 },
    bottom: { x: 450, y: 565 }
  };

  const initial = {
    topText: "",
    bottomText: "",
    fontSize: "48",
    fontFamily: "Impact",
    textColor: "#FFFFFF",
    outlineColor: "#221A1C",
    outlineWidth: "4",
    boldToggle: true,
    uppercaseToggle: true
  };

  function caption(which) {
    let value = $(which === "top" ? "topText" : "bottomText").value;
    return $("uppercaseToggle").checked ? value.toUpperCase() : value;
  }

  function font() {
    return `${$("boldToggle").checked ? "900" : "500"} ${$("fontSize").value}px "${$("fontFamily").value}"`;
  }

  function drawCaption(which) {
    const text = caption(which);
    if (!text) return;

    const p = pos[which];
    const size = Number($("fontSize").value);
    const maxWidth = canvas.width - 40;
    const lineHeight = size * 1.12;

    ctx.save();
    ctx.font = font();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineJoin = "round";
    ctx.fillStyle = $("textColor").value;
    ctx.strokeStyle = $("outlineColor").value;
    ctx.lineWidth = Number($("outlineWidth").value);

    const lines = [];
    let line = "";

    for (const word of text.split(/\s+/).filter(Boolean)) {
      const test = line ? line + " " + word : word;
      if (line && ctx.measureText(test).width > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);

    const shown = lines.slice(0, 5);
    const startY = p.y - (shown.length - 1) * lineHeight / 2;

    shown.forEach((item, i) => {
      if (ctx.lineWidth > 0) ctx.strokeText(item, p.x, startY + i * lineHeight, maxWidth);
      ctx.fillText(item, p.x, startY + i * lineHeight, maxWidth);
    });
    ctx.restore();
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (photo) {
      const scale = Math.max(
        canvas.width / photo.naturalWidth,
        canvas.height / photo.naturalHeight
      );
      const w = photo.naturalWidth * scale;
      const h = photo.naturalHeight * scale;
      ctx.drawImage(photo, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
    } else {
      const g = ctx.createLinearGradient(0, 0, 900, 650);
      g.addColorStop(0, "#FFF8FA");
      g.addColorStop(1, "#E8C5D0");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 900, 650);
      ctx.fillStyle = "#800020";
      ctx.textAlign = "center";
      ctx.font = "bold 34px Arial";
      ctx.fillText("UPLOAD A PHOTO", 450, 305);
      ctx.font = "22px Arial";
      ctx.fillText("Your meme starts here ✦", 450, 345);
    }

    drawCaption("top");
    drawCaption("bottom");
  }

  function update() {
    $("fontSizeValue").textContent = $("fontSize").value + " px";
    $("outlineValue").textContent = $("outlineWidth").value + " px";
    render();
  }

  $("imageUpload").addEventListener("change", event => {
    const file = event.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Choose a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("Please choose an image under 10 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const nextPhoto = new Image();
      nextPhoto.onload = () => {
        photo = nextPhoto;
        imageUrl = reader.result;
        render();
      };
      nextPhoto.onerror = () => alert("Could not load this image.");
      nextPhoto.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

  [
    "topText", "bottomText", "fontSize", "fontFamily",
    "textColor", "outlineColor", "outlineWidth",
    "boldToggle", "uppercaseToggle"
  ].forEach(id => {
    $(id).addEventListener("input", update);
    $(id).addEventListener("change", update);
  });

  /* Convert mouse/touch screen coordinates to canvas pixels. */
  function point(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * canvas.width / rect.width,
      y: (event.clientY - rect.top) * canvas.height / rect.height
    };
  }

  function hitTest(p) {
    ctx.save();
    ctx.font = font();

    const nearest = ["top", "bottom"].sort((a, b) =>
      Math.hypot(pos[a].x - p.x, pos[a].y - p.y) -
      Math.hypot(pos[b].x - p.x, pos[b].y - p.y)
    );

    for (const key of nearest) {
      const distance = Math.hypot(pos[key].x - p.x, pos[key].y - p.y);
      const width = Math.min(ctx.measureText(caption(key)).width, canvas.width - 40);
      if (caption(key) && distance < Math.max(45, width / 2 + 20)) {
        ctx.restore();
        return key;
      }
    }
    ctx.restore();
    return null;
  }

  function start(event) {
    const p = point(event);
    drag = hitTest(p);
    if (drag && event.cancelable) event.preventDefault();
    if (drag && event.pointerId != null && canvas.setPointerCapture) {
      try { canvas.setPointerCapture(event.pointerId); } catch (_) {}
    }
  }

  function move(event) {
    if (!drag) return;
    const p = point(event);
    pos[drag].x = Math.max(0, Math.min(canvas.width, p.x));
    pos[drag].y = Math.max(0, Math.min(canvas.height, p.y));
    if (event.cancelable) event.preventDefault();
    render();
  }

  function end() { drag = null; }

  /* Pointer Events handle mouse, touch, and stylus. */
  if ("PointerEvent" in window) {
    canvas.addEventListener("pointerdown", start);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", end);
    canvas.addEventListener("pointercancel", end);
    canvas.addEventListener("lostpointercapture", end);
  } else {
    /* Fallback for browsers without Pointer Events. */
    canvas.addEventListener("mousedown", start);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);

    canvas.addEventListener("touchstart", e => {
      if (e.touches[0]) start(e.touches[0]);
    }, { passive: false });

    canvas.addEventListener("touchmove", e => {
      if (e.touches[0]) move(e.touches[0]);
    }, { passive: false });

    canvas.addEventListener("touchend", end);
    canvas.addEventListener("touchcancel", end);
  }

  $("resetBtn").addEventListener("click", () => {
    $("topText").value = initial.topText;
    $("bottomText").value = initial.bottomText;
    $("fontSize").value = initial.fontSize;
    $("fontFamily").value = initial.fontFamily;
    $("textColor").value = initial.textColor;
    $("outlineColor").value = initial.outlineColor;
    $("outlineWidth").value = initial.outlineWidth;
    $("boldToggle").checked = initial.boldToggle;
    $("uppercaseToggle").checked = initial.uppercaseToggle;

    pos.top = { x: 450, y: 85 };
    pos.bottom = { x: 450, y: 565 };
    update();
  });

 
$("saveBtn").addEventListener("click", async () => {
  if (!photo) {
    alert("Please upload a photo before compiling your meme.");
    return;
  }

  try {
    render();

    const imageData = canvas.toDataURL("image/png");
    const title =
      $("topText").value.trim() ||
      $("bottomText").value.trim() ||
      "Meme by " + artist;

    // Keep your existing finish-page functionality
    sessionStorage.setItem("memeImage", imageData);
    sessionStorage.setItem("memeArtist", artist);

    // Save the meme in Flask + SQLite
    const response = await fetch("http://127.0.0.1:5000/api/memes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
        image_data: imageData
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Could not save meme.");
    }

    alert("Meme saved successfully! ID: " + result.meme_id);
    goTo("finish.html");

  } catch (error) {
    console.error("Meme save error:", error);
    alert(
      "Could not save your meme to the database. " +
      "Check that Flask is running and try again."
    );
  }
});

  render();
}

/* PAGE 3: Final preview and local download */
if ($("finalImage")) {
  const data = sessionStorage.getItem("memeImage");
  const artist = sessionStorage.getItem("memeArtist") || "Guest Artist";

  $("finalArtist").textContent = "✦ " + artist;
  $("finishMessage").textContent = "Beautiful work, " + artist + "! Your meme is ready.";

  if (data) {
    $("finalImage").src = data;
    $("finalImage").hidden = false;
    $("noImage").hidden = true;
  }

  $("downloadBtn").addEventListener("click", () => {
    const image = sessionStorage.getItem("memeImage");
    if (!image) {
      alert("Create a meme in the studio first.");
      goTo("studio.html");
      return;
    }

    const link = document.createElement("a");
    link.href = image;
    link.download = safeName(artist) + "-memeforge.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
  });

  $("anotherBtn").addEventListener("click", () => {
    sessionStorage.removeItem("memeImage");
    goTo("studio.html");
  });
}
