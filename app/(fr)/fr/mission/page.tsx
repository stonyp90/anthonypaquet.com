import Mission from '@/components/Mission'
import { missionMetadata } from '@/lib/content/mission'

export const metadata = missionMetadata('fr')

export default function MissionPageFr() {
  return <Mission locale="fr" />
}
