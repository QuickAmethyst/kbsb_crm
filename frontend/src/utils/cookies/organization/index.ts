import { NextPageContext } from "next";
import nookies, { parseCookies, setCookie } from "nookies";

export const name = `5ece4797eaf5f`;

export type OrganizationCookie = {
  id: number;
}

export function destroyOrganizationCookie(ctx?: {
  req: NextPageContext['req'];
  res: NextPageContext['res'];
}) {
  nookies.destroy(ctx, name, { path: '/' });
}

function getOrganizationCookie(ctx?: Parameters<typeof parseCookies>[0]): OrganizationCookie | null {
  if (typeof window === 'undefined') return null;
  const cookies = nookies.get(ctx, { path: '/' });
  const strCookie = cookies?.[name];

  try {
    return JSON.parse(strCookie);
  } catch (e) {
    destroyOrganizationCookie();
    return null;
  }
}

function setOrganizationCookie(cookie: OrganizationCookie, ctx?: Parameters<typeof setCookie>[0]) {
  nookies.set(ctx, name, JSON.stringify(cookie), { path: '/' });
}

export { getOrganizationCookie, setOrganizationCookie };