import SiteDocument from '@/components/SiteDocument'
export { metadata, viewport } from '@/components/SiteDocument'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteDocument lang="zh-CN">{children}</SiteDocument>
}
