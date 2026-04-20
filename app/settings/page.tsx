import { unstable_noStore as noStore } from 'next/cache';
import { saveSettings } from '@/app/actions';
import { AmbienceVolumeControl } from '@/components/AmbienceVolumeControl';
import { GeneralFontScaleControl } from '@/components/GeneralFontScaleControl';
import { SettingsSaveNotice } from '@/components/SettingsSaveNotice';
import { ScriptureFontScaleControl } from '@/components/ScriptureFontScaleControl';
import { SubmitButton } from '@/components/SubmitButton';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { getSettingsPageData } from '@/lib/data';
import { DEVOTION_PLAN_OPTIONS } from '@/lib/reading-plans';

export default async function SettingsPage() {
  noStore();
  const settings = await getSettingsPageData();

  return (
    <div className="section-grid">
      <SettingsSaveNotice />
      <section className="panel-shell rounded-[36px] px-6 py-7 sm:px-8">
        <p className="eyebrow">Settings</p>
        <h1 className="mt-3 font-display text-5xl leading-none text-[color:rgb(var(--foreground-strong))]">Shape the reading environment.</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[color:rgb(var(--muted-strong))]">
          Choose a reading theme, adjust the general and Scripture font sizes, decide where the app should open, set the daily devotion plan that guides your reading, and pick the YouTube ambience track you want in the overlay.
        </p>
      </section>

      <section className="panel-shell rounded-[36px] px-6 py-7 sm:px-8">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="max-w-md">
            <GeneralFontScaleControl currentValue={settings.fontScale} returnPath="/settings" />
          </div>
          <div className="max-w-md">
            <ScriptureFontScaleControl currentValue={settings.scriptureFontScale} returnPath="/settings" />
          </div>
        </div>
      </section>

      <section className="panel-shell rounded-[36px] px-6 py-7 sm:px-8">
        <form action={saveSettings} className="grid gap-5 md:grid-cols-2">
          <input type="hidden" name="fontScale" value={settings.fontScale} />
          <input type="hidden" name="scriptureFontScale" value={settings.scriptureFontScale} />
          <label className="space-y-2">
            <span className="eyebrow">Reading Theme</span>
            <Select name="readingTheme" defaultValue={settings.readingTheme}>
              <option value="LIGHT">Light</option>
              <option value="WARM">Warm</option>
              <option value="DARK">Dark</option>
            </Select>
          </label>
          <label className="space-y-2">
            <span className="eyebrow">Background Ambience</span>
            <Select name="ambienceEnabled" defaultValue={String(settings.ambienceEnabled)}>
              <option value="false">Off by default</option>
              <option value="true">Offer ambience by default</option>
            </Select>
          </label>
          <AmbienceVolumeControl currentValue={settings.ambienceVolume} />
          <label className="space-y-2 md:col-span-2">
            <span className="eyebrow">Ambient YouTube Link</span>
            <Input
              name="ambienceYoutubeUrl"
              type="url"
              defaultValue={settings.ambienceYoutubeUrl}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <p className="text-sm leading-7 text-[color:rgb(var(--muted))]">
              Paste any YouTube watch or share link. If the link is invalid or blank, the current default track is used.
            </p>
          </label>
          <label className="space-y-2">
            <span className="eyebrow">Preferred Landing Page</span>
            <Select name="preferredLandingPage" defaultValue={settings.preferredLandingPage}>
              <option value="DASHBOARD">Dashboard</option>
              <option value="DEVOTION">Daily Devotion</option>
              <option value="BIBLE">Read the Bible</option>
              <option value="JOURNAL">Prayer Journal</option>
              <option value="PROGRESS">Progress</option>
            </Select>
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="eyebrow">Daily Devotion Plan</span>
            <Select name="dailyDevotionPlan" defaultValue={settings.dailyDevotionPlan}>
              {DEVOTION_PLAN_OPTIONS.map((plan) => (
                <option key={plan.value} value={plan.value}>{plan.label} - {plan.description}</option>
              ))}
            </Select>
          </label>
          <label className="space-y-2">
            <span className="eyebrow">Scripture Display</span>
            <Select name="scriptureDisplayMode" defaultValue={settings.scriptureDisplayMode}>
              <option value="ESV">ESV only</option>
              <option value="CUVS">CUVS only</option>
              <option value="BOTH">Show both side by side</option>
            </Select>
          </label>
          <div className="md:col-span-2">
            <SubmitButton pendingLabel="Saving settings...">Save settings</SubmitButton>
          </div>
        </form>
      </section>
    </div>
  );
}