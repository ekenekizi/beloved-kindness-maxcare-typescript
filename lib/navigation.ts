export function toHref(path: string): string {
  return `/${path.replace(/^\/+/, "")}`;
}

export function isActiveRoute(pathname: string, href: string): boolean {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}