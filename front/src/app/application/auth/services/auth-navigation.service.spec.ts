import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthNavigationService } from './auth-navigation.service';

describe('AuthNavigationService', () => {
  let service: AuthNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    service = TestBed.inject(AuthNavigationService);
  });

  it('preserves an internal return URL', () => {
    expect(service.safeReturnUrl('/post/16?from=feed')).toBe('/post/16?from=feed');
  });

  it('rejects external and protocol-relative return URLs', () => {
    expect(service.safeReturnUrl('https://example.com')).toBe('/');
    expect(service.safeReturnUrl('//example.com')).toBe('/');
  });
});
