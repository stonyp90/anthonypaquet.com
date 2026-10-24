import Mission from '@/components/Mission'
import { missionMetadata } from '@/lib/content/mission'

export const metadata = missionMetadata('en')

export default function MissionPage() {
  return <Mission locale="en" />
}
