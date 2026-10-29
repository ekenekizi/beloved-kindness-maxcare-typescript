import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
const source = fs.readFileSync(new URL("../lib/sanity-image-loader.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const exports = {};
new Function("exports", compiled)(exports);
const { sanityImageLoader, isSanityImage } = exports;
const src = "https://cdn.sanity.io/images/project/production/photo-2000x1600.jpg?w=1000&h=800&rect=10,20,1000,800&fit=crop";

test("Sanity responsive variants preserve the crop and aspect ratio", () => {
  const result = new URL(sanityImageLoader({ src, width: 384 }));
  assert.equal(result.searchParams.get("w"), "384");
  assert.equal(result.searchParams.get("h"), "307");
  assert.equal(result.searchParams.get("rect"), "10,20,1000,800");
  assert.equal(result.searchParams.get("fit"), "crop");
  assert.equal(result.searchParams.get("auto"), "format");
  assert.equal(result.searchParams.get("q"), "75");
});

test("width-only images retain fit=max and explicit quality", () => {
  const result = new URL(sanityImageLoader({ src: "https://cdn.sanity.io/images/p/d/photo.jpg?fit=max", width: 640, quality: 80 }));
  assert.equal(result.searchParams.get("w"), "640");
  assert.equal(result.searchParams.has("h"), false);
  assert.equal(result.searchParams.get("fit"), "max");
  assert.equal(result.searchParams.get("q"), "80");
});

test("local assets and non-Sanity URLs are not rewritten", () => {
  for (const value of ["/images/logo.png", "https://example.com/photo.jpg", "https://cdn.sanity.io.evil.example/images/a"]) {
    assert.equal(isSanityImage(value), false);
    assert.equal(sanityImageLoader({ src: value, width: 320 }), value);
  }
  assert.equal(isSanityImage({ src }), false);
});

test("Next emits a responsive Sanity srcset without its image proxy", () => {
  const { getImageProps } = require("next/image");
  const { props } = getImageProps({
    src, alt: "Test photo", width: 1000, height: 800,
    sizes: "(min-width: 1024px) 400px, 80vw", loader: sanityImageLoader,
  });
  assert.ok(props.srcSet.includes("640w"));
  assert.ok(props.srcSet.includes("w=640"));
  assert.ok(!props.srcSet.includes("/_next/image"));
});

test("favicon is a small, correctly encoded ICO", () => {
  const bytes = fs.readFileSync(new URL("../app/favicon.ico", import.meta.url));
  assert.equal(bytes.readUInt16LE(0), 0);
  assert.equal(bytes.readUInt16LE(2), 1);
  assert.equal(bytes.readUInt16LE(4), 1);
  assert.equal(bytes.readUInt32LE(18), 22);
  assert.ok(bytes.length < 10000);
});
