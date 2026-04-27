import fs from "node:fs";
import path from "node:path";

type ResolveImageInput = {
  slug: string;
  directory: string;
  extensions: readonly string[];
  fallback: string;
};

const publicRoot = path.join(process.cwd(), "public");

function normalizePublicPath(publicPath: string) {
  return publicPath.startsWith("/") ? publicPath : `/${publicPath}`;
}

function publicFileExists(publicPath: string) {
  const normalized = normalizePublicPath(publicPath);
  const diskPath = path.join(publicRoot, normalized.replace(/^\//, ""));

  return fs.existsSync(diskPath);
}

function resolveImageBySlug({ slug, directory, extensions, fallback }: ResolveImageInput) {
  const normalizedDirectory = directory.replace(/\/$/, "");
  const candidates = extensions.map((extension) => `${normalizedDirectory}/${slug}.${extension}`);
  const conventionMatch = candidates.find(publicFileExists);

  return conventionMatch ?? fallback;
}

export function resolveBrandLogo(slug: string, fallback: string) {
  return resolveImageBySlug({
    slug,
    directory: "/images/brands",
    extensions: ["png", "webp", "jpg", "jpeg", "svg"],
    fallback,
  });
}

export function resolveProductCardImage(slug: string, fallback: string) {
  return resolveImageBySlug({
    slug,
    directory: "/images/cards/products",
    extensions: ["webp", "png", "jpg", "jpeg"],
    fallback,
  });
}

export function resolveSolutionCardImage(slug: string, fallback: string) {
  return resolveImageBySlug({
    slug,
    directory: "/images/cards/solutions",
    extensions: ["webp", "png", "jpg", "jpeg"],
    fallback,
  });
}

export function resolveIndustryCardImage(slug: string, fallback: string) {
  return resolveImageBySlug({
    slug,
    directory: "/images/cards/industry",
    extensions: ["webp", "png", "jpg", "jpeg"],
    fallback,
  });
}
