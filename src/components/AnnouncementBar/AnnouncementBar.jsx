import { useTranslation } from 'react-i18next'
import './AnnouncementBar.css'

export default function AnnouncementBar() {
  const { t } = useTranslation()
  return (
    <div className="announcement-bar" role="banner" aria-label="Promotional announcement">
      <div className="announcement-bar__inner">
        <span className="announcement-bar__text">
          🔥 <strong>{t('announcement.freeShipping')}</strong> {t('announcement.freeShippingDesc')} &nbsp;|&nbsp;
          <strong>{t('announcement.packDiscount')}</strong> {t('announcement.packCode')} <strong className="announcement-bar__code">FLEX15</strong> &nbsp;|&nbsp;
          {t('announcement.cod')}
        </span>
      </div>
    </div>
  )
}
