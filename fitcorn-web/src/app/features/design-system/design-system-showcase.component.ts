import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import {
  AvatarComponent,
  BadgeComponent,
  BreadcrumbComponent,
  BreadcrumbItem,
  ButtonComponent,
  CardComponent,
  CheckboxComponent,
  ChipComponent,
  InputComponent,
  PasswordInputComponent,
  PriceTagComponent,
  QuantitySelectorComponent,
  RadioComponent,
  SelectComponent,
  SwitchComponent,
  TableColumn,
  TableComponent,
  TabItem,
  TabsComponent,
  TextareaComponent,
} from '../../shared/ui';

type ColorSwatch = {
  token: string;
  className: string;
  hex: string;
  usage: string;
};

@Component({
  selector: 'app-design-system-showcase',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AvatarComponent,
    BadgeComponent,
    BreadcrumbComponent,
    ButtonComponent,
    CardComponent,
    CheckboxComponent,
    ChipComponent,
    InputComponent,
    PasswordInputComponent,
    PriceTagComponent,
    QuantitySelectorComponent,
    RadioComponent,
    SelectComponent,
    SwitchComponent,
    TableComponent,
    TabsComponent,
    TextareaComponent,
  ],
  template: `
    <div class="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(252,211,77,0.18),_transparent_28%),linear-gradient(180deg,_#fffdf7_0%,_#ffffff_38%,_#fff8ee_100%)] text-charcoal-900 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.12),_transparent_25%),linear-gradient(180deg,_var(--color-charcoal-950)_0%,_var(--color-charcoal-900)_100%)] dark:text-white">
      <div class="mx-auto max-w-[var(--container-max-width)] px-6 py-10 sm:px-8 lg:px-10 lg:py-14">
        <app-breadcrumb [items]="breadcrumbs" />

        <section class="relative overflow-hidden rounded-[2rem] border border-[var(--color-border-muted)] bg-[var(--color-surface-elevated)] p-8 shadow-[0_24px_80px_-32px_rgba(146,64,14,0.25)] sm:p-10">
          <div class="absolute inset-0 bg-[linear-gradient(135deg,_rgba(252,211,77,0.18),_transparent_34%,_rgba(245,158,11,0.08))] pointer-events-none"></div>
          <div class="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div class="max-w-3xl space-y-5">
              <p class="text-[11px] font-bold uppercase tracking-[0.32em] text-corn-600 dark:text-corn-300">Fitcorn UI Lab</p>
              <h1 class="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                Halaman referensi design system
              </h1>
              <p class="max-w-2xl text-sm leading-8 text-charcoal-600 dark:text-charcoal-350 sm:text-base">
                Satu tempat untuk melihat token warna, tipografi, field states, action patterns, dan primitive UI yang dipakai di aplikasi Fitcorn.
              </p>
            </div>

            <div class="flex flex-col gap-3 sm:flex-row">
              <app-button variant="outline" (onClick)="themeService.toggleTheme()">Toggle Theme</app-button>
              <app-button route="/">Kembali ke Beranda</app-button>
            </div>
          </div>
        </section>

        <section class="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <app-card variant="default" padding="lg" title="Foundations" subtitle="Warna, tipografi, dan semantic surfaces">
            <div class="space-y-8">
              <div class="space-y-4">
                <div class="flex items-center justify-between gap-4">
                  <h3 class="font-display text-2xl font-extrabold">Corn palette</h3>
                  <app-badge variant="premium" [dot]="true">Brand accent</app-badge>
                </div>
                <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  @for (swatch of cornPalette; track swatch.token) {
                    <div class="rounded-2xl border border-[var(--color-border-muted)] bg-[var(--color-surface-base)] p-4 shadow-sm">
                      <div [class]="swatch.className" class="h-16 rounded-xl border border-black/5"></div>
                      <div class="mt-3 space-y-1">
                        <p class="font-mono text-xs font-bold uppercase tracking-[0.18em] text-charcoal-500 dark:text-charcoal-400">{{ swatch.token }}</p>
                        <p class="text-sm font-semibold">{{ swatch.hex }}</p>
                        <p class="text-xs text-charcoal-500 dark:text-charcoal-400">{{ swatch.usage }}</p>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <div class="space-y-4">
                <h3 class="font-display text-2xl font-extrabold">Charcoal palette</h3>
                <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  @for (swatch of charcoalPalette; track swatch.token) {
                    <div class="rounded-2xl border border-[var(--color-border-muted)] bg-[var(--color-surface-base)] p-4 shadow-sm">
                      <div [class]="swatch.className" class="h-16 rounded-xl border border-black/5"></div>
                      <div class="mt-3 space-y-1">
                        <p class="font-mono text-xs font-bold uppercase tracking-[0.18em] text-charcoal-500 dark:text-charcoal-400">{{ swatch.token }}</p>
                        <p class="text-sm font-semibold">{{ swatch.hex }}</p>
                        <p class="text-xs text-charcoal-500 dark:text-charcoal-400">{{ swatch.usage }}</p>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <div class="space-y-4">
                <h3 class="font-display text-2xl font-extrabold">Typography</h3>
                <div class="grid gap-4 lg:grid-cols-2">
                  <div class="rounded-2xl border border-[var(--color-border-muted)] bg-[var(--color-surface-base)] p-5">
                    <p class="ds-label">Display font</p>
                    <p class="mt-3 font-display text-4xl font-extrabold">Outfit for headlines</p>
                    <p class="mt-3 text-sm text-charcoal-500 dark:text-charcoal-400">Dipakai untuk heading, pricing, dan hero emphasis.</p>
                  </div>
                  <div class="rounded-2xl border border-[var(--color-border-muted)] bg-[var(--color-surface-base)] p-5">
                    <p class="ds-label">Sans font</p>
                    <p class="mt-3 font-sans text-lg font-semibold">Plus Jakarta Sans for controls and body copy</p>
                    <p class="mt-3 text-sm text-charcoal-500 dark:text-charcoal-400">Dipakai untuk teks UI, deskripsi, dan label komponen.</p>
                  </div>
                </div>
              </div>
            </div>
          </app-card>

          <app-card variant="glass" padding="lg" title="Semantic Tokens" subtitle="Bagaimana surface dan feedback state dipakai">
            <div class="grid gap-4">
              <div class="rounded-2xl border border-[var(--color-border-muted)] bg-[var(--color-surface-base)] p-5">
                <p class="ds-label">Surface base</p>
                <p class="mt-2 text-sm text-charcoal-500 dark:text-charcoal-400">Background utama untuk field dan card default.</p>
              </div>
              <div class="rounded-2xl border border-[var(--color-border-muted)] bg-[var(--color-surface-subtle)] p-5">
                <p class="ds-label">Surface subtle</p>
                <p class="mt-2 text-sm text-charcoal-500 dark:text-charcoal-400">Background ringan untuk hover, muted sections, dan preview blocks.</p>
              </div>
              <div class="rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface-elevated)] p-5 shadow-sm">
                <p class="ds-label">Surface elevated</p>
                <p class="mt-2 text-sm text-charcoal-500 dark:text-charcoal-400">Surface dengan depth untuk panel besar dan showcase sections.</p>
              </div>
              <div class="rounded-2xl border border-red-300 bg-red-50 p-5 dark:bg-red-500/10 dark:border-red-500/20">
                <p class="ds-label">Danger soft</p>
                <p class="mt-2 text-sm text-red-600 dark:text-red-400">Dipakai untuk error field dan alert ringan.</p>
              </div>
              <div class="rounded-2xl border border-corn-300 bg-corn-50 p-5 dark:bg-corn-400/10 dark:border-corn-400/30">
                <p class="ds-label">Focus ring family</p>
                <p class="mt-2 text-sm text-charcoal-600 dark:text-charcoal-350">Semua field dan action utama sekarang berbagi halo fokus yang sama.</p>
              </div>
            </div>
          </app-card>
        </section>

        <section class="mt-12 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <app-card variant="default" padding="lg" title="Actions" subtitle="Buttons, badges, chips, avatars, and pricing">
            <div class="space-y-8">
              <div class="flex flex-wrap gap-3">
                <app-button size="sm">Primary</app-button>
                <app-button variant="secondary" size="sm">Secondary</app-button>
                <app-button variant="outline" size="sm">Outline</app-button>
                <app-button variant="ghost" size="sm">Ghost</app-button>
                <app-button variant="danger" size="sm">Danger</app-button>
              </div>

              <div class="flex flex-wrap gap-3">
                <app-badge variant="default">Default</app-badge>
                <app-badge variant="success" [dot]="true">Success</app-badge>
                <app-badge variant="warning" [dot]="true">Warning</app-badge>
                <app-badge variant="danger" [dot]="true">Danger</app-badge>
                <app-badge variant="premium" [dot]="true">Premium</app-badge>
              </div>

              <div class="flex flex-wrap gap-3">
                <app-chip>Default chip</app-chip>
                <app-chip variant="primary">Primary chip</app-chip>
                <app-chip variant="success">Success chip</app-chip>
                <app-chip variant="danger">Danger chip</app-chip>
              </div>

              <div class="flex flex-wrap items-center gap-4">
                <app-avatar name="Fitcorn Studio" size="sm" />
                <app-avatar name="Fitcorn Studio" size="md" />
                <app-avatar name="Fitcorn Studio" size="lg" />
                <app-avatar name="Fitcorn Studio" size="xl" />
              </div>

              <div class="rounded-2xl border border-[var(--color-border-muted)] bg-[var(--color-surface-base)] p-5">
                <p class="ds-label">Price tag example</p>
                <div class="mt-4">
                  <app-price-tag [price]="25000" [originalPrice]="32000" size="sm" />
                </div>
              </div>
            </div>
          </app-card>

          <app-card variant="default" padding="lg" title="Form Controls" subtitle="Field states and interactive input patterns">
            <div class="grid gap-5">
              <app-input [(ngModel)]="form.fullName" name="demoName" label="Nama Lengkap" placeholder="Wahyudi Fitcorn" hint="Gunakan nama yang tampil di halaman akun." />
              <app-input [(ngModel)]="form.email" name="demoEmail" type="email" label="Alamat Email" placeholder="customer@fitcorn.com" [error]="emailError()" />
              <app-password-input [(ngModel)]="form.password" name="demoPassword" label="Kata Sandi" placeholder="Masukkan kata sandi" />
              <app-select [(ngModel)]="form.flavor" name="demoFlavor" label="Rasa Favorit" hint="Select sekarang memakai fondasi field yang sama.">
                <option value="honey">Sweet Honey Butter</option>
                <option value="salt">Himalayan Salt</option>
                <option value="lava">Spicy Cheese Lava</option>
              </app-select>
              <app-textarea [(ngModel)]="form.note" name="demoNote" label="Catatan" placeholder="Tulis catatan singkat untuk preview tone dan spacing..." />

              <div class="grid gap-4 rounded-2xl border border-[var(--color-border-muted)] bg-[var(--color-surface-subtle)] p-5 lg:grid-cols-2">
                <div class="space-y-3">
                  <p class="ds-label">Selection</p>
                  <app-checkbox [(ngModel)]="toggles.marketing" name="marketingOptIn" label="Terima promo mingguan" />
                  <app-switch [(ngModel)]="toggles.darkPreview" name="darkPreview" label="Preview mode aktif" />
                </div>
                <div class="space-y-3">
                  <p class="ds-label">Radio</p>
                  <app-radio [(ngModel)]="form.packaging" name="packagingChoice" value="regular" label="Regular pouch" />
                  <app-radio [(ngModel)]="form.packaging" name="packagingChoice" value="gift" label="Gift sleeve" />
                </div>
              </div>
            </div>
          </app-card>
        </section>

        <section class="mt-12 grid gap-6">
          <app-card variant="default" padding="lg" title="Navigation Patterns" subtitle="Breadcrumb, tabs, table, and quantity selector">
            <div class="space-y-8">
              <app-tabs [tabs]="tabs" [activeTab]="activeTab()" (onChange)="activeTab.set($event)" />

              <div class="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
                <div class="rounded-2xl border border-[var(--color-border-muted)] bg-[var(--color-surface-base)] p-5">
                  <p class="ds-label">Quantity selector</p>
                  <div class="mt-4">
                    <app-quantity-selector [quantity]="quantity()" [min]="1" [max]="12" (onChange)="quantity.set($event)" />
                  </div>
                  <p class="mt-4 text-sm text-charcoal-500 dark:text-charcoal-400">Current: {{ quantity() }} pack(s)</p>
                </div>

                <app-table [columns]="tableColumns" [data]="tableRows" emptyMessage="Belum ada item showcase"></app-table>
              </div>
            </div>
          </app-card>
        </section>
      </div>
    </div>
  `,
})
export class DesignSystemShowcaseComponent {
  protected readonly themeService = inject(ThemeService);

  protected readonly breadcrumbs: BreadcrumbItem[] = [
    { label: 'Beranda', link: '/' },
    { label: 'Design System' },
  ];

  protected readonly tabs: TabItem[] = [
    { id: 'foundation', label: 'Foundation', count: 3 },
    { id: 'controls', label: 'Controls', count: 8 },
    { id: 'patterns', label: 'Patterns', count: 4 },
  ];

  protected readonly cornPalette: ColorSwatch[] = [
    { token: 'corn-100', className: 'bg-corn-100', hex: '#fef3c7', usage: 'subtle highlight' },
    { token: 'corn-300', className: 'bg-corn-300', hex: '#fcd34d', usage: 'hover accent' },
    { token: 'corn-400', className: 'bg-corn-400', hex: '#fbbf24', usage: 'primary actions' },
    { token: 'corn-500', className: 'bg-corn-500', hex: '#f59e0b', usage: 'active accent' },
    { token: 'corn-700', className: 'bg-corn-700', hex: '#b45309', usage: 'accent text' },
    { token: 'corn-950', className: 'bg-corn-950', hex: '#451a03', usage: 'deep contrast' },
  ];

  protected readonly charcoalPalette: ColorSwatch[] = [
    { token: 'charcoal-50', className: 'bg-charcoal-50', hex: '#f6f6f7', usage: 'light background' },
    { token: 'charcoal-100', className: 'bg-charcoal-100', hex: '#ececed', usage: 'subtle surface' },
    { token: 'charcoal-300', className: 'bg-charcoal-300', hex: '#b1b1b6', usage: 'disabled text' },
    { token: 'charcoal-500', className: 'bg-charcoal-500', hex: '#6b6b72', usage: 'body text' },
    { token: 'charcoal-800', className: 'bg-charcoal-800', hex: '#1c1c1e', usage: 'dark surface' },
    { token: 'charcoal-950', className: 'bg-charcoal-950', hex: '#0a0a0b', usage: 'darkest background' },
  ];

  protected readonly tableColumns: TableColumn[] = [
    { key: 'component', label: 'Component' },
    { key: 'status', label: 'Status', align: 'center' },
    { key: 'usage', label: 'Usage' },
  ];

  protected readonly tableRows = [
    { id: 1, component: 'Button', status: 'Stable', usage: 'Primary and secondary actions' },
    { id: 2, component: 'Input', status: 'Stable', usage: 'Field foundation with hint/error state' },
    { id: 3, component: 'Select', status: 'Stable', usage: 'Uses shared control styling and placeholder state' },
    { id: 4, component: 'Switch', status: 'Stable', usage: 'Compact state toggle with focus ring' },
  ];

  protected readonly activeTab = signal('foundation');
  protected readonly quantity = signal(3);

  protected readonly form = {
    fullName: 'Wahyudi Fitcorn',
    email: 'not-an-email',
    password: 'fitcorn123',
    flavor: 'honey',
    note: 'Showcase ini dipakai untuk review spacing, density, dan perilaku komponen.',
    packaging: 'gift',
  };

  protected readonly toggles = {
    marketing: true,
    darkPreview: false,
  };

  protected emailError() {
    return this.form.email.includes('@') ? '' : 'Format email tidak valid untuk preview state';
  }
}
