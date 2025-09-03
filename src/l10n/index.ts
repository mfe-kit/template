import { type Resource, resources } from './l10n.translations';
import type { Locale } from '../types.ts';
import { TranslationService } from '@mfe-kit/core';

export const l10n = new TranslationService<
  Record<Locale, Resource>,
  Locale,
  Resource
>(resources);
