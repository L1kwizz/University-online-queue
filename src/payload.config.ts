import path from 'path'
import { buildConfig } from 'payload'
import { buildFigmaConfig } from '@payloadcms/figma'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { en as adminLanguage } from '@payloadcms/translations/languages/en'
import { fileURLToPath } from 'url'
import { Admins } from './collections/Admins'
import { Media } from './collections/Media'
import { Folders } from './collections/Folders'
import { Tags } from './collections/Tags'
import { Users } from './collections/Users'
import { Departments } from './collections/Departments'
import { Counters } from './collections/Counters'
import { QueueTickets } from './collections/QueueTickets'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const sharedOptions = {
  admin: {
    user: Admins.slug,
    constrainWidth: true,
    dashboard: {
      widgets: [],
      defaultLayout: [
        { widgetSlug: 'activity', width: 'full' },
        { widgetSlug: 'collections', width: 'full' },
      ],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  i18n: {
    fallbackLanguage: 'en',
    supportedLanguages: { en: adminLanguage },
  },
  collections: [Admins, Media, Folders, Tags, Users, Departments, Counters, QueueTickets],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  localization: {
    locales: [{ code: 'en', label: 'English' }],
    fallback: true,
    defaultLocale: 'en',
  },
  plugins: [mcpPlugin({})],
}

// В Figma Make переменная FIGMA_EID задана платформой.
// Локально (без FIGMA_EID) используется SQLite-файл в корне проекта.
const useFigma = Boolean(process.env.FIGMA_EID)

export default useFigma
  ? buildFigmaConfig({ ...sharedOptions, figma: {} } as any)
  : buildConfig({
      ...sharedOptions,
      secret: process.env.PAYLOAD_SECRET ?? 'local-dev-secret-change-me',
      editor: lexicalEditor(),
      db: sqliteAdapter({
        client: { url: `file:${path.resolve(dirname, '..', 'local.db')}` },
      }),
    } as any)