import type { TeamGroup } from './members'

interface FeishuContent {
  version: 1
  syncedAt: string
  photos: { id: string; img: string; url: string; height: number; caption: string }[]
  groups: TeamGroup[]
}

// Optional build-time snapshot. Credentials and Feishu API requests stay in Actions.
const snapshots = import.meta.glob<FeishuContent>(
  '/public/content/feishu/snapshot.json',
  { eager: true, import: 'default' },
)

export const feishuContent = Object.values(snapshots)[0]
