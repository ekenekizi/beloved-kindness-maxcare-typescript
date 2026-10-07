import type { Metadata } from "next";

import config from "@payload-config";
import { generatePageMetadata, RootPage } from "@payloadcms/next/views";

import { importMap } from "../importMap";

type PageProps = {
  params: Promise<{
    segments: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string | string[];
  }>;
};

export const generateMetadata = ({
  params,
  searchParams,
}: PageProps): Promise<Metadata> =>
  generatePageMetadata({
    config,
    params,
    searchParams,
  });

export default function AdminPage({ params, searchParams }: PageProps) {
  return RootPage({
    config,
    params,
    searchParams,
    importMap,
  });
}
