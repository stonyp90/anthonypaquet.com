import Mission from '@/components/Mission'
import { missionMetadata } from '@/lib/content/mission'

export const metadata = missionMetadata('zh')

export default function MissionPageZh() {
  return <Mission locale="zh" />
}
