import fs from "fs";

const LOGO = "/brand/securecert-logo.jpg";
const logoHtml =
  '<img alt="SecureCert" class="h-8 w-auto max-w-[150px] object-contain object-left bg-white rounded-md px-1.5 py-0.5" src="' +
  LOGO +
  '"/>';
const logoEsc = logoHtml.replaceAll('"', '\\"');

function patch(path, fn) {
  const before = fs.readFileSync(path, "utf8");
  const after = fn(before);
  fs.writeFileSync(path, after);
  console.log(path, before === after ? "unchanged" : "updated");
}

patch("src/content/chrome/institution.ts", (s) => {
  // Replace remote emblem URL(s)
  let out = s.replace(
    /https:\/\/lh3\.googleusercontent\.com\/aida\/[A-Za-z0-9_-]+/g,
    LOGO,
  );
  // Remove duplicate SecureCert label after logo image (escaped TS string form)
  const dup =
    'src=\\"' +
    LOGO +
    '\\"';
  const marker =
    '<span class=\\"font-title-md text-title-md font-bold tracking-tight text-on-primary\\">SecureCert</span>';
  const idx = out.indexOf(marker);
  if (idx !== -1 && out.includes(dup)) {
    out = out.replace(marker, "");
  }
  return out;
});

patch("src/content/chrome/partner.ts", (s) => {
  const start =
    '<div class=\\"w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center\\"><span class=\\"material-symbols-outlined text-tertiary-fixed text-[20px]\\">verified_user</span></div><div class=\\"flex flex-col\\"><span class=\\"font-title-sm text-title-sm text-on-surface tracking-tight leading-none\\">SecureCert</span>';
  const i = s.indexOf(start);
  if (i === -1) return s;
  return (
    s.slice(0, i) +
    logoEsc +
    '<div class=\\"flex flex-col\\"><span class=\\"font-title-sm text-title-sm text-on-surface tracking-tight leading-none sr-only\\">SecureCert</span>' +
    s.slice(i + start.length)
  );
});

patch("src/content/chrome/admin.ts", (s) => {
  const start =
    '<div class=\\"w-7 h-7 rounded-lg bg-primary-container flex items-center justify-center\\"><span class=\\"material-symbols-outlined text-tertiary-fixed text-[18px]\\">verified_user</span></div><div class=\\"flex flex-col\\"><span class=\\"font-title-sm text-title-sm text-on-surface leading-tight tracking-tight\\">SecureCert</span>';
  const i = s.indexOf(start);
  if (i === -1) return s;
  return (
    s.slice(0, i) +
    logoEsc +
    '<div class=\\"flex flex-col\\"><span class=\\"font-title-sm text-title-sm text-on-surface leading-tight tracking-tight sr-only\\">SecureCert</span>' +
    s.slice(i + start.length)
  );
});

patch("src/content/chrome/verifier.ts", (s) => {
  const start =
    '<div class=\\"flex items-center gap-2 mb-1\\"><span class=\\"material-symbols-outlined text-primary text-[22px]\\">verified_user</span><span class=\\"font-title-md text-title-md text-primary tracking-tight font-bold\\">SecureCert</span></div>';
  const i = s.indexOf(start);
  if (i === -1) return s;
  return (
    s.slice(0, i) +
    '<div class=\\"flex items-center gap-2 mb-1\\">' +
    logoEsc +
    "</div>" +
    s.slice(i + start.length)
  );
});

console.log("done");
