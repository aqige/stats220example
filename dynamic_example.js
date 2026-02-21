// dynamic_example.js  (最简版：只做 3 件事：读 Rmd → 调用 rmdtext → 把 output.html 放进 iframe)

ocpu.seturl("https://www.stat-edu.cloud.edu.au/codesharey/library/codesharey/R");

$(function () {
  renderRmdToPage("dynamic_example.Rmd", "#output");
});

function renderRmdToPage(rmdFile, targetSelector) {
  const cacheBust = Date.now();

  fetch(`${rmdFile}?t=${cacheBust}`)
    .then(res => {
      if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
      return res.text();
    })
    .then(rmdText => {
      // ✅ 可选：你原来过滤 library(...) 的逻辑（保留，避免老师的“不要写 library”规则）
      // 如果你想“完全不管”，就把下面 2 行删除，直接用 rmdText
      const filtered = rmdText
        .split("\n")
        .filter(line => !line.trim().startsWith("library"))
        .join("\n");

      return ocpu.call("rmdtext", { text: filtered });
    })
    .then(session => {
      const iframe = `
        <iframe
          frameborder="0"
          width="100%"
          style="height: calc(100vh - 20px);"
          src="${session.getFileURL("output.html")}">
        </iframe>
      `;
      $(targetSelector).html(iframe);
    })
    .fail(function () {
      // OpenCPU 的失败回调不是 Promise catch，所以用 .fail
      const msg = (this && this.responseText) ? this.responseText : "Unknown OpenCPU error";
      $(targetSelector).html(
        `<pre style="white-space:pre-wrap;background:#f6f8fa;padding:12px;border-radius:8px;">${escapeHtml(msg)}</pre>`
      );
    });
}

// 简单防 XSS（把错误当纯文本显示）
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}
