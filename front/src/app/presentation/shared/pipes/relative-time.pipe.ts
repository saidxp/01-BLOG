import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeTime',
  standalone: true,
  pure: true,
})
export class RelativeTimePipe implements PipeTransform {
  transform(value: Date | string | number | null | undefined, now = Date.now()): string {
    const date = value instanceof Date ? value : new Date(value ?? Number.NaN);
    const timestamp = date.getTime();

    if (!Number.isFinite(timestamp)) {
      return 'Unknown time';
    }

    const seconds = Math.round((timestamp - now) / 1000);
    const absoluteSeconds = Math.abs(seconds);
    const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

    if (absoluteSeconds < 45) return 'Just now';
    if (absoluteSeconds < 90) return formatter.format(Math.sign(seconds), 'minute');
    if (absoluteSeconds < 45 * 60) return formatter.format(Math.round(seconds / 60), 'minute');
    if (absoluteSeconds < 90 * 60) return formatter.format(Math.sign(seconds), 'hour');
    if (absoluteSeconds < 22 * 60 * 60) return formatter.format(Math.round(seconds / 3600), 'hour');
    if (absoluteSeconds < 36 * 60 * 60) return formatter.format(Math.sign(seconds), 'day');
    if (absoluteSeconds < 7 * 24 * 60 * 60) return formatter.format(Math.round(seconds / 86400), 'day');

    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  }
}
